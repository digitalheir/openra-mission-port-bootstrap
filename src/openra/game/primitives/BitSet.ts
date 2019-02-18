export interface BitSet<T> /*IEnumerable<string>, IEquatable<BitSet<T>> where T : class*/{
    /*readonly */bits:BigInteger ;

//     public BitSet(params string[] values) : this(BitSetAllocator<T>.GetBits(values)) { }
// BitSet(BitSetIndex bits) { this.bits = bits; }
//
// public static BitSet<T> FromStringsNoAlloc(string[] values)
// {
//     return new BitSet<T>(BitSetAllocator<T>.GetBitsNoAlloc(values)) { };
// }
//
// public override string ToString()
// {
//     return BitSetAllocator<T>.GetStrings(bits).JoinWith(",");
// }
//
// public static bool operator ==(BitSet<T> me, BitSet<T> other) { return me.bits == other.bits; }
// public static bool operator !=(BitSet<T> me, BitSet<T> other) { return !(me == other); }
//
// public bool Equals(BitSet<T> other) { return other == this; }
// public override bool Equals(object obj) { return obj is BitSet<T> && Equals((BitSet<T>)obj); }
// public override int GetHashCode() { return bits.GetHashCode(); }
//
// public bool IsEmpty { get { return bits == 0; } }
//
// public bool IsProperSubsetOf(BitSet<T> other)
// {
//     return IsSubsetOf(other) && !SetEquals(other);
// }
//
// public bool IsProperSupersetOf(BitSet<T> other)
// {
//     return IsSupersetOf(other) && !SetEquals(other);
// }
//
// public bool IsSubsetOf(BitSet<T> other)
// {
//     return (bits | other.bits) == other.bits;
// }
//
// public bool IsSupersetOf(BitSet<T> other)
// {
//     return (bits | other.bits) == bits;
// }
//
// public bool Overlaps(BitSet<T> other)
// {
//     return (bits & other.bits) != 0;
// }
//
// public bool SetEquals(BitSet<T> other)
// {
//     return bits == other.bits;
// }
//
// public bool Contains(string value)
// {
//     return BitSetAllocator<T>.BitsContainString(bits, value);
// }
//
// public IEnumerator<string> GetEnumerator()
// {
//     return BitSetAllocator<T>.GetStrings(bits).GetEnumerator();
// }
//
// IEnumerator IEnumerable.GetEnumerator()
// {
//     return GetEnumerator();
// }
//
// public BitSet<T> Except(BitSet<T> other)
// {
//     return new BitSet<T>(bits & ~other.bits);
// }
//
// public BitSet<T> Intersect(BitSet<T> other)
// {
//     return new BitSet<T>(bits & other.bits);
// }
//
// public BitSet<T> SymmetricExcept(BitSet<T> other)
// {
//     return new BitSet<T>(bits ^ other.bits);
// }
//
// public BitSet<T> Union(BitSet<T> other)
// {
//     return new BitSet<T>(bits | other.bits);
// }
}
