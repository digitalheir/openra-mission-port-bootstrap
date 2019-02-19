import {MiniYaml} from "../../MiniYaml";
import {PlayerReference} from "./PlayerReference";
import {MiniYamlNode} from "../../MiniYamlNode";
import {ToDictionary} from "../../../system/Array";
import {Ruleset} from "../gamerules/Ruleset";
import {FieldSaver} from "../FieldSaver";

export class MapPlayers {
    /*readonly*/
    Players: Map<string, PlayerReference> = new Map();

    static createMapPlayers(playerDefinitions?: MiniYamlNode[]) {
        const pl = new MapPlayers();
        pl.Players = playerDefinitions ?
            ToDictionary(playerDefinitions.map(pr => new PlayerReference(new MiniYaml(pr.Key, pr.Value.Nodes))), player => player.Name) : new Map();
    }

    constructor(rules?: Ruleset, playerCount?: number) {
        if (rules && playerCount) {
            // todo implement correctly
            const firstFaction = rules.Actors.get("world")[0].InternalName;
            //.TraitInfos<FactionInfo>()
            //.first(f => f.Selectable).InternalName;

            this.Players = new Map<string, PlayerReference>();
            const neutral = new PlayerReference();
            neutral.Name = "Neutral",
                neutral.Faction = firstFaction,
                neutral.OwnsWorld = true,
                neutral.NonCombatant = true
            this.Players.set("Neutral", neutral);
            //     {
            //     }
            // },
            // {
            //     "Creeps", new PlayerReference
            //     {
            //         Name = "Creeps",
            //             Faction = firstFaction,
            //             NonCombatant = true,
            //             Enemies = Exts.MakeArray(playerCount, i => "Multi{0}".F(i))
            //     }
            // }
//};
            for (let index = 0; index < playerCount; index++) {
                const p = new PlayerReference();
                p.Name = `Multi${index}`;
                p.Faction = "Random";
                p.Playable = true;
                p.Enemies = ["Creeps"];
                this.Players.set(p.Name, p);
            }
        }
    }

    ToMiniYaml(): MiniYamlNode[] {
        const yamls: MiniYamlNode[] = [];
        this.Players.forEach((pValue, pKey) => {
            const yaml = FieldSaver.SaveDifferencesPlayerReference(pValue, new PlayerReference());
            yamls.push(new MiniYamlNode(`PlayerReference@${pKey}`, yaml));
        });
        return yamls;
    }
}