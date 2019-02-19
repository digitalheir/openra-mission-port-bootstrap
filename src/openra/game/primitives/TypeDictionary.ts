import {TypeHaving} from "./TypeHaving";

export class TypeDictionary {
    LocationInit: number[];

    // readonly Dictionary<Type, List<object>>  = new Dictionary<Type, List<object>>();
    readonly data: Map<string, any[]> = new Map();

    Add(loadInit: TypeHaving) {
        // throw new Error("Not implemented");
        const t = loadInit.type;
        // for (var i of t.interfaces);
        //     InnerAdd(i, val);
        // foreach (var tt in t.BaseTypes());
        // InnerAdd(tt, val);

        const arr = this.data.get(t);
        if (arr) {
            arr.push(loadInit);
        } else {
            const narr = [];
            narr.push(loadInit);
            this.data.set(t, narr);
        }
    }
}