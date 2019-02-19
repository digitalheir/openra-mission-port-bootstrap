export class CVec {
    X: number;
    Y: number;
    get LengthSquared(): number {
        return this.X * this.X + this.Y * this.Y;
    }

    constructor(x: number, y: number) {
        this.X = x;
        this.Y = y;
    }
}