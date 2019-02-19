/**
 * Describes what is to be loaded in order to run a mod
 */
import {ModMetadata} from "./ModMetadata";
import {IReadOnlyPackage} from "./filesystem/IReadOnlyPackage";
import {MiniYaml} from "../MiniYaml";
import {FieldLoader} from "./FieldLoader";

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
    readonly yaml: Map<string, MiniYaml>;

    constructor(modId: string, p: IReadOnlyPackage) {
        this.Id = modId;
        this.Package = p;
        this.yaml = new MiniYaml(null, [],
            // todo MiniYaml.FromStream(package.GetStream("mod.yaml"), "mod.yaml")
        ).ToDictionaryS();

        // Metadata = FieldLoader.Load(yaml["Metadata"]);

        // TO DO: Use fieldloader
        // this.MapFolders = YamlDictionary(yaml, "MapFolders");

        // MiniYaml packages;
        // if (yaml.TryGetValue("Packages", out packages))
        // Packages = packages.ToDictionary(x => x.Value).AsReadOnly();

        // this.Rules = YamlList(yaml, "Rules");
        // this.Sequences = YamlList(yaml, "Sequences");
        // this.ModelSequences = YamlList(yaml, "ModelSequences");
        // this.Cursors = YamlList(yaml, "Cursors");
        // this.Chrome = YamlList(yaml, "Chrome");
        // this.Assemblies = YamlList(yaml, "Assemblies");
        // this.ChromeLayout = YamlList(yaml, "ChromeLayout");
        // this.Weapons = YamlList(yaml, "Weapons");
        // this.Voices = YamlList(yaml, "Voices");
        // this.Notifications = YamlList(yaml, "Notifications");
        // this.Music = YamlList(yaml, "Music");
        // this.Translations = YamlList(yaml, "Translations");
        // this.TileSets = YamlList(yaml, "TileSets");
        // this.ChromeMetrics = YamlList(yaml, "ChromeMetrics");
        // this.Missions = YamlList(yaml, "Missions");
        // this.Hotkeys = YamlList(yaml, "Hotkeys");
    }

    static YamlList(yaml: Map<string, MiniYaml>, key: string, parsePaths: boolean = false): string[] {
        if (yaml.has(key)) {
            yaml.get(key).ToDictionaryS().keys();
        } else return [];
    }
}