export interface IReadOnlyPackage {
    Name: string;
    Contents: string[];

    // GetStream(filename:string):Stream;
    Contains(filename: string): boolean;

    // IReadOnlyPackage OpenPackage(string filename, FileSystem context);
}

export class ReadOnlyPackage implements IReadOnlyPackage {
    Name: string;
    Contents: string[];
    index: Map<string, any> = new Map();

    constructor(name: string, contents: string[]) {
        this.Name = name;
        this.Contents = contents;
    }

    Contains(filename: string): boolean {
        return this.index.has(filename);
    }
}