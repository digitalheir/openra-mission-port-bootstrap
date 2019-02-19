import {createMPos, MPos, PPos} from "../MPos";
import {MapData} from "../MapData";
import {MapGridType} from "./MapGrid";

export class ProjectedCellRegion {

    // Corners of the region
    /*public readonly */ TopLeft:PPos;
    /*public readonly */ BottomRight:PPos;

    // Corners of the bounding map region that contains all the cells that
    // may be projected within this region.
   /* readonly*/ mapTopLeft:MPos ;
   /* readonly*/ mapBottomRight:MPos ;

   constructor( map:MapData, topLeft:PPos , bottomRight:PPos ){
       this.TopLeft = topLeft;
       this.BottomRight = bottomRight;

       // The projection from MPos -> PPos cannot produce a larger V coordinate
       // so the top edge of the MPos region is the same as the PPos region.
       // (in fact the cells are identical if height == 0)
       this.mapTopLeft = topLeft as MPos;

       // The bottom edge is trickier: cells at MPos.V > bottomRight.V may have
       // been projected into this region if they have height > 0.
       // Each height step is equivalent to 512 WDist units, which is one MPos
       // step for isometric cells, but only half a MPos step for classic cells. Doh!
       const maxHeight = map.Grid.MaximumTerrainHeight;
       const heightOffset = map.Grid.Type == MapGridType.RectangularIsometric ? maxHeight : maxHeight / 2;

       // Use the map Height data array to clamp the bottom coordinate so it doesn't overflow the map
       this.mapBottomRight = map.Height.Clamp(createMPos(bottomRight.U, bottomRight.V + heightOffset));
   }
}