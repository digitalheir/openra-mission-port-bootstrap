export class WVec {
    static Zero = new WVec(0, 0, 0);

    X: number;
    Y: number;
    Z: number;

    constructor(x: number, y: number, z: number,) {
        this.X = x;
        this.Y = y;
        this.Z = z;
    }
}