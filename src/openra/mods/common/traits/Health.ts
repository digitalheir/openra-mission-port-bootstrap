import {TypeHaving} from "../../../game/primitives/TypeHaving";

export class HealthInit implements TypeHaving {
    type: string = "HealthInit";
//    [FieldFromYamlKey]
    /*readonly */
    value: number = 100;
    /*readonly */
    allowZero: boolean;
// public HealthInit() { }
// public HealthInit(int init)
// : this(init, false) { }

    constructor(i: number = 100, allowZero: boolean = false) {
        this.allowZero = allowZero;
        this.value = i;
    }

// public Value(world:World): number{
//     if (this.value < 0 || (value == 0 && !allowZero))
//         return 1;
//
//     return this.value;
// }
}
