/**
 * Describes what is to be loaded in order to run a mod
 */
import {ModMetadata} from "./ModMetadata";
import {IReadOnlyPackage} from "./filesystem/IReadOnlyPackage";

export const reservedModuleNames = ["Metadata", "Folders", "MapFolders", "Packages", "Rules",
    "Sequences", "ModelSequences", "Cursors", "Chrome", "Assemblies", "ChromeLayout", "Weapons",
    "Voices", "Notifications", "Music", "Translations", "TileSets", "ChromeMetrics", "Missions", "Hotkeys",
    "ServerTraits", "LoadScreen", "Fonts", "SupportsMapsFrom", "SoundFormats", "SpriteFormats",
    "RequiresMods", "PackageFormats"];

export class Manifest {
    readonly Id: string;
    readonly Package: IReadOnlyPackage;
    readonly Metadata: ModMetadata;
    readonly Rules: string[];
    readonly ServerTraits: string[];
    readonly Sequences: string[];
    readonly ModelSequences: string[];
    readonly Cursors: string[];
    readonly Chrome: string[];
    readonly Assemblies: string[];
    readonly ChromeLayout: string[];
    readonly Weapons: string[];
    readonly Voices: string[];
    readonly Notifications: string[];
    readonly Music: string[];
    readonly Translations: string[];
    readonly TileSets: string[];
    readonly ChromeMetrics: string[];
    readonly MapCompatibility: string[];
    readonly Missions: string[];
    readonly Hotkeys: string[];
}