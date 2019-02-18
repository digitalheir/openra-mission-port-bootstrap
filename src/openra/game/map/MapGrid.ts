import {WVec} from "../WVec";
import {MiniYaml} from "../../MiniYaml";
import {FieldLoader} from "../FieldLoader";
import {Exts} from "../Exts";

export enum MapGridType { Rectangular, RectangularIsometric }

export enum SubCell { Invalid = 255, Any = 254, FullCell = 0, First = 1 }

export class MapGrid {
    /*public readonly*/
    Type: MapGridType = MapGridType.Rectangular;
    /*public readonly*/
    TileSize: [number, number] = [24, 24]; // [width, height]
    /*public readonly*/
    MaximumTerrainHeight: number = 0;
    /*public readonly*/
    DefaultSubCell: SubCell = 255;

    /*public readonly */
    MaximumTileSearchRange: number = 50;

    /*public readonly */
    EnableDepthBuffer: boolean = false;

    /*public readonly */
    SubCellOffsets: WVec[] = [
        new WVec(0, 0, 0),       // full cell - index 0
        new WVec(-299, -256, 0), // top left - index 1
        new WVec(256, -256, 0),  // top right - index 2
        new WVec(0, 0, 0),       // center - index 3
        new WVec(-299, 256, 0),  // bottom left - index 4
        new WVec(256, 256, 0),   // bottom right - index 5
    ];

    CellCorners: WVec[][];

    /*readonly*/
    cellCornerHalfHeights: number[][] = [
        // Flat
        [0, 0, 0, 0],

        // Slopes (two corners high)
        [0, 0, 1, 1],
        [1, 0, 0, 1],
        [1, 1, 0, 0],
        [0, 1, 1, 0],

        // Slopes (one corner high)
        [0, 0, 0, 1],
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 1, 0],

        // Slopes (three corners high)
        [1, 0, 1, 1],
        [1, 1, 0, 1],
        [1, 1, 1, 0],
        [0, 1, 1, 1],

        // Slopes (two corners high, one corner double high)
        [1, 0, 1, 2],
        [2, 1, 0, 1],
        [1, 2, 1, 0],
        [0, 1, 2, 1],

        // Slopes (two corners high, alternating)
        [1, 0, 1, 0],
        [0, 1, 0, 1],
        [1, 0, 1, 0],
        [0, 1, 0, 1]
    ];

    /*internal readonly*/
    TilesByDistance: CVec [][];

    public MapGrid(yaml: MiniYaml) {
        FieldLoader.Load(this, yaml);

        // The default subcell index defaults to the middle entry
        var defaultSubCellIndex = this.DefaultSubCell;
        if (defaultSubCellIndex == 255)
            this.DefaultSubCell = (this.SubCellOffsets.length / 2) as SubCell;
        else {
            var minSubCellOffset = this.SubCellOffsets.length > 1 ? 1 : 0;
            if (defaultSubCellIndex < minSubCellOffset || defaultSubCellIndex >= this.SubCellOffsets.length)
                throw new Error("Subcell default index must be a valid index into the offset triples and must be greater than 0 for mods with subcells");
        }

        var makeCorners = this.Type == MapGridType.RectangularIsometric ?
            /*(Func<int[], WVec[]>)*/MapGrid.IsometricCellCorners : MapGrid.RectangularCellCorners;
        this.CellCorners = this.cellCornerHalfHeights.map(makeCorners as (any) => any);
        this.TilesByDistance = this.CreateTilesByDistance();
    }

    static IsometricCellCorners(cornerHeight: number[]): WVec[] {
        return [new WVec(-724, 0, 724 * cornerHeight[0]),
            new WVec(0, -724, 724 * cornerHeight[1]),
            new WVec(724, 0, 724 * cornerHeight[2]),
            new WVec(0, 724, 724 * cornerHeight[3])];
    }

    static RectangularCellCorners(cornerHeight: number[]): WVec[] {
        return /*new WVec*/[new WVec(-512, -512, 512 * cornerHeight[0]),
            new WVec(512, -512, 512 * cornerHeight[1]),
            new WVec(512, 512, 512 * cornerHeight[2]),
            new WVec(-512, 512, 512 * cornerHeight[3])];
    }

    CreateTilesByDistance(): CVec[][] {
        var ts: CVec[][] = []; // new List<CVec>[MaximumTileSearchRange + 1];
        for (var i = 0; i < this.MaximumTileSearchRange + 1; i++)
            ts[i] = [];

        for (var j = -this.MaximumTileSearchRange; j <= this.MaximumTileSearchRange; j++)
            for (var i = -this.MaximumTileSearchRange; i <= this.MaximumTileSearchRange; i++)
                if (this.MaximumTileSearchRange * this.MaximumTileSearchRange >= i * i + j * j)
                    ts[Exts.ISqrt(i * i + j * j, Exts.ISqrtRoundMode.Ceiling)].push(new CVec(i, j));

        // Sort each integer-distance group by the actual distance
        for (var list of ts) {
            list.sort((a, b) => {
                var result = a.LengthSquared - b.LengthSquared;
                if (result != 0) return result;

                // If the lengths are equal, use other means to sort them.
                // Try the hash code first because it gives more
                // random-appearing results than X or Y that would always
                // prefer the leftmost/topmost position.
                // result = a.GetHashCode().CompareTo(b.GetHashCode());
                // if (result != 0)
                //     return result;
                //
                // result = a.X.CompareTo(b.X);
                // if (result != 0)
                //     return result;
                //
                // return a.Y.CompareTo(b.Y);

                return a.Y - b.Y;
            });
        }
        return ts;
    }

    public OffsetOfSubCell(subCell: SubCell): WVec {
        if (subCell == SubCell.Invalid || subCell == SubCell.Any)
            return WVec.Zero;

        var index = subCell;
        if (index >= 0 && index < this.SubCellOffsets.length)
            return this.SubCellOffsets[index];

        return WVec.Zero;
    }
}
