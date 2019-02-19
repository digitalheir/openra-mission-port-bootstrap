export interface CPos {
    X: number;
    Y: number;
    layer: number;
}

export function createCPos(X: number, Y: number, layer: number = 0): CPos {
    return {X, Y, layer};
}

export const CPosZero = createCPos(0, 0, 0);