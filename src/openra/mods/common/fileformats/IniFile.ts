import {IniSection} from "./IniSection";

const sectionPattern = /^\[([^\]]*)]/;

export class IniFile {
    public sections: Map<string, IniSection> = new Map();

    constructor(lines: string[]) {
        let currentSection: IniSection = null;

        for (const line of lines) {
            if (line.length > 0) switch (line[0]) {
                case ';':
                    break;
                case '[':
                    currentSection = this.ProcessSection(line);
                    break;
                default:
                    ProcessEntry(line, currentSection);
                    break;
            }
        }
    }

    ProcessSection(line: string): IniSection | null {
        const m = line.match(sectionPattern);
        if (!m) return null;
        else {
            const sectionName = m[1].toLowerCase();
            const ret = this.sections.get(sectionName);
            if (ret) {
                return ret;
            } else {
                const r = new IniSection(sectionName);
                this.sections.set(sectionName, r);
                return r;
            }
        }
    }

    public GetSection(s: string, allowFail: boolean = false): IniSection {
        const section: IniSection = this.sections.get(s.toLowerCase());
        if (!!section) return section;

        if (allowFail) return new IniSection(s);
        throw new Error("Section does not exist in map or rules: " + s);
    }

}

function ProcessEntry(line0: string, currentSection: IniSection): boolean {
    const comment = line0.indexOf(';');
    const line = ((comment >= 0) ? line0.substr(0, comment) : line0).trim();
    if (line.length === 0) return false;
    let key = line;
    let value = "";
    const eq = line.indexOf('=');
    if (eq >= 0) {
        key = line.substring(0, eq).trim();
        value = line.substring(eq + 1, line.length - eq - 1).trim();
    }
    if (currentSection == null) throw Error("No current INI section");
    if (!currentSection.Contains(key)) currentSection.Add(key, value);
    return true;
}
