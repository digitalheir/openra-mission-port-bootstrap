import {StringBuilder} from "../../../../../system/StringBuilder";
import {addActorsFromIniSection, generateMoves, generateUnitsArray} from "./generateMoves";
import {MapData} from "../../../../game/MapData";

export function generateAttackedTrigger(map: MapData, sb: StringBuilder, triggerName: string, options: string[], playerValue: string, player: string, enemy: string) {
    switch (options[1]) {
        case "Reinforce.":   // Create first Trigger.OnDamaged(Actor116, ATK5_TRIGGER)
            const actors: string[] = [];
            addActorsFromIniSection(map, map.Structures, triggerName, actors);
            addActorsFromIniSection(map, map.Infantry, triggerName, actors);
            addActorsFromIniSection(map, map.Units, triggerName, actors);
            // Trigger.OnDamaged doesn't work...
            const triggerUpper = triggerName.toUpperCase();
            if (actors.length !== 0) {
                for (const item of actors) {
                    sb.AppendLine();
                    sb.AppendLine(`--\tTrigger.OnDamaged(${item}, ${triggerUpper}_TRIGGER)`);
                }
            }

            sb.AppendLine();

            const teamTypeOptions: string[] = generateUnitsArray(map, sb, triggerName, options[4]);
            const pType = (playerValue === teamTypeOptions[0]) ? enemy : player;
            sb.AppendLine();
            sb.AppendLine("\t" + triggerUpper + "_SWITCH = true");
            sb.AppendLine("\t" + triggerUpper + "_TRIGGER = function()");
            sb.AppendLine("\t\tif " + triggerUpper + "_SWITCH == true then");
            sb.AppendLine("\t\t\tReinforcements.Reinforce(" + pType + "," + triggerUpper + "_UNITS, SPAWNPOINT, 15, function(unit)");
            generateMoves(sb, teamTypeOptions);
            sb.AppendLine("\t\t\tend)");
            sb.AppendLine("\t\t\t" + triggerUpper + "_SWITCH= false");
            sb.AppendLine("\t\tend");
            sb.AppendLine("\tend");
            break;
    }
}
