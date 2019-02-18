import {MiniYaml} from "./MiniYaml";

export class MiniYamlNode {
    readonly Key: string;
    readonly Value: MiniYaml;
    readonly Comment: string;

    constructor(k: string, v: MiniYaml, c?: string) {
        this.Key = k;
        this.Value = v;
        this.Comment = c;
    }
}

export function createMiniYamlNode(k: string, v: string, c?: string) {
    return new MiniYamlNode(k, new MiniYaml(v, []), c);
}

export function createMiniYamlNodes(k: string, v: string, n: MiniYamlNode[], c?: string) {
    return new MiniYamlNode(k, new MiniYaml(v, n), c);
}

export function MiniYamlNodesToLines(root: MiniYamlNode[]): string[] {
    const arr = [];
    for (const node of root)
        for (const line of node.Value.ToLines(node.Key, node.Comment))
            arr.push(line);
    return arr;
}


export function MiniYamlNodesWriteToString(root: MiniYamlNode[]): string {
    return MiniYamlNodesToLines(root).join("\n");
}

