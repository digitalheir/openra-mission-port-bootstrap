/// <summary>
/// Projected map position
/// </summary>
import {Rectangle} from "../../system/Rectangle";

export interface MPos {
    U: number;
    V: number;
}

export function MPosClamp(uv: MPos, r: Rectangle): MPos {
    return createMPos(Math.min(r.Right, Math.max(uv.U, r.Left)), Math.min(r.Bottom, Math.max(uv.V, r.Top)));
}

export function createMPos(u: number, v: number): MPos {
    return {U: u, V: v};
}

export interface PPos /*: IEquatable<PPos>*/
{
    U: number;
    V: number;
// public static bool operator ==(PPos me, PPos other) { return me.U == other.U && me.V == other.V; }
// public static bool operator !=(PPos me, PPos other) { return !(me == other); }
// public static explicit operator MPos(PPos puv) { return new MPos(puv.U, puv.V); }
// public static explicit operator PPos(MPos uv) { return new PPos(uv.U, uv.V); }
// public PPos Clamp(Rectangle r)
// {
//     return new PPos(Math.Min(r.Right, Math.Max(U, r.Left)),
//         Math.Min(r.Bottom, Math.Max(V, r.Top)));
// }
}

export const PPosZero: PPos = createPPos(0, 0);
// public override int GetHashCode() { return U.GetHashCode() ^ V.GetHashCode(); }
// public bool Equals(PPos other) { return other == this; }
// public override bool Equals(object obj) { return obj is PPos && Equals((PPos)obj); }
export function createPPos(u, v): PPos {
    return {U: u, V: v};
}

export function PPosToString(ppos: PPos): string {
    return ppos.U + "," + ppos.V;
}
