import {TypeHaving} from "../../game/primitives/TypeHaving";
import {SubCell} from "../../game/map/MapGrid";
import {TypeDictionary} from "../../game/primitives/TypeDictionary";
import {CPos, CPosZero} from "../../game/CPos";

export class FacingInit implements TypeHaving {
    type: string = "FacingInit";
//    [FieldFromYamlKey]
    /*readonly*/
    value: number = 128;

    /*public*/
    constructor(init: number = 128) {
        this.value = init;
    }

    /*public int Value(World world) { return value; }*/
}


export class SubCellInit /* IActorInit<SubCell>*/ implements TypeHaving {
    type = "SubCellInit";
    // [FieldFromYamlKey] readonly byte
    value: number = SubCell.FullCell;
    // public SubCellInit() { }
    // public SubCellInit(byte init) { value = init; }
    constructor(init: number = SubCell.FullCell) {
        this.value = init;
    }

    // public SubCell Value(World world) { return (SubCell)value; }
}

export class ActorInitializer /*: IActorInitializer*/
    implements TypeHaving {
    type = "ActorInitializer";
// public readonly Self:Actor;
//public World World { get { return Self.World; } }

    /*internal */
    Dict: TypeDictionary;

    constructor(/*actor:Actor ,*/ dict: TypeDictionary) {
        //this.Self = actor;
        this.Dict = dict;
    }

// public T Get<T>() where T : IActorInit { return Dict.Get<T>(); }
// public U Get<T, U>() where T : IActorInit<U> { return Dict.Get<T>().Value(World); }
// public bool Contains<T>() where T : IActorInit { return Dict.Contains<T>(); }
}

export class LocationInit/* : IActorInit<CPos>*/
    implements TypeHaving {
    type = "LocationInit";
    /*[FieldFromYamlKey] readonly */
    value: CPos = CPosZero;

    constructor(init: CPos = CPosZero) {
        this.value = init;
    }

// public CPos Value(World world) { return value; }
}
export class OwnerInit /*: IActorInit<Player>*/ implements TypeHaving
{
    type = "OwnerInit";
    /*[FieldFromYamlKey] public readonly */PlayerName :string = "Neutral";
    // player:Player ;

constructor(playerName:string = "Neutral") { this.PlayerName = playerName; }

// public OwnerInit(Player player)
// {
//     this.player = player;
//     PlayerName = player.InternalName;
// }

// public Player Value(World world)
// {
//     if (player != null)
//         return player;
//
//     return world.Players.First(x => x.InternalName == PlayerName);
// }
}
