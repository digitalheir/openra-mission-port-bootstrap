export interface WPos {
    X: number;
    Y: number;
    Z: number;
}

export function createWPos(X: number, Y: number, Z: number): WPos {
    return {X, Y, Z};
}