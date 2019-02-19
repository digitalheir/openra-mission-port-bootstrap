export function isArray(v: any): v is Array<any> {
    return v && v.constructor === Array;
}

function getArrayRankRec(c: number, v: any) {
    if (isArray(v)) return getArrayRankRec(c + 1, (v.length > 0) ? v[0] : undefined);
    else return c
}

export function getArrayRank(v: any[]) {
    if (v.length < 1) return 1;
    getArrayRankRec(1, v[0])
}

export function ToDictionary<K, T>(arr: T[], f: (T) => K): Map<K, T> {
    const map = new Map<K, T>();
    for (const v of arr) map.set(f(v), v);
    return map;
}

export function First<T>(arr: T[], f: (T) => boolean): T | undefined {
    for (const o of arr) if (f(o)) return o;
    return undefined;
}

export function symmetricDifference<T>(setA: Set<T>, setB: Set<T>): T[] {
    const union = new Set([...setA, ...setB]);
    return Array.from(union).filter(o => setA.has(o) && setB.has(o));
}

export function intersections<T>(setA: Set<T>, setB: Set<T>): Set<T> {
    return new Set([...setA].filter(x => setB.has(x)));
}