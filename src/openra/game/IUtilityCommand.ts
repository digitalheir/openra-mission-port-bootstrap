import {ModData} from "./ModData";
import {InstalledMods} from "./InstalledMods";

export interface IUtilityCommand {
    /**
     * The string used to invoke the command.
     */
    readonly Name: string;

    ValidateArguments(args: string[]): boolean;

    Run(utility: Utility, args: string[], src: string[]);
}

export class Utility {
    readonly ModData: ModData;
    readonly Mods: InstalledMods;

    constructor(modData: ModData, mods: InstalledMods) {
        this.ModData = modData;
        this.Mods = mods;
    }
}