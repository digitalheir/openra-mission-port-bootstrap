import {StringBuilder} from "../../../../../system/StringBuilder";
import {generateMoves, generateUnitsArray} from "./generateMoves";
import {MapData} from "../../../../game/MapData";

export function generateTimeTrigger(map: MapData, sb: StringBuilder, triggerName: string, options: string[], playerValue: string, player: string, enemy: string) {
    switch (options[1]) {
        case "Reinforce.":
            const teamTypeOptions = generateUnitsArray(map, sb, triggerName, options[4]);
            sb.AppendLine("\tTRIGGER_" + triggerName.toUpperCase() + "_TIME = " + options[2]);
            sb.AppendLine("\tTrigger.AfterDelay(DateTime.Seconds(TRIGGER_" + triggerName.toUpperCase() + "_TIME), function() TRIGGER_" + triggerName.toUpperCase() + "() end)");
            sb.AppendLine("");
            generateTimeTriggerReinforceFunction(sb, triggerName, teamTypeOptions, playerValue, player, enemy);
            break;
    }
}
function generateTimeTriggerReinforceFunction(sb: StringBuilder, triggerName: string, teamTypeOptions: string[], playerValue: string, player: string, enemy: string) {
    let pType = "";

    if (playerValue == teamTypeOptions[0]) {
        pType = enemy;
    } else {
        pType = player;
    }

    const triggerNameUpper = triggerName.toUpperCase();
    sb.AppendLine("\tTRIGGER_" + triggerNameUpper + " = function()");
    sb.AppendLine("\t\tReinforcements.Reinforce(" + pType + ", " + triggerNameUpper + "_UNITS, SPAWNPOINT, 15, function(unit)");

    generateMoves(sb, teamTypeOptions);

    sb.AppendLine("\t\tend)");
    sb.AppendLine("\tend");
}