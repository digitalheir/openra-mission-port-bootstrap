import {IReadOnlyDictionary} from "./ReadOnlyDictionary";

export class ConcurrentCache<T, U> implements IReadOnlyDictionary<T, U> {
    readonly cache: Map<T, U>;
    readonly loader: (T) => U;

    constructor(loader: (T) => U, c?: (a: any, b: any) => number) {
        if (loader == null)
            throw new Error("loader");
        this.loader = loader;
        this.cache = new Map<T, U>();
    }

    get(key: T): U {
        const c = this.cache;
        if (c.has(key)) return c.get(key);
        else c.set(key, this.loader(key));
    }

    ContainsKey(key: T): boolean {
        return this.cache.has(key);
    }

    // bool TryGetValue(T key, out U value) { return cache.TryGetValue(key, out value); }
    get Count() {
        return this.cache.size;
    }

    get Keys(): IterableIterator<T> {
        return this.cache.keys()
    };

    get Values(): IterableIterator<U> {
        return this.cache.values()
    };

//  ICollection<T> Keys { get { return cache.Keys; } }
//  ICollection<U> Values { get { return cache.Values; } }
//  IEnumerator<KeyValuePair<T, U>> GetEnumerator() { return cache.GetEnumerator(); }
// System.Collections.IEnumerator System.Collections.IEnumerable.GetEnumerator() { return GetEnumerator(); }
}