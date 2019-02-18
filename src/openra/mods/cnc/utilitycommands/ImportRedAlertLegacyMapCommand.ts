import {IUtilityCommand, Utility} from "../../../game/IUtilityCommand";
import {ImportLegacyMapCommand} from "./ImportLegacyMapCommand";

export class ImportRedAlertLegacyMapCommand extends ImportLegacyMapCommand implements IUtilityCommand {
    // TODO: 128x128 is probably not true for "mega maps" from the expansions.
    constructor() {
        super(128);
    }

    readonly Name: string = "--import-ra-map";

    Run(utility: Utility, args: string[]) {

    }

    ValidateArguments(args: string[]): boolean {
        return super.Validate;
    }
}