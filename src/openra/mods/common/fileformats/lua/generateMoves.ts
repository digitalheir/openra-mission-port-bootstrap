import {StringBuilder} from "../../../../../system/StringBuilder";
import {ActorReference} from "../../../../game/ActorReference";
import {IniSection} from "../IniSection";
import {MapData} from "../../../../game/MapData";

export function generateMoves(sb: StringBuilder, teamTypeOptions: string[]) {
    // Unit moves
    // With 10 starts units in TeamTypes field
    const numberOfTypesOfUnits: number = parseInt(teamTypeOptions[10]);

    const getNumberOfMovesAtThisPoint = 11 + numberOfTypesOfUnits;
    const numberOfMoves = parseInt(teamTypeOptions[getNumberOfMovesAtThisPoint]);
    const start = getNumberOfMovesAtThisPoint + 1;
    const end = start + numberOfMoves;

    // For moves like Attack Units and Attack Civil., because they don't have waypoints in INI
    let lastMove = "0";

    for (let i = start; i < end; i++) {
        const moves = teamTypeOptions[i].split(':');
        switch (moves[0]) {
            case "Move":
                sb.AppendLine("\t\t\tunit.Move(waypoint" + moves[1] + ".Location)");
                lastMove = moves[1];
                break;
            case "Attack Units":
                sb.AppendLine("\t\t\tunit.AttackMove(waypoint" + lastMove + ".Location)");
                break;
            case "Attack Civil.":
                sb.AppendLine("\t\t\tunit.AttackMove(waypoint" + lastMove + ".Location)");
                break;
            default:
                sb.AppendLine("\t\t\t-- Move " + moves[0] + " is not found");
                break;
        }
    }
}

export function generateUnitsArray(map: MapData, sb: StringBuilder, triggerName: string, teamTypeName: string): string[] {
    let teamTypeOptions: string[] = [];

    // Get options for searched team type
    map.TeamTypes.values.forEach((teamType, k) => {
        if (k == teamTypeName) {
            teamTypeOptions = teamType.split(',');
        }
    });

    // Start write team type array
    sb.Append("\t" + triggerName.toUpperCase() + "_UNITS = { ");

    // With 10 starts units in TeamTypes field
    const count: number = parseInt(teamTypeOptions[10]);

    // test is a number of types of units
    const test = 11 + count;
    for (let i = 11; i < test; i++) {
        // Parse unit types with its number
        const temp: string[] = teamTypeOptions[i].split(':');

        // temp[1] is a number of units
        for (let j = 0; j < parseInt(temp[1]); j++) {
            // temp[0] is a name of unit
            // Fall 1: Anzahl der Einhaiten ist 1 und anzahl der Truppen ist 1
            if (count == 1 && parseInt(temp[1]) == 1) {
                sb.Append("\"" + temp[0].toLowerCase() + "\"");

                // Fall 2: Anzahl der Einheiten ist 1
            } else if (count == 1 && j == 0) {
                sb.Append("\"" + temp[0].toLowerCase() + "\", ");

                // Fall 3: Anzahl der Einheiten ist größer als 1
            } else if (i < (test - 1)) {
                sb.Append("\"" + temp[0].toLowerCase() + "\", ");

                // Fall 4: Letzte Einheit wird ohne Komma ausgegeben!
            } else if (i < test) {
                sb.Append("\"" + temp[0].toLowerCase() + "\"");
            }
        }
    }

    sb.Append(" }");
    sb.AppendLine("");

    return teamTypeOptions;
}

export function recalculatePosition(x: number): string {
    const result = new StringBuilder();
    result.Append(x % 64);
    result.Append(",");
    result.Append(Math.floor(x / 64));
    return result.ToString();
}

function getActorNameByXY(map: MapData, x: number, y: number): ActorReference[] {
    const found = [];
    map.Actors.forEach(a => {
        const actorPos: number[] = a.InitDict.LocationInit;
        if (actorPos[0] === x && actorPos[1] === y) {
            found.push(a);
        }
    });
    return found;
}


function addActor(map: MapData, item: string, triggerName: string, actors: string[]) {
    const infantryParams: string[] = item.split(',');

    if (infantryParams[infantryParams.length - 1] === triggerName) {
        const test = infantryParams[3];
        const temp = recalculatePosition(parseInt(test));
        const tempArray = temp.split(',');
        const result = getActorNameByXY(map, parseInt(tempArray[0]), parseInt(tempArray[1]));
        for (const x of result) {
            //console.log(x.Name);
            actors.push(x.Name);
        }
    }
}

export function addActorsFromIniSection(map: MapData, iniSection: IniSection, triggerName: string, actors: string[]) {
    addActors(map, iniSection.values, triggerName, actors);
}

function addActors(map: MapData, units: Map<string, string>, triggerName: string, actors: string[]) {
    units.forEach(item => addActor(map, item, triggerName, actors));
}