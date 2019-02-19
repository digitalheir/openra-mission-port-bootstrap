import {MiniYaml} from "../../MiniYaml";
import {FieldLoader} from "../FieldLoader";

const playerReferenceFieldsMap = {
    Name: "",
    Palette: "",
    Bot: "",
    StartingUnitsClass: "",
    AllowBots: "",
    Playable: "",
    Required: "",
    OwnsWorld: "",
    Spectating: "",
    NonCombatant: "",
    LockFaction: "",
    Faction: "",
    LockColor: "",
    // HSLColor: "",
    LockSpawn: "",
    Spawn: "",
    LockTeam: "",
    Team: "",
    Allies: "",
    Enemies: "",
};

export const playerReferenceFields = Object.keys(playerReferenceFieldsMap);

export class PlayerReference {
    /*readonly*/ Name: string;
    /*readonly*/ Palette: string;
    /*readonly*/ Bot: string = null;
    /*readonly*/ StartingUnitsClass: string = null;
    /*readonly*/ AllowBots: boolean = true;
    /*readonly*/ Playable: boolean = false;
    /*readonly*/ Required: boolean = false;
    /*readonly*/ OwnsWorld: boolean = false;
    /*readonly*/ Spectating: boolean = false;
    /*readonly*/ NonCombatant: boolean = false;
    /*readonly*/ LockFaction: boolean = false;
    /*readonly*/ Faction: string;
    /*readonly*/ LockColor: boolean = false;
    /*public HSLColor */Color:[number, number, number] = /*new HSLColor*/[0, 0, 238];
    /*readonly*/ LockSpawn: boolean = false;
    /*readonly*/ Spawn: number = 0;
    /*readonly*/ LockTeam: boolean = false;
    /*readonly*/ Team: number = 0;
    /*readonly*/ Allies: string[] = [];
    /*readonly*/ Enemies: string[] = [];

    constructor(my?:MiniYaml ) { if(my) FieldLoader.Load(this, my); }

    ToString(): string {
        return this.Name;
    }

    toString(): string {
        return this.Name;
    }
}