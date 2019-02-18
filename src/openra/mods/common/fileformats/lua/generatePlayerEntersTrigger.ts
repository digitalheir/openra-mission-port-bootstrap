import {StringBuilder} from "../../../../../system/StringBuilder";

const reTrimQuotes = /(^'+)|('+$)/g;

export function generatePlayerEntersTrigger(sb: StringBuilder, triggerName: string, options: string[], playerValue: string, player: string, enemy: string) {
    switch (options[1]) {
        case "Reinforce.":
            break;
        case "Create Team":
            break;
        case "Production":
            break;
        case "Ion Cannon":
            break;
        case "DZ at 'Z'":
            break;
        case "Allow Win":
            break;
        case "Win":
            break;
        case "All to Hunt":
            break;

        // Dstry Trig 'TRIGGER_NAME' case
        default:
            const trigger = options[1].split(' ');
            sb.AppendLine();
            sb.AppendLine("\tTrigger.OnEnteredFootprint(" + triggerName.toUpperCase() + "_CELLTRIGGERS, function(a, id)");
            sb.AppendLine("\t\tif a.Owner == GoodGuy then");
            sb.AppendLine("\t\t\tTrigger.RemoveFootprintTrigger(id)");
            sb.AppendLine("\t\t\tTRIGGER_" + trigger[2].replace(reTrimQuotes, "") + " = function() end");
            sb.AppendLine("\t\tend");
            sb.AppendLine("\tend)");
            break;
    }
}