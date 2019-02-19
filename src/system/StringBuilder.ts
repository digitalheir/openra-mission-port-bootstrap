export class StringBuilder {
    private sb: string[] = [];

    toString(): string {
        return this.sb.join("");
    }

    AppendLine(s?: string) {
        if (s) this.sb.push(s);
        this.sb.push("\n");
    }


    Append(s?: string | number) {
        if (s) this.sb.push(s.toString());
    }

    ToString(): string {
        return this.toString();
    }

    ToUpper(): string {
        return this.toString().toUpperCase();
    }

    isEmpty(): boolean {
        return this.sb.length === 0;
    }
}