import {ModData} from "../../../game/ModData";
import {CnCMap, createMapData, MapData} from "../../../game/MapData";
import {MapPlayers} from "../../../game/map/MapPlayers";
import {Utility} from "../../../game/IUtilityCommand";
import {Game} from "../../../game/Game";
import {IniFile} from "../../common/fileformats/IniFile";
import {IniSection} from "../../common/fileformats/IniSection";
import {Exts} from "../../../game/Exts";
import {Path} from "../../../../system/Path";
import {createPPos} from "../../../game/MPos";
import {ActorReference} from "../../../game/ActorReference";
import {createMiniYamlNode, MiniYamlNode} from "../../../MiniYamlNode";
import {MiniYaml} from "../../../MiniYaml";
import {StringBuilder} from "../../../../system/StringBuilder";
import {HealthInit} from "../../common/traits/Health";
import {FacingInit, LocationInit, OwnerInit, SubCellInit} from "../../common/ActorInitializer";
import {CPos, createCPos} from "../../../game/CPos";
import {PlayerReference} from "../../../game/map/PlayerReference";
import {HSLColor} from "../../../game/graphics/HSLColor";
import {intersections, symmetricDifference} from "../../../../system/Array";

// TO DO: fix this -- will have bitrotted pretty badly.
const namedColorMapping = {
    gold: HSLColor.FromRGB(246, 214, 121),
    blue: HSLColor.FromRGB(226, 230, 246),
    red: HSLColor.FromRGB(255, 20, 0),
    neutral: HSLColor.FromRGB(238, 238, 238),
    orange: HSLColor.FromRGB(255, 230, 149),
    teal: HSLColor.FromRGB(93, 194, 165),
    salmon: HSLColor.FromRGB(210, 153, 125),
    green: HSLColor.FromRGB(160, 240, 140),
    white: HSLColor.FromRGB(255, 255, 255),
    black: HSLColor.FromRGB(80, 80, 80),
};

function addVideoToList(videos: MiniYamlNode[], name: string, sValue) {
    videos.push(createMiniYamlNode(name, sValue.toLowerCase() + ".vqa"));
}

export abstract class ImportLegacyMapCommand {
    readonly MapSize: number;

    constructor(mapSize: number) {
        this.MapSize = mapSize;
    }

    ModData: ModData;
    Map: CnCMap;
    Players: string[] = [];
    MapPlayers: MapPlayers;
    singlePlayer: boolean;
    spawnCount: number;

    ValidateArguments(args: string[]): boolean {
        return args.length >= 2;
    }

    Run(utility: Utility, args: string[], src: string[]): CnCMap {
        // HACK: The engine code assumes that Game.modData is set.
        Game.ModData = utility.ModData;
        this.ModData = utility.ModData;

        const filename = args[1];
        const file = new IniFile(src);
        const basic = file.GetSection("Basic");
        // console.log(basic);

        const player = basic.GetValue("Player", "");
        if (!player) this.singlePlayer = !player.startsWith("Multi");

        const mapSection = file.GetSection("Map");

        const format = ImportLegacyMapCommand.GetMapFormatVersion(basic);
        this.ValidateMapFormat(format);

        // The original game isn't case sensitive, but we are.
        const tileset = ImportLegacyMapCommand.GetTileset(mapSection).toUpperCase();
        if (!this.ModData.DefaultTileSets.ContainsKey(tileset)) {
            console.warn(`Unknown tileset ${tileset}`);
            // throw new Error(`Unknown tileset ${tileset}`);
        }

        const map = createMapData(this.ModData, this.ModData.DefaultTileSets.get(tileset), tileset, this.MapSize, this.MapSize);
        map.Title = basic.GetValue("Name", Path.GetFileNameWithoutExtension(filename));
        map.Author = "Westwood Studios";
        this.Map = map;
        this.Map.RequiresMod = this.ModData.Manifest.Id;

        ImportLegacyMapCommand.SetBounds(this.Map, mapSection);

        this.ReadPacks(file, filename);
        this.ReadTrees(file);

        this.LoadVideos(file, "BASIC");
        this.LoadBriefing(file);

        this.ReadActors(file);

        // todo
        // this.LoadSmudges(file, "SMUDGE");

        const waypoints = file.GetSection("Waypoints");
        this.LoadWaypoints(waypoints);

// Create default player definitions only if there are no players to import
        this.MapPlayers = new MapPlayers(this.Map.Rules, this.Players.length == 0 ? this.spawnCount : 0);
        for (let p of this.Players)
            this.LoadPlayer(file, p);

        this.Map.PlayerDefinitions = this.MapPlayers.ToMiniYaml();

        this.Map.FixOpenAreas();

        const dest = Path.GetFileNameWithoutExtension(args[1]) + ".oramap";

        // todo save state
        // Map.Save(ZipFileLoader.Create(dest));
        // console.log(dest + " saved.");
        // console.log(JSON.stringify(this.Map));
        return this.Map;
    }

    static SetBounds(map: MapData, mapSection: IniSection) {
        const offsetX = Exts.ParseIntegerInvariant(mapSection.GetValue("X", "0"));
        const offsetY = Exts.ParseIntegerInvariant(mapSection.GetValue("Y", "0"));
        const width = Exts.ParseIntegerInvariant(mapSection.GetValue("Width", "0"));
        const height = Exts.ParseIntegerInvariant(mapSection.GetValue("Height", "0"));

        const tl = createPPos(offsetX, offsetY);
        const br = createPPos(offsetX + width - 1, offsetY + height - 1);
        map.SetBounds(tl, br);
    }

    /*
             * 1=Tiberium Dawn & Sole Survivor
             * 2=Red Alert (also with Counterstrike installed)
             * 3=Red Alert (with Aftermath installed)
             * 4=Tiberian Sun (including Firestorm) & Red Alert 2 (including Yuri's Revenge)
             */
    static GetMapFormatVersion(basicSection: IniSection): number {
        const iniFormat = basicSection.GetValue("NewINIFormat", "0");
        return Exts.TryParseIntegerInvariant(iniFormat, 0);
    }

    abstract ValidateMapFormat(format: number);

    abstract LoadPlayer(file: IniFile, section: string);

    abstract ReadPacks(file: IniFile, filename: string);

    ReadTrees(file: IniFile) {
        const terrain = file.GetSection("TERRAIN", true);
        if (!terrain) return;

        terrain.values.forEach((v, k) => {
            const loc = Exts.ParseIntegerInvariant(k);
            var treeActor = this.ParseTreeActor(v);

            var ar = new ActorReference(treeActor);
            ar.Add(new LocationInit(this.ParseActorLocation(treeActor, loc)));
            ar.Add(new OwnerInit("Neutral"));
            // var actorCount = Map.ActorDefinitions.Count;
            // Map.ActorDefinitions.push(createMiniYamlNode("Actor" + actorCount++, ar.Save()));
        });
    }

    ParseActorLocation(input: string, loc: number): CPos {
        return createCPos(loc % this.MapSize, loc / this.MapSize);
    }

    abstract ParseTreeActor(input: string): string ;

    static GetTileset(mapSection: IniSection): string {
        // NOTE: The original isn't case sensitive, we are.
        // NOTE: Tileset TEMPERAT exists in every C&C game.
        return ImportLegacyMapCommand.Truncate(mapSection.GetValue("Theater", "TEMPERAT"), 8).toUpperCase();
    }

    static Truncate(s: string, maxLength: number): string {
        return s.length <= maxLength ? s : s.substring(0, maxLength);
    }

    LoadVideos(file: IniFile, section: string) {
        const videos: MiniYamlNode[] = [];
        file.GetSection(section).values.forEach((sValue, sKey) => {
            if (sValue != "x" && sValue != "X" && sValue != "<none>") {
                switch (sKey) {
                    case "Intro":
                        addVideoToList(videos, "BackgroundVideo", sValue);
                        break;
                    case "Brief":
                        addVideoToList(videos, "BriefingVideo", sValue);
                        break;
                    case "Action":
                        addVideoToList(videos, "StartVideo", sValue);
                        break;
                    case "Win":
                        addVideoToList(videos, "WinVideo", sValue);
                        break;
                    case "Lose":
                        addVideoToList(videos, "LossVideo", sValue);
                        break;
                }
            }
        });

        if (videos.length > 0) {
            let worldNode = this.Map.RuleDefinitions.Nodes.find(n => n.Key == "World");
            if (!worldNode) {
                worldNode = new MiniYamlNode("World", new MiniYaml("", []));
                this.Map.RuleDefinitions.Nodes.push(worldNode);
            }

            let missionData = worldNode.Value.Nodes.find(n => n.Key == "MissionData");
            if (missionData == null) {
                missionData = new MiniYamlNode("MissionData", new MiniYaml("", []));
                worldNode.Value.Nodes.push(missionData);
            }

            missionData.Value.Nodes.push(...videos);
        }
    }

    LoadBriefing(file: IniFile) {
        const briefingSection = file.GetSection("Briefing", true);
        if (!briefingSection) return;

        const briefing = new StringBuilder();
        briefingSection.values.forEach((sValue, sKey) => {
            const line = sValue.replace("@", "\n");
            briefing.AppendLine(line);
        });

        if (briefing.isEmpty())
            return;

        let worldNode = this.Map.RuleDefinitions.Nodes.find(n => n.Key == "World");
        if (!worldNode) {
            worldNode = new MiniYamlNode("World", new MiniYaml("", []));
            this.Map.RuleDefinitions.Nodes.push(worldNode);
        }

        let missionData = worldNode.Value.Nodes.find(n => n.Key == "MissionData");
        if (!missionData) {
            missionData = new MiniYamlNode("MissionData", new MiniYaml("", []));
            worldNode.Value.Nodes.push(missionData);
        }

        missionData.Value.Nodes.push(createMiniYamlNode("Briefing", briefing.toString().replace(/\n/g, " ")));
    }

    ReadActors(file: IniFile) {
        this.LoadActors(file, "STRUCTURES", this.Players, this.MapSize, this.Map);
        this.LoadActors(file, "UNITS", this.Players, this.MapSize, this.Map);
        this.LoadActors(file, "INFANTRY", this.Players, this.MapSize, this.Map);
    }

    LoadActors(file: IniFile, section: string, players: string[], mapSize: number, map: MapData) {
        file.GetSection(section, true).values.forEach((sValue, sKey) => {
            // Structures: num=owner,type,health,location,turret-facing,trigger
            // Units: num=owner,type,health,location,facing,action,trigger
            // Infantry: num=owner,type,health,location,subcell,action,facing,trigger
            try {
                const parts = sValue.split(',');
                if (parts[0] == "")
                    parts[0] = "Neutral";

                // todo use set instead of array
                if (players.indexOf(parts[0]) < 0) players.push(parts[0]);

                const loc = Exts.ParseIntegerInvariant(parts[3]);
                const health = Exts.ParseIntegerInvariant(parts[2]) * 100 / 256;
                const facing = (section == "INFANTRY") ? Exts.ParseIntegerInvariant(parts[6]) : Exts.ParseIntegerInvariant(parts[4]);

                const actorType = parts[1].toLowerCase();

                const actor = new ActorReference(actorType);
                // todo what is this {};
                // {
                // new LocationInit(ParseActorLocation(actorType, loc)),
                // new OwnerInit(parts[0]),
                //};

                const initDict = actor.InitDict;
                if (health != 100)
                    initDict.Add(new HealthInit(health));
                if (facing != 0)
                    initDict.Add(new FacingInit(255 - facing));

                if (section === "INFANTRY")
                    actor.Add(new SubCellInit(Exts.ParseByte(parts[4])));

                let actorCount = map.ActorDefinitions.length;

                // todo should these actors types be added through mod somehow like in openra?
                // if (!map.Rules.Actors.ContainsKey(parts[1].toLowerCase()))
                //     console.log(`Ignoring unknown actor type: \`${parts[1].toLowerCase()}\``);
                // else {
                map.ActorDefinitions.push(new MiniYamlNode("Actor" + (actorCount), actor.Save()));
                actorCount++;
                //}
            } catch (e) {
                map.Logger.e(`Malformed actor definition: \`${sKey + ":" + sValue}\``);
                console.error(e);
            }
        });
    }


    LoadSmudges(file: IniFile, section: string) {
        const scorches: MiniYamlNode[] = [];
        const craters: MiniYamlNode[] = [];
        file.GetSection(section, true).values.forEach((sValue, sKey) => {
            // loc=type,loc,depth
            const parts = sValue.split(',');
            const loc = Exts.ParseIntegerInvariant(parts[1]);
            const type = parts[0].toLowerCase();
            const key = `${loc % this.MapSize},${loc / this.MapSize}`;
            const value = `${type},${parts[2]}`;
            const node = createMiniYamlNode(key, value);
            if (type.startsWith("sc"))
                scorches.push(node);
            else if (type.startsWith("cr"))
                craters.push(node);
        });

        let worldNode = this.Map.RuleDefinitions.Nodes.find(n => n.Key == "World");
        let worldNodeFound = !!worldNode;
        if (!worldNodeFound)
            worldNode = new MiniYamlNode("World", new MiniYaml("", []));

        if (scorches.length > 0) {
            const initialScorches = new MiniYamlNode("InitialSmudges", new MiniYaml("", scorches));
            var smudgeLayer = new MiniYamlNode("SmudgeLayer@SCORCH", new MiniYaml("", [initialScorches]));
            worldNode.Value.Nodes.push(smudgeLayer);
        }

        if (craters.length > 0) {
            const initialCraters = new MiniYamlNode("InitialSmudges", new MiniYaml("", craters));
            var smudgeLayer = new MiniYamlNode("SmudgeLayer@CRATER", new MiniYaml("", [initialCraters]));
            worldNode.Value.Nodes.push(smudgeLayer);
        }

        if (worldNode.Value.Nodes.length > 0 && !worldNodeFound)
            this.Map.RuleDefinitions.Nodes.push(worldNode);
    }

    LoadWaypoints(waypointSection: IniSection) {
        var actorCount = this.Map.ActorDefinitions.length;
        var wps: any[] = [];
        waypointSection.values.forEach((kvValue, kvKey) => {
            if (Exts.ParseIntegerInvariant(kvValue) > 0) {
                wps.push([
                    Exts.ParseIntegerInvariant(kvKey),
                    ImportLegacyMapCommand.LocationFromMapOffset(Exts.ParseIntegerInvariant(kvValue), this.MapSize)
                ]);
            }
        });

        // Add waypoint actors skipping duplicate entries
        const distincWaypoints = wps; // todo .DistinctBy(location => location.Second);
        // console.log(distincWaypoints);
        for (var kv of distincWaypoints) {
            if (!this.singlePlayer && kv[0] <= 7) {
                var ar = new ActorReference("mpspawn");
                ar.Add(new LocationInit(createCPos(kv[1][0], kv[1][2], 0)));
                ar.Add(new OwnerInit("Neutral"));

                this.Map.ActorDefinitions.push(new MiniYamlNode("Actor" + actorCount++, ar.Save()));
                this.spawnCount++;

            } else {
                var ar = new ActorReference("waypoint");
                ar.Add(new LocationInit(kv[1]));
                ar.Add(new OwnerInit("Neutral"));

                this.SaveWaypoint(kv[0], ar);
            }
        }
    }

    SaveWaypoint(waypointNumber: number, waypointReference: ActorReference) {
        var waypointName = "waypoint" + waypointNumber;
        this.Map.ActorDefinitions.push(new MiniYamlNode(waypointName, waypointReference.Save()));
    }

    static LocationFromMapOffset(offset: number, mapSize: number): [number, number] {
        return [offset % mapSize, offset / mapSize];
    }

    static SetMapPlayers(section: string, faction: string, color: string, file: IniFile, players: string[], mapPlayers: MapPlayers) {
        var pr = new PlayerReference();
        pr.Name = section;
        pr.OwnsWorld = section == "Neutral";
        pr.NonCombatant = section == "Neutral";
        pr.Faction = faction;
        pr.Color = namedColorMapping[color];

        var neutral = ["Neutral"];
        const playerSet: Set<string> = new Set(players);

        file.GetSection(section, true).values.forEach((sValue, sKey) => {
            switch (sKey) {
                case "Allies":
                    pr.Allies = Array.from(intersections(new Set(sValue.split(',')), playerSet))
                        .filter(e => e !== "Neutral");
                    pr.Enemies = (symmetricDifference(playerSet, new Set(sValue.split(','))))
                        .filter(e => e !== "Neutral");
                    break;

                default:
                    console.warn(`Ignoring unknown ${sKey}=${sValue} for player ${pr.Name}`);
                    break;
            }
        });


// Overwrite default player definitions if needed
//         if (!mapPlayers.Players.has(section))
//             mapPlayers.Players.set(section, pr);
//         else
        mapPlayers.Players.set(section, pr);
    }
}