import {ModData} from "../../../game/ModData";
import {createMapData, MapData} from "../../../game/MapData";
import {MapPlayers} from "../../../game/map/MapPlayers";
import {Utility} from "../../../game/IUtilityCommand";
import {Game} from "../../../game/Game";
import {IniFile} from "../../common/fileformats/IniFile";

export abstract class ImportLegacyMapCommand {
    readonly MapSize: number;

    constructor(mapSize: number) {
        this.MapSize = mapSize;
    }

    ModData: ModData;
    Map: MapData;
    Players: string[] = [];
    MapPlayers: MapPlayers;
    singlePlayer: boolean;
    spawnCount: number;

    ValidateArguments(args: string[]): boolean {
        return args.length >= 2;
    }

    Run(utility:Utility , args:string[], src: string[] ) {
    // HACK: The engine code assumes that Game.modData is set.
    Game.ModData = utility.ModData;
    this.ModData =utility.ModData;

    var file = new IniFile(src);
    var basic = file.GetSection("Basic");

    var player = basic.GetValue("Player", "");
    if (!player) this.singlePlayer = !player.startsWith("Multi");

    var mapSection = file.GetSection("Map");

    var format = GetMapFormatVersion(basic);
    ValidateMapFormat(format);

    // The original game isn't case sensitive, but we are.
    var tileset = GetTileset(mapSection).ToUpperInvariant();
    if (!ModData.DefaultTileSets.ContainsKey(tileset))
    throw new InvalidDataException("Unknown tileset {0}".F(tileset));

   const   map = createMapData(this.ModData, this.ModData.DefaultTileSets[tileset], this.MapSize, this.MapSize);
           map.Title = basic.GetValue("Name", Path.GetFileNameWithoutExtension(filename));
           map.Author = "Westwood Studios";
this.Map = map;
    this.Map.RequiresMod = ModData.Manifest.Id;

SetBounds(Map, mapSection);

ReadPacks(file, filename);
ReadTrees(file);

LoadVideos(file, "BASIC");
LoadBriefing(file);

ReadActors(file);

LoadSmudges(file, "SMUDGE");

var waypoints = file.GetSection("Waypoints");
LoadWaypoints(waypoints);

// Create default player definitions only if there are no players to import
MapPlayers = new MapPlayers(Map.Rules, Players.Count == 0 ? spawnCount : 0);
foreach (var p in Players)
LoadPlayer(file, p);

Map.PlayerDefinitions = MapPlayers.ToMiniYaml();

Map.FixOpenAreas();

var dest = Path.GetFileNameWithoutExtension(args[1]) + ".oramap";

Map.Save(ZipFileLoader.Create(dest));
Console.WriteLine(dest + " saved.");
}

}