import {StringBuilder} from "../../../../../system/StringBuilder";
import {generatePlayerEntersTrigger} from "./generatePlayerEntersTrigger";
import {generateTimeTrigger} from "./generateTimeTrigger";
import {generateDestroyedTrigger} from "./generateDestroyedTrigger";
import {generateAttackedTrigger} from "./generateAttackedTrigger";
import {MapData} from "../../../../game/MapData";
import {generateUnitsTriggersArray} from "./generateUnitsTriggersArray";
import {recalculatePosition} from "./generateMoves";

function generateLuaTriggers(map: MapData, sb: StringBuilder) {
    // Waypoints.values.forEach(waypoint => {
    // });

    const {playerValue, player, enemy} = map;

    map.Triggers.values.forEach((trigger, key) => {
        const triggerParams: string[] = trigger.split(',');

        // Array with units, which call triggers with name triggerName
        generateUnitsTriggersArray(map, sb, key, triggerParams[4]);

        switch (triggerParams[0]) {
            case "Time":
                generateTimeTrigger(map, sb, key, triggerParams, playerValue, player, enemy);
                break;
            case "Destroyed":
                generateDestroyedTrigger(map, sb, key, triggerParams, playerValue, player, enemy);
                break;
            case "Player Enters":
                generatePlayerEntersTrigger(sb, key, triggerParams, playerValue, player, enemy);
                break;
            case "Attacked":
                generateAttackedTrigger(map, sb, key, triggerParams, playerValue, player, enemy);
                break;
            case "Units Destr.":
                break;
        }
    });
}

export function SaveLuaData(map: MapData): string {
    const sb = new StringBuilder();
    const {playerValue} = map;
    const outputCells: Map<string, string[]> = new Map();

    const player = playerValue === "GoodGuy" ? "GoodGuy" : "BadGuy";
    const enemy = playerValue === "GoodGuy" ? "BadGuy" : "GoodGuy";
    map.player = player;
    map.enemy = enemy;

    // Add default spawn point
    sb.AppendLine("-- standard spawn point");
    sb.AppendLine("SPAWNPOINT = { waypoint27.Location }");

    // Generate cell triggers
    sb.Append("-- Cell triggers arrays");
    sb.AppendLine();

    map.CellTriggers.values.forEach((cellValue, cellKey) => {
        if (!outputCells.has(cellValue)) {
            const l = [];
            l.push(cellKey);
            outputCells.set(cellValue, l);
        } else {
            outputCells[cellValue].push(cellKey);
        }
    });

    outputCells.forEach((tempValue, tempKey) => {
        sb.Append(tempKey.toUpperCase() + "_CELLTRIGGERS = {");
        let counter = 1;
        for (const x of outputCells[tempKey]) {
            if (counter < outputCells[tempKey].Count) {
                sb.Append("CPos.New(" + recalculatePosition(parseInt(x)) + "), ");
                counter++;
            } else {
                sb.Append("CPos.New(" + recalculatePosition(parseInt(x)) + ")");
            }
        }

        sb.Append("}");
        sb.AppendLine();
    });

    sb.AppendLine();

    // END generate cell trigger

    // WORLDLOADED
    sb.Append("WorldLoaded = function()\n");
    sb.AppendLine("\t" + player + " = Player.GetPlayer(\"GoodGuy\")");
    sb.AppendLine("\t" + enemy + " = Player.GetPlayer(\"BadGuy\")");
    sb.AppendLine();

    // GLOBAL TRIGGERS
    // TODO Check which player is choosen and add objectives to the correct side
    // now objects just added to nod
    sb.AppendLine("\tTrigger.OnObjectiveAdded(" + enemy + ", function(p, id)");
    sb.AppendLine("\t\tMedia.DisplayMessage(p.GetObjectiveDescription(id), \"New \" .. string.lower(p.GetObjectiveType(id)) .. \" objective\")");
    sb.AppendLine("\tend)");
    sb.AppendLine();

    sb.AppendLine("\tTrigger.OnObjectiveCompleted(" + enemy + ", function(p, id)");
    sb.AppendLine("\t\tMedia.DisplayMessage(p.GetObjectiveDescription(id), \"Objective completed\")");
    sb.AppendLine("\tend)");
    sb.AppendLine();

    sb.AppendLine("\tTrigger.OnObjectiveFailed(" + enemy + ", function(p, id)");
    sb.AppendLine("\t\tMedia.DisplayMessage(p.GetObjectiveDescription(id), \"Objective failed\")");
    sb.AppendLine("\tend)");
    sb.AppendLine();

    sb.AppendLine("\tTrigger.OnPlayerWon(" + enemy + ", function()");
    sb.AppendLine("\t\tMedia.PlaySpeechNotification(" + enemy + ", \"Win\")");
    sb.AppendLine("\tend)");
    sb.AppendLine();

    sb.AppendLine("\tTrigger.OnPlayerLost(" + enemy + ", function()");
    sb.AppendLine("\t\tMedia.PlaySpeechNotification(" + enemy + ", \"Lose\")");
    sb.AppendLine("\tend)");
    sb.AppendLine();

    sb.AppendLine("\t" + player + "Objective = " + player + ".AddPrimaryObjective(\"Kill all enemies!\")");
    sb.AppendLine("\t" + enemy + "Objective = " + enemy + ".AddPrimaryObjective(\"Kill all enemies!\")");

    // Generate Triggers
    generateLuaTriggers(map, sb);

    // End Generate Triggers
    sb.Append("end");

    return sb.ToString();
}