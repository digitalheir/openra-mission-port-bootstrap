import {IniSection} from "./src/openra/mods/common/fileformats/IniSection";
import {IniFile} from "./src/openra/mods/common/fileformats/IniFile";
import {ActorReference} from "./src/openra/game/ActorReference";
import {StringBuilder} from "./src/system/StringBuilder";
import {addActorsFromIniSection} from "./src/openra/mods/common/fileformats/lua/generateMoves";
import {CnCMap} from "./src/openra/game/MapData";
import {MapOptions} from "./src/openra/game/MapOptions";

import {ImportRedAlertLegacyMapCommand} from "./src/openra/mods/cnc/utilitycommands/ImportRedAlertLegacyMapCommand";
import {Utility} from "./src/openra/game/IUtilityCommand";
import {ModData} from "./src/openra/game/ModData";
import {InstalledMods} from "./src/openra/game/InstalledMods";
import {Manifest} from "./src/openra/game/Manifest";
import {ReadOnlyDictionary} from "./src/openra/game/primitives/ReadOnlyDictionary";
import {ReadOnlyPackage} from "./src/openra/game/filesystem/IReadOnlyPackage";
import {scg03ea} from "./src/data/scg";

// console.log("hey");


// export function createCnCMap(f: IniFile): CnCMap {
//     let map = new CnCMap();
//     map.Title = "Name your map here";
//     map.Description = "Describe your map here";
//     map.Author = "Your name here";
//     map.MapSize = [128, 128];
// // map.    Tileset = tileset.Id;
//     map.Options = new MapOptions();
// // map.    MapResources = Exts.Lazy(() => new CellLayer<ResourceTile>(tileShape, size)),;
// // map.    MapTiles = makeMapTiles,;
//     map.Actors = new Map();
//     map.Smudges = [];
//     f.sections.forEach((value, sectionName) => {
//         switch (sectionName) {
//             case 'units':
//                 map.Units = value;
//                 break;
//             case 'infantry':
//                 map.Infantry = value;
//                 break;
//             case 'structures':
//                 map.Structures = value;
//                 break;
//             case 'terrain':
//             case 'smudge':
//                 // todo
//                 break;
//             case 'triggers':
//                 map.Triggers = value;
//                 break;
//             case 'celltriggers':
//                 map.CellTriggers = value;
//                 // console.log(value.values.keys());
//                 break;
//             case 'teamtypes':
//                 map.TeamTypes = value;
//                 break;
//             default:
//                 break;
//         }
//     });
//     return map;
// }


// const f = new IniFile(scg01ea.split("\n"));
// console.log(f.sections.keys());
// let map = createCnCMap(f);
// console.log(map.save());

const CellTriggers: IniSection = null;
const Triggers: IniSection = null;
const TeamTypes: IniSection = null;
const Waypoints: IniSection = null;
const Infantry: IniSection = null;
const Units: IniSection = null;
const Structures: IniSection = null;
const Actors: Map<string, ActorReference> = new Map();


const raImport = new ImportRedAlertLegacyMapCommand();
var manifest = new Manifest("*EnterModHere*", new ReadOnlyPackage("readonlypack", []));
var installedMods = new InstalledMods();
const modData = new ModData(manifest, installedMods);
const mods = new InstalledMods();
const u = new Utility(modData, mods);
raImport.Run(u, ["a", "b"], scg03ea.split("\n"));