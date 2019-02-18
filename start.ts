import {IniSection} from "./src/openra/mods/common/fileformats/IniSection";
import {IniFile} from "./src/openra/mods/common/fileformats/IniFile";
import {ActorReference} from "./src/openra/game/ActorReference";
import {StringBuilder} from "./src/system/StringBuilder";
import {addActorsFromIniSection} from "./src/openra/mods/common/fileformats/lua/generateMoves";
import {CnCMap} from "./src/openra/game/MapData";
import {MapOptions} from "./src/openra/game/MapOptions";
import {scg01ea} from "./src/data/scg";

// console.log("hey");


export function createCnCMap(f: IniFile) {
    let map = new CnCMap();
    map.Title = "Name your map here";
    map.Description = "Describe your map here";
    map.Author = "Your name here";
    map.MapSize = [128, 128];
// map.    Tileset = tileset.Id;
    map.Options = new MapOptions();
// map.    MapResources = Exts.Lazy(() => new CellLayer<ResourceTile>(tileShape, size)),;
// map.    MapTiles = makeMapTiles,;
    map.Actors = new Map();
    map.Smudges = [];
    f.sections.forEach((value, sectionName) => {
        switch (sectionName) {
            case 'units':
                map.Units = value;
                break;
            case 'infantry':
                map.Infantry = value;
                break;
            case 'structures':
                map.Structures = value;
                break;
            case 'terrain':
            case 'smudge':
                // todo
                break;
            case 'triggers':
                map.Triggers = value;
                break;
            case 'celltriggers':
                map.CellTriggers = value;
                // console.log(value.values.keys());
                break;
            case 'teamtypes':
                map.TeamTypes = value;
                break;
            default:
                break;
        }
    });
    return map;
}


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




