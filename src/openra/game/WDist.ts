export class WDist {
    Length: number;

    constructor(r: number) {
        this.Length = r;
    }

    get LengthSquared(): number {
        return this.Length * this.Length;
    };
}