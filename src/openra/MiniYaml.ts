import {MiniYamlNode, MiniYamlNodesToLines} from "./MiniYamlNode";

export class MiniYaml {
    static readonly StringIdentity: (string) => string = s => s;
    static readonly MiniYamlIdentity: (MiniYaml) => MiniYaml = s => s;
    readonly Value: string;
    readonly Nodes: MiniYamlNode[];

    constructor(value: string, nodes?: MiniYamlNode[]) {
        this.Value = value;
        this.Nodes = nodes ? nodes : [];
    }

    public ToLines(key: string, comment: string = null): string[] {
        const hasKey = !!key;
        const hasValue = !!this.Value;
        const hasComment = !!comment;
        const arr = [(hasKey ? key + ":" : "")
        + (hasValue ? " " + this.Value.replace("#", "\\#") : "")
        + (hasComment ? (hasKey || hasValue ? " " : "") + "#" + comment : "")];

        if (this.Nodes != null) {
            MiniYamlNodesToLines(this.Nodes).forEach(line => arr.push("\t" + line));
        }
        return arr;
    }

    public ToDictionaryS<TKey, TElement>() {
        return this.ToDictionary(MiniYaml.StringIdentity, MiniYaml.MiniYamlIdentity);
    }

    public ToDictionaryKS<TKey, TElement>(keySelector: (string) => TKey) {
        return this.ToDictionary(keySelector, MiniYaml.MiniYamlIdentity);
    }

    public ToDictionaryES<TKey, TElement>(elementSelector: (string) => TElement) {
        return this.ToDictionary(MiniYaml.StringIdentity, elementSelector);
    }

    public ToDictionary<TKey, TElement>(keySelector: (string) => TKey, elementSelector: (string) => TElement) {
        const ret = new Map<TKey, TElement>();
        for (const y of this.Nodes) {
            const key = keySelector(y.Key);
            const element = elementSelector(y.Value);
            if (ret.has(key)) throw new Error(`Duplicate key '${y.Key}' in ${y.Value}`);
            ret.set(key, element);
        }
        return ret;
    }
}