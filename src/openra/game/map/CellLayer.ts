import {createRectangle, Rectangle} from "../../../system/Rectangle";
import {MapGridType} from "./MapGrid";
import {MPos, MPosClamp} from "../MPos";

export class CellLayer {
    /*public readonly*/
    Size: [number, number];
    /*readonly */
    bounds: Rectangle;
    /*public readonly */
    GridType: MapGridType;
    // public event Action<CPos> CellEntryChanged = null;
    readonly entries: number[];

    constructor(gridType: MapGridType, size: [number, number]) {
        this.Size = size;
        this.bounds = createRectangle(0, size[0]/*Width*/, size[1] /*Height*/, 0);
        this.GridType = gridType;
        let entriesSize = size[0] * size[1];
        this.entries = new Array(entriesSize);
    }

    Clamp(uv: MPos) {
        return MPosClamp(uv, createRectangle(0, this.Size[0]/*width*/ - 1, this.Size[1]/*height*/ - 1, 0))
    }
}