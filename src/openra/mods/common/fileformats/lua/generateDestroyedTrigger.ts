import {StringBuilder} from "../../../../../system/StringBuilder";
import {generateMoves, generateUnitsArray} from "./generateMoves";
import {MapData} from "../../../../game/MapData";

export function generateDestroyedTrigger(map: MapData, sb: StringBuilder, triggerName: string, options: string[], playerValue: string, player: string, enemy: string) {
    switch (options[1]) {
        case "Reinforce.":
            sb.AppendLine("\t" + triggerName.toUpperCase() + "_TeamPath = {SPAWNPOINT.Location, waypoint1.Location}");
            const teamTypeOptions = generateUnitsArray(map, sb, triggerName, options[4]);
            sb.AppendLine("\tTrigger.OnAnyKilled(" + triggerName.toUpperCase() + "_ACTIVATE, function()");

            let pType = "";
            if (playerValue == teamTypeOptions[0]) {
                pType = enemy;
            } else {
                pType = player;
            }

            sb.AppendLine("\t\tReinforcements.Reinforce(" + pType + "," + triggerName.toUpperCase() + "_UNITS, " + triggerName.toUpperCase() + "_TeamPath, 15, function(unit)");
            generateMoves(sb, teamTypeOptions);
            sb.AppendLine("\t\tend)");
            sb.AppendLine("\tend)");
            break;
    }
}
