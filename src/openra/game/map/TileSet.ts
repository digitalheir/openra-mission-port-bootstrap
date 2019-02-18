import {Color} from "../../../system/Color";
import {IReadOnlyDictionary} from "../primitives/ReadOnlyDictionary";
import {MiniYaml} from "../../MiniYaml";
import {FieldLoader} from "../FieldLoader";
import {BitSet} from "../primitives/BitSet";
import {TerrainTile} from "./TileReference";

export const TerrainPaletteInternalName = "terrain";

export class TerrainTileInfo {
    static FieldLoaderIgnore = ["TerrainType"];
    // [FieldLoader.Ignore]
    /*readonly*/
    TerrainType: number = 255;
    /*readonly*/
    Height: number;
    /*readonly*/
    RampType: number;
    /*readonly*/
    LeftColor: number = -1;
    /*readonly*/
    RightColor: number = -1;
    /*readonly*/
    ZOffset: number = 0.0;
    /*readonly*/
    ZRamp: number = 1.0;
}

export class TerrainTypeInfo {
    /*public readonly*/
    Type: string;
    /*public readonly TargetTypes:BitSet<TargetableType>;*/
    /*public readonly*/
    AcceptsSmudgeType: Set<string> = new Set<string>();
    /*public readonly*/
    Color: number;
    /*public readonly*/
    RestrictPlayerColor: boolean = false;
    /*public readonly*/
    CustomCursor: string;

    /*public*/
    constructor(my: MiniYaml) {
        FieldLoader.Load(this, my);
    }
}

export class TerrainTemplateInfo {
    /*readonly */
    Id: number;
    /*readonly */
    Images: string[];
    /*readonly */
    Frames: number[];
    /*readonly */
    Size: [number, number];
    /*readonly */
    PickAny: boolean;
    /*readonly */
    Categories: string[];
    /*readonly */
    Palette: string;

    tileInfo: TerrainTileInfo[];

    constructor(id?: number, images?: string[], size?: [number, number], tiles?: Uint8Array) {
        this.Id = id;
        this.Images = images;
        this.Size = size;
    }

    static createTerrainTemplateInfo(tileSet: TileSet, my: MiniYaml) {
        const tti = new TerrainTemplateInfo();
        FieldLoader.Load(tti, my);

        const nodes = my.ToDictionaryS().get("Tiles").Nodes;

        if (!tti.PickAny) {
            tti.tileInfo = new TerrainTileInfo[tti.Size[0] * tti.Size[1]];
            for (const node of nodes) {
                const key = parseInt(node.Key);
                if (!isFinite(key) || key < 0 || key >= tti.tileInfo.length)
                    throw new Error(`Invalid tile key '${node.Key}' on template '${tti.Id}' of tileset '${tileSet.Id}'.`);

                tti.tileInfo[key] = TerrainTemplateInfo.LoadTileInfo(tileSet, node.Value);
            }
        } else {
            tti.tileInfo = new TerrainTileInfo[nodes.length];

            let i = 0;
            for (const node of nodes) {
                const key = parseInt(node.Key);
                if (!isFinite(key) || key != i++)
                    throw new Error(`Invalid tile key '${node.Key}' on template '${tti.Id}' of tileset '${tileSet.Id}'.`);

                tti.tileInfo[key] = TerrainTemplateInfo.LoadTileInfo(tileSet, node.Value);
            }
        }
    }

    static LoadTileInfo(tileSet: TileSet, my: MiniYaml): TerrainTileInfo {
        const tile = new TerrainTileInfo();
        FieldLoader.Load(tile, my);

        // Terrain type must be converted from a string to an index
        tile["TerrainType"] = tileSet.GetTerrainIndex(my.Value);

        // Fall back to the terrain-type color if necessary
        const overrideColor = tileSet.TerrainInfo[tile.TerrainType].Color;
        if (tile.LeftColor === -1)
            tile["LeftColor"] = overrideColor;

        if (tile.RightColor === -1)
            tile["RightColor"] = overrideColor;

        return tile;
    }

    get(index: number): TerrainTileInfo {
        return this.tileInfo[index];
    }

    public Contains(index: number): boolean {
        return index >= 0 && index < this.tileInfo.length;
    }

    get TilesCount(): number {
        return this.tileInfo.length;
    }
}

export class TileSet {
    static FieldLoaderIgnore = new Set(["Templates", "TerrainInfo"]);
    readonly Name: string;
    readonly Id: string;
    readonly SheetSize: number = 512;
    readonly HeightDebugColors: number[] = [Color.RED];
    readonly EditorTemplateOrder: string[];
    readonly IgnoreTileSpriteOffsets: boolean;
    readonly EnableDepth: boolean = false;

//[FieldLoader.Ignore]
    Templates: IReadOnlyDictionary<number, TerrainTemplateInfo>;

//[FieldLoader.Ignore]
    TerrainInfo: TerrainTypeInfo[];
    terrainIndexByType: Map<string, number> = new Map<string, number>();
    defaultWalkableTerrainIndex: number;

// public constructor(fileSystem:IReadOnlyFileSystem , filepath:string ) {
//     var yaml = MiniYaml.FromStream(fileSystem.Open(filepath), filepath)
//         .ToDictionary(x => x.Key, x => x.Value);
//
//     // General info
//     FieldLoader.Load(this, yaml["General"]);
//
//     // TerrainTypes
//     TerrainInfo = yaml["Terrain"].ToDictionary().Values
//         .Select(y => new TerrainTypeInfo(y))
//         .OrderBy(tt => tt.Type)
//         .ToArray();
//
//     if (TerrainInfo.Length >= byte.MaxValue)
//         throw new InvalidDataException("Too many terrain types.");
//
//     for (byte i = 0; i < TerrainInfo.Length; i++)
//     {
//         var tt = TerrainInfo[i].Type;
//
//         if (terrainIndexByType.ContainsKey(tt))
//             throw new InvalidDataException("Duplicate terrain type '{0}' in '{1}'.".F(tt, filepath));
//
//         terrainIndexByType.Add(tt, i);
//     }
//
//     defaultWalkableTerrainIndex = GetTerrainIndex("Clear");
//
//     // Templates
//     Templates = yaml["Templates"].ToDictionary().Values
//         .Select(y => new TerrainTemplateInfo(this, y)).ToDictionary(t => t.Id).AsReadOnly();
// }

    constructor(name: string, id: string, terrainInfo: TerrainTypeInfo[]) {
        this.Name = name;
        this.Id = id;
        this.TerrainInfo = terrainInfo;

        if (this.TerrainInfo.length >= 255)
            throw new Error("Too many terrain types.");

        for (let i = 0; i < terrainInfo.length; i++) {
            var tt = terrainInfo[i].Type;
            if (this.terrainIndexByType.has(tt))
                throw new Error(`Duplicate terrain type '${tt}'.`/*.F(tt)*/);

            this.terrainIndexByType.set(tt, i);
        }

        this.defaultWalkableTerrainIndex = this.GetTerrainIndex("Clear");
    }

    get(index: number): TerrainTypeInfo {
        return this.TerrainInfo[index];
    }

    TryGetTerrainIndex(type: string /*, out byte index*/): number | undefined {
        return this.terrainIndexByType.get(type/*, out index*/);
    }

    GetTerrainIndex(type: string): number {
        // byte index;
        const v = this.terrainIndexByType.get(type);
        if (v) return v;
        else throw new Error("Tileset '{0}' lacks terrain type '{1}'"/*.F(Id, type)*/);
    }

    public GetTerrainIndexByTile(r: TerrainTile): number {
        const tpl: TerrainTemplateInfo = this.Templates.get(r.Type);
        if (tpl === undefined) return this.defaultWalkableTerrainIndex;

        if (tpl.Contains(r.Index)) {
            const tile = tpl[r.Index];
            if (tile != null && tile.TerrainType != 255)
                return tile.TerrainType;
        }

        return this.defaultWalkableTerrainIndex;
    }

    public GetTileInfo(r: TerrainTile): TerrainTileInfo {
        const tpl: TerrainTemplateInfo = this.Templates.get(r.Type);
        if (tpl === undefined) return null;
        else return tpl.Contains(r.Index) ? tpl[r.Index] : null;
    }
}