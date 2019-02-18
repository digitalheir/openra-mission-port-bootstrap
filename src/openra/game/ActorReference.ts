import {TypeDictionary} from "./primitives/TypeDictionary";
import {MiniYaml} from "../MiniYaml";
import {TypeHaving} from "./primitives/TypeHaving";

export class ActorReference {
    readonly Type: string;
    readonly Name: string;
    readonly InitDict: TypeDictionary = new TypeDictionary();

    constructor(type: string, inits: Map<string, MiniYaml> = new Map<string, MiniYaml>()) {
        this.Type = type;
        inits.forEach((v, k) => {
            this.InitDict.Add(LoadInit(k, v));
        });
    }

    public Save(initFilter?: (any) => boolean): MiniYaml {
        // todo implement
        const ret = new MiniYaml(this.Type);
        // this.InitDict.foreach(init =>{
        //if (init is ISuppressInitExport)
        //continue;
        //
        //if (initFilter != null && !initFilter(init))
        //continue;
        // var initName = init.GetType().Name;
        // ret.Nodes.Add(new MiniYamlNode(initName.Substring(0, initName.Length - 4), FieldSaver.Save(init)));
// }

        return ret;
    }

}

interface IActorInit extends TypeHaving {
}

function LoadInit(traitName: string, my: MiniYaml): IActorInit {
    throw new Error("Not implemented");
    // const info = Game.CreateObject<IActorInit>(traitName + "Init");
    // FieldLoader.Load(info, my);
    // return info;
}
