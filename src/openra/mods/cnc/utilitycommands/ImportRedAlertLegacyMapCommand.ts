import {IUtilityCommand, Utility} from "../../../game/IUtilityCommand";
import {ImportLegacyMapCommand} from "./ImportLegacyMapCommand";
import {IniFile} from "../../common/fileformats/IniFile";
import {CnCMap} from "../../../game/MapData";

export class ImportRedAlertLegacyMapCommand extends ImportLegacyMapCommand implements IUtilityCommand {
    // TODO: 128x128 is probably not true for "mega maps" from the expansions.
    constructor() {
        super(128);
    }

    readonly Name: string = "--import-ra-map";

    Run(utility: Utility, args: string[], src: string[]): CnCMap {
        return super.Run(utility, args, src)
    }

    ValidateArguments(args: string[]): boolean {
        return super.ValidateArguments(args);
    }

    LoadPlayer(file: IniFile, section: string) {
        let color: string;
        let faction: string;
        switch (section) {
            case "Spain":
                color = "gold";
                faction = "allies";
                break;
            case "England":
                color = "green";
                faction = "allies";
                break;
            case "Ukraine":
                color = "orange";
                faction = "soviet";
                break;
            case "Germany":
                color = "black";
                faction = "allies";
                break;
            case "France":
                color = "teal";
                faction = "allies";
                break;
            case "Turkey":
                color = "salmon";
                faction = "allies";
                break;
            case "Greece":
            case "GoodGuy":
                color = "blue";
                faction = "allies";
                break;
            case "USSR":
            case "BadGuy":
                color = "red";
                faction = "soviet";
                break;
            case "Special":
            case "Neutral":
            default:
                color = "neutral";
                faction = "allies";
                break;
        }

        ImportLegacyMapCommand.SetMapPlayers(section, faction, color, file, this.Players, this.MapPlayers);
    }

    ParseTreeActor(input: string): string {
        return input.toLowerCase();
    }

    ReadPacks(file: IniFile, filename: string) {
        // todo
        // UnpackTileData(ReadPackedSection(file.GetSection("MapPack")));
        // UnpackOverlayData(ReadPackedSection(file.GetSection("OverlayPack")));
    }

    ValidateMapFormat(format: number) {
        if (format < 2) {
            console.error(`ERROR: Detected NewINIFormat ${format}. Are you trying to import a Tiberian Dawn map?`);
            return;
        }
    }
}