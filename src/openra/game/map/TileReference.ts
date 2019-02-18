export class TerrainTile {
    Type: number;
    Index: number;

    constructor(type: number, index: number) {
        this.Type = type;
        this.Index = index;
    }
}

export interface ResourceTile {

}

export function createTerrainTile(type: number, index: number): TerrainTile {
    return {
        Type: type, Index: index
    };
}

export function createResourceTile(type: number, index: number): ResourceTile {
    return {
        Type: type, Index: index
    };
}