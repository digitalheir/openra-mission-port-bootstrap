export interface Rectangle {
    Top: number;
    Right: number;
    Bottom: number;
    Left: number;
    Width: number;
    Height: number;
    X: number;
    Y: number;
}

export function createRectangle(top: number,
                                right: number,
                                bottom: number,
                                left: number): Rectangle {
    const Height = bottom - top;
    const Width = right - left;
    const Y = bottom - Height; // same as top
    const X = right - Width; // same as left
    return {
        Top: top,
        Right: right,
        Bottom: bottom,
        Left: left,
        Width, Height, X, Y
    };
}

export function isRectangle(o: object): o is Rectangle {
    return o.hasOwnProperty("Height") && typeof o["Height"] === "number" &&
        o.hasOwnProperty("Width") && typeof o["Width"] === "number" &&
        o.hasOwnProperty("X") && typeof o["X"] === "number" &&
        o.hasOwnProperty("Y") && typeof o["Y"] === "number" &&
        o.hasOwnProperty("Top") && typeof o["Top"] === "number" &&
        o.hasOwnProperty("Right") && typeof o["Right"] === "number" &&
        o.hasOwnProperty("Bottom") && typeof o["Bottom"] === "number" &&
        o.hasOwnProperty("Left") && typeof o["Left"] === "number";
}