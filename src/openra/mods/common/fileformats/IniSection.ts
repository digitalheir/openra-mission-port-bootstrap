export class IniSection {
    readonly name: string;
    readonly values: Map<string, string>;

    constructor(name: string) {
        this.name = name;
        this.values = new Map<string, string>();
    }

    Add(key: string, value: string) {
        this.values.set(key, value)
    }

    Contains(key: string): boolean {
        return this.values.has(key);
    }

    GetValue(key: string, defaultValue: string): string {
        if (this.values.has(key)) return this.values.get(key); else return defaultValue;
    }

// public IEnumerator<KeyValuePair<string, string>> GetEnumerator()
// {
//     return values.GetEnumerator();
// }
//
// IEnumerator IEnumerable.GetEnumerator()
// {
//     return GetEnumerator();
// }
}
