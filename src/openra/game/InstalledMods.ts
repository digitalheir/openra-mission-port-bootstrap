import {IReadOnlyDictionary} from "./primitives/ReadOnlyDictionary";
import {Manifest} from "./Manifest";

export class InstalledMods implements IReadOnlyDictionary<string, Manifest> {
    readonly mods: Map<string, Manifest>;
    readonly Count: number = this.mods.size;
    get Keys(): IterableIterator<string> {return this.mods.keys();}
    get Values(): IterableIterator<Manifest> {return this.mods.values()};

    ContainsKey(key: string): boolean {
        return this.mods.has(key);
    }

    get(key: string): Manifest | undefined {
        return this.mods.get(key);
    }
}