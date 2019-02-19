import {Manifest} from "./Manifest";
import {TileSet} from "./map/TileSet";
import {IReadOnlyDictionary, ReadOnlyDictionary} from "./primitives/ReadOnlyDictionary";
import {InstalledMods} from "./InstalledMods";

export class ModData {
    readonly Manifest: Manifest;
    // readonly ObjectCreator: ObjectCreator;
    // readonly WidgetLoader: WidgetLoader;
    // readonly MapCache: MapCache;
    // readonly PackageLoaders: IPackageLoader[];
    // readonly SoundLoaders: ISoundLoader[];
    // readonly SpriteLoaders: ISpriteLoader[];
    // readonly SpriteSequenceLoader: ISpriteSequenceLoader;
    // readonly ModelSequenceLoader: IModelSequenceLoader;
    // readonly Hotkeys: HotkeyManager;

    defaultTileSets: IReadOnlyDictionary<string, TileSet>;
    get DefaultTileSets():IReadOnlyDictionary<string, TileSet> { return this.defaultTileSets;  }
    constructor(mod:Manifest, mods:InstalledMods , useLoadScreen:boolean = false){
        const items = new Map<string, TileSet>();
        this.Manifest = new Manifest(mod.Id, mod.Package);
        // todo init tilesets
        // for (let file of this.Manifest.TileSets) {
        //     const t = new TileSet(file, file, []); // todo new TileSet(this.DefaultFileSystem, file);
        //     items.set(t.Id, t);
        // }

        this.defaultTileSets = new ReadOnlyDictionary(items);
    }
}