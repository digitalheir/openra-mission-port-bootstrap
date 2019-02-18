export interface IReadOnlyDictionary<TKey, TValue> {
    readonly Count: number;

    get(key: TKey): TValue | undefined;

    readonly Keys: IterableIterator<TKey>;
    readonly Values: IterableIterator<TValue>;

    ContainsKey(key: TKey): boolean;

    // TryGetValue(key: TKey, value: TValue): boolean;
    // First(): TValue;
}

export class ReadOnlyDictionary<TKey, TValue> implements IReadOnlyDictionary<TKey, TValue> {
    private map: Map<TKey, TValue>;

    constructor(map: Map<TKey, TValue>) {
        this.map = map;
    }

    static AsReadOnly<TKey, TValue>(dict: Map<TKey, TValue>): IReadOnlyDictionary<TKey, TValue> {
        return new ReadOnlyDictionary<TKey, TValue>(dict);
    }

    readonly Count: number = this.map.size;

    get Keys(): IterableIterator<TKey> {
        return this.map.keys()
    };

    get Values(): IterableIterator<TValue> {
        return this.map.values()
    };

    ContainsKey(key: TKey): boolean {
        return this.map.has(key);
    }

    // TryGetValue(key: TKey): TValue | undefined {
    //     if (this.map.has(key)) {
    //         return this.map.get(key);
    //     } else return value
    // }

    get(key: TKey): TValue | undefined {
        return this.map.get(key);
    }
}