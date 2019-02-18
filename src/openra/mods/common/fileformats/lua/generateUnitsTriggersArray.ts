import {StringBuilder} from "../../../../../system/StringBuilder";
import {addActorsFromIniSection} from "./generateMoves";
import {MapData} from "../../../../game/MapData";

export function generateUnitsTriggersArray(map: MapData, sb: StringBuilder, triggerName: string, teamTypeName: string) {
    const actors: string[] = [];

    addActorsFromIniSection(map, map.Structures, triggerName, actors);
    addActorsFromIniSection(map, map.Infantry, triggerName, actors);
    addActorsFromIniSection(map, map.Units, triggerName, actors);

    if (actors.length <= 0) {
        sb.AppendLine();
        sb.AppendLine("\t" + triggerName.toUpperCase() + "_ACTIVATE = { " + actors.join(", ") + " }");
    }
}