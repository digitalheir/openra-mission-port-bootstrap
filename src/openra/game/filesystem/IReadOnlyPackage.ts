export interface IReadOnlyPackage {
    Name:string;
    Contents:string[];
    // GetStream(filename:string):Stream;
    Contains(filename:string):boolean;
    // IReadOnlyPackage OpenPackage(string filename, FileSystem context);
}


export const a1234 = 1;