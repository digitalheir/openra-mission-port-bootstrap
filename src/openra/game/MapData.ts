import {IniSection} from "../mods/common/fileformats/IniSection";
import {ActorReference} from "./ActorReference";
import {createMiniYamlNode, createMiniYamlNodes, MiniYamlNode, MiniYamlNodesWriteToString} from "../MiniYamlNode";
import {Rectangle} from "../../system/Rectangle";
import {MapOptions} from "./MapOptions";
import {FieldSaver} from "./FieldSaver";
import {SaveLuaData} from "../mods/common/fileformats/lua/generate";
import {PlayerReference} from "./map/PlayerReference";
import {SmudgeReference} from "./map/SmudgeReference";
import {MiniYaml} from "../MiniYaml";
import {TileSet} from "./map/TileSet";
import {ModData} from "./ModData";
import {First, isArray} from "../../system/Array";
import {FieldLoader, FieldLoadInfo} from "./FieldLoader";
import {MapGrid} from "./map/MapGrid";
import {ResourceTile, TerrainTile} from "./map/TileReference";

enum MapVisibility {
    Lobby = 1,
    Shellmap = 2,
    MissionSelector = 4
}


export interface MapData {
    Grid:MapGrid;
    Visibility: MapVisibility;
    Categories: string[];
    LockPreview:boolean;
    MapFormat: number;
    CellTriggers: IniSection;
    Triggers: IniSection;
    TeamTypes: IniSection;
    Waypoints: IniSection;
    Infantry: IniSection;
    Units: IniSection;
    Structures: IniSection;
    Actors: Map<string, ActorReference>;

    playerValue: string;
    player: string;
    enemy: string;
    Selectable: boolean;
    RequiresMod: string;
    Title: string;
    Description: string;
    Author: string;
    PreviewVideo: string;
    Tileset: string;
    MapSize: [number, number];
    Bounds: Rectangle;
    UseAsShellmap: boolean;
    Type: string;
    Options: MapOptions;

    modData:ModData;

    PlayerDefinitions: MiniYamlNode[];
    ActorDefinitions: MiniYamlNode[];

    RuleDefinitions: MiniYaml;
    SequenceDefinitions: MiniYaml;
    ModelSequenceDefinitions: MiniYaml;
    WeaponDefinitions: MiniYaml;
    VoiceDefinitions: MiniYaml;
    MusicDefinitions: MiniYaml;
    NotificationDefinitions: MiniYaml;
    TranslationDefinitions: MiniYaml;
}

export function hello() {
    console.log("Hello.");
}

interface MissionDataFiles {
    yaml: string;
    lua: string;
}

export enum FieldType { Normal, NodeList, MiniYaml }

function isArrayOfMiniYamlNode(field: Array<any>) {
    return field.length > 0 && field[0] instanceof MiniYamlNode;
}

function determineType(key:keyof MapData): FieldType {
    switch(key){
        case  "MapFormat":
        case  "RequiresMod":
        case  "Title":
        case  "Author":
        case  "Tileset":
        case  "Grid":
        case  "MapSize":
        case  "Bounds":
        case  "Visibility":
        case  "Categories":
        case  "LockPreview":
            return FieldType.Normal;
        case "PlayerDefinitions":
        case "ActorDefinitions":
            return FieldType.NodeList;

        case "RuleDefinitions":
        case "SequenceDefinitions":
        case "ModelSequenceDefinitions":
        case "WeaponDefinitions":
        case "VoiceDefinitions":
        case "MusicDefinitions":
        case "NotificationDefinitions":
        case "TranslationDefinitions":
            return FieldType.MiniYaml;
        default: throw new Error("Unknown field: "+key);
    }
}

class MapField {
readonly  field:FieldLoadInfo;
/*readonly  property:PropertyInfo;*/
/*readonly*/  type:FieldType;

/*readonly*/ key:string ;
/*readonly*/ fieldName:keyof MapData;
/*readonly*/ required:boolean ;
/*readonly*/ ignoreIfValue:string ;

constructor(key:string,
            fieldName:keyof MapData|undefined=undefined,
            required :boolean= true,
            ignoreIfValue:string|undefined = undefined)
{
    this.key = key;
    this.fieldName = (fieldName || key) as keyof MapData;
    const type: FieldType = determineType(this.fieldName);
    this.required = required;
    this.ignoreIfValue = ignoreIfValue;

   this.field =  new FieldLoadInfo(this.fieldName, undefined, this.fieldName); // null; typeof(Map).GetField(this.fieldName);
   //this.property = null; typeof(Map).GetProperty(this.fieldName);
   // if (!this.field && !this.property) throw new Error("Map does not have a field/property " + fieldName);
    // var t = !!this.field ? this.field.FieldType : this.property.PropertyType;
    this.type = type
        // t == typeof(isArray(this.field) && isArrayOfMiniYamlNode(this.field))
        // ? FieldType.NodeList : t instanceof MiniYaml ? FieldType.MiniYaml : FieldType.Normal;
}

public Deserialize(map:MapData, nodes:MiniYamlNode[]) {
    const node = First(nodes, n => n.Key === this.key);
    if (!node ) {
        if (this.required) throw new Error(`Required field ${this.key} not found in map.yaml`);
        return;
    }

        switch (this.type) {
            case FieldType.NodeList:
                this.field.Field.SetValue(map, node.Value.Nodes);
                break;
            case FieldType.MiniYaml:
                this.field.Field.SetValue(map, node.Value);
                break;
            default:
                FieldLoader.LoadField(map, this.fieldName, node.Value.Value);
                break;
    }
}

public Serialize(map:MapData, nodes:MiniYamlNode[]) {
    var value = this.field.Field.GetValue(map);
    if (this.type == FieldType.NodeList) {
        var listValue = value as MiniYamlNode[];
        if (this.required || listValue.length > 0)
            nodes.push(createMiniYamlNodes(this.key, null, listValue));
    }
    else if (this.type == FieldType.MiniYaml) {
        var yamlValue = value as MiniYaml;
        if (this.required || (yamlValue != null && (yamlValue.Value != null || yamlValue.Nodes.length>0)))
            nodes.push(new MiniYamlNode(this.key, yamlValue));
    }
    else
    {
        var formattedValue = FieldSaver.FormatValue(value);
        if (this.required || formattedValue != this.ignoreIfValue)
            nodes.push(createMiniYamlNode(this.key, formattedValue));
    }
}
}

const YamlFields :MapField[] = [
        new MapField("MapFormat","MapFormat"),
        new MapField("RequiresMod","RequiresMod"),
        new MapField("Title","Title"),
        new MapField("Author","Author"),
        new MapField("Tileset","Tileset"),
        new MapField("MapSize","MapSize"),
        new MapField("Bounds","Bounds"),
        new MapField("Visibility","Visibility"),
        new MapField("Categories","Categories"),
        new MapField("LockPreview","LockPreview", false,  "False"),
        new MapField("Players", "PlayerDefinitions"),
        new MapField("Actors", "ActorDefinitions"),
        new MapField("Rules", "RuleDefinitions", undefined,  "False"),
        new MapField("Sequences", "SequenceDefinitions",  false),
        new MapField("ModelSequences", "ModelSequenceDefinitions",  false),
        new MapField("Weapons", "WeaponDefinitions",  false),
        new MapField("Voices", "VoiceDefinitions",  false),
        new MapField("Music", "MusicDefinitions",  false),
        new MapField("Notifications", "NotificationDefinitions",  false),
        new MapField("Translations", "TranslationDefinitions",  false)];

export class CnCMap implements MapData {
    Grid:MapGrid;

    Categories: string[] = ["Conquest"];
    Actors: Map<string, ActorReference> = new Map<string, ActorReference>();
    CellTriggers: IniSection;
    Infantry: IniSection;
    MapFormat: number;
    Structures: IniSection;
    TeamTypes: IniSection;
    Triggers: IniSection;
    Units: IniSection;
    Waypoints: IniSection;
    enemy: string;
    player: string;
    playerValue: string;
    Selectable: boolean = true;
    Type: string = "Conquest";
    Author: string;
    Bounds: Rectangle;
    Description: string;
    MapSize: [number, number];
    PreviewVideo: string;
    RequiresMod: string;
    Tileset: string;
    Title: string;
    UseAsShellmap: boolean;
    Options: MapOptions;

    // Yaml map data
    public Players: Map<string, PlayerReference> = new Map();
    public Smudges: SmudgeReference[] = [];
    ActorDefinitions: MiniYamlNode[];
    LockPreview: boolean;
    ModelSequenceDefinitions: MiniYaml;
    MusicDefinitions: MiniYaml;
    NotificationDefinitions: MiniYaml;
    PlayerDefinitions: MiniYamlNode[];
    RuleDefinitions: MiniYaml;
    SequenceDefinitions: MiniYaml;
    TranslationDefinitions: MiniYaml;
    Visibility: MapVisibility;
    VoiceDefinitions: MiniYaml;
    WeaponDefinitions: MiniYaml;
    modData: ModData;
    /// <summary>Defines the order of the fields in map.yaml</summary>

    // save(): MissionDataFiles {
    //     this.MapFormat = 6;
    //     const root: MiniYamlNode[] = [];
    //     const fields: (keyof MapData)[] = ["Selectable",
    //         "MapFormat",
    //         "RequiresMod",
    //         "Title",
    //         "Description",
    //         "Author",
    //         "PreviewVideo",
    //         "Tileset",
    //         "MapSize",
    //         "Bounds",
    //         "UseAsShellmap",
    //         "Type",];
    //
    //     fields.forEach(field => {
    //         const v = this[field];
    //         if (v) root.push(createMiniYamlNode(field, FieldSaver.FormatValue(v)));
    //     });
    //
    //     // MapOptions newOptions = new MapOptions();
    //     this.Options.Crates = (false);
    //     this.Options.Fog = (true);
    //     this.Options.Shroud = (true);
    //     this.Options.AllyBuildRadius = (false);
    //     this.Options.FragileAlliances = (false);
    //     this.Options.StartingCash = (0);
    //     this.Options.ConfigurableStartingUnits = (false);
    //
    //     root.push(new MiniYamlNode("Options", FieldSaver.SaveDifferencesOptions(this.Options, new MapOptions())));
    //
    //     const playersYaml: MiniYamlNode[] = [];
    //     this.Players.forEach((p, pKey) =>
    //         playersYaml.push(new MiniYamlNode(`PlayerReference@${pKey}`, FieldSaver.SaveDifferencesPlayerReference(p, new PlayerReference()))));
    //     root.push(new MiniYamlNode("Players", new MiniYaml(null, playersYaml)));
    //
    //     const actorsYaml: MiniYamlNode[] = [];
    //     this.Actors.forEach((xValue, xKey) => new MiniYamlNode(xKey, xValue.Save()));
    //     root.push(new MiniYamlNode("Actors", new MiniYaml(null, actorsYaml)));
    //
    //     // todo implement this stuff in typescript?
    //     // root.push(new MiniYamlNode("Smudges", MiniYaml.FromList<SmudgeReference>(Smudges.Value)));
    //     root.push(new MiniYamlNode("Rules", new MiniYaml(null, this.AddRules())));
    //     root.push(new MiniYamlNode("Sequences", new MiniYaml(null, this.SequenceDefinitions)));
    //     root.push(new MiniYamlNode("VoxelSequences", new MiniYaml(null, this.VoxelSequenceDefinitions)));
    //     root.push(new MiniYamlNode("Weapons", new MiniYaml(null, this.WeaponDefinitions)));
    //     root.push(new MiniYamlNode("Voices", new MiniYaml(null, this.VoiceDefinitions)));
    //     root.push(new MiniYamlNode("Notifications", new MiniYaml(null, this.NotificationDefinitions)));
    //     root.push(new MiniYamlNode("Translations", new MiniYaml(null, this.TranslationDefinitions)));
    //
    //     const entries = new Map<string, string>();
    //     // entries.set("map.bin", SaveBinaryData()); // todo implement this stuff in typescript?
    //     const s = MiniYamlNodesWriteToString(root);
    //     entries.set("map.yaml", s);
    //     const lua = SaveLuaData(this);
    //     // entries.set("map.lua", luaData);
    //
    //     // todo implement this stuff in typescript?
    //     // // Add any custom assets
    //     // if (Container != null) {
    //     //     foreach(var file in Container.AllFileNames() ) {
    //     //         if (file == "map.bin" || file == "map.yaml")
    //     //             continue;
    //     //
    //     //         entries.Add(file, Container.GetContent(file).ReadAllBytes());
    //     //     }
    //     // }
    //
    //     // // Saving the map to a new location
    //     // if (toPath != Path) {
    //     //     Path = toPath;
    //     //
    //     //     // Create a new map package
    //     //     Container = GlobalFileSystem.CreatePackage(Path, int.MaxValue, entries);
    //     // }
    //     //
    //     // // Update existing package
    //     // Container.Write(entries);
    //     return {
    //         yaml: s,
    //         lua
    //     };
    // }

    AddRules(): MiniYamlNode[] {
        const RulesAdd: MiniYamlNode[] = [];
        const Player: MiniYamlNode = createMiniYamlNode("Player", "");
        const conquest: MiniYamlNode = createMiniYamlNode("\t-ConquestVictoryConditions", "");
        const missionO: MiniYamlNode = createMiniYamlNode("\tMissionObjectives", "");
        const earlyGameOver: MiniYamlNode = createMiniYamlNode("\t\tEarlyGameOver", "true");
        RulesAdd.push(Player);
        RulesAdd.push(conquest);
        RulesAdd.push(missionO);
        RulesAdd.push(earlyGameOver);

        const World: MiniYamlNode = createMiniYamlNode("World", "");
        const crateSpawner: MiniYamlNode = createMiniYamlNode("\t-CrateSpawner", "");
        const spawnMPUnits: MiniYamlNode = createMiniYamlNode("\t-SpawnMPUnits", "");
        const mPStartLocations: MiniYamlNode = createMiniYamlNode("\t-MPStartLocations", "");
        const objectivesPanel: MiniYamlNode = createMiniYamlNode("\tObjectivesPanel", "");
        const panelName: MiniYamlNode = createMiniYamlNode("\t\tPanelName", "MISSION_OBJECTIVES");
        const luaScript: MiniYamlNode = createMiniYamlNode("\tLuaScript", "");
        const src: MiniYamlNode = createMiniYamlNode("\t\tScripts", "map.lua");
        const vehicle: MiniYamlNode = createMiniYamlNode("^Vehicle", "");
        const tank: MiniYamlNode = createMiniYamlNode("^Tank", "");
        const infantry: MiniYamlNode = createMiniYamlNode("^Infantry", "");
        const plane: MiniYamlNode = createMiniYamlNode("^Plane", "");
        const ship: MiniYamlNode = createMiniYamlNode("^Ship", "");
        const building: MiniYamlNode = createMiniYamlNode("^Building", "");
        const tooltip: MiniYamlNode = createMiniYamlNode("\tTooltip", "");
        const showOwnerRow: MiniYamlNode = createMiniYamlNode("\t\tShowOwnerRow", "false");

        RulesAdd.push(World);
        RulesAdd.push(crateSpawner);
        RulesAdd.push(spawnMPUnits);
        RulesAdd.push(mPStartLocations);
        RulesAdd.push(objectivesPanel);
        RulesAdd.push(panelName);
        RulesAdd.push(luaScript);
        RulesAdd.push(src);
        RulesAdd.push(vehicle);
        RulesAdd.push(tooltip);
        RulesAdd.push(showOwnerRow);
        RulesAdd.push(tank);
        RulesAdd.push(tooltip);
        RulesAdd.push(showOwnerRow);
        RulesAdd.push(infantry);
        RulesAdd.push(tooltip);
        RulesAdd.push(showOwnerRow);
        RulesAdd.push(plane);
        RulesAdd.push(tooltip);
        RulesAdd.push(showOwnerRow);
        RulesAdd.push(ship);
        RulesAdd.push(tooltip);
        RulesAdd.push(showOwnerRow);
        RulesAdd.push(building);
        RulesAdd.push(tooltip);
        RulesAdd.push(showOwnerRow);

        return RulesAdd;
    }

}

export function createMapData(modData: ModData, tileset: TileSet, width: number, height: number): CnCMap {
    const map = new CnCMap();
    map.modData = modData;
    var size: [number,number] = [width, height];
    // todo load this like in openra
    // map.Grid = modData.Manifest.Get<MapGrid>();
    var tileRef = new TerrainTile(tileset.Templates.Keys.next().value, 0);

    map.Title = "Name your map here";
    map.Author = "Your name here";

    map.MapSize = size;
    map.Tileset = tileset.Id;

    // Empty rules that can be added to by the importers.
    // Will be dropped on save if nothing is added to it
    map.RuleDefinitions = new MiniYaml("");

    // todo
    // map.Tiles = new CellLayer<TerrainTile>(Grid.Type, size);
    // map.Resources = new CellLayer<ResourceTile>(Grid.Type, size);
    // map.Height = new CellLayer<byte>(Grid.Type, size);
    // if (map.Grid.MaximumTerrainHeight > 0)
    // {
    //     map.Height.CellEntryChanged += UpdateProjection;
    //     map.Tiles.CellEntryChanged += UpdateProjection;
    // }
    //
    // map.Tiles.Clear(tileRef);
    //
    // map.PostInit();
    return map;
}