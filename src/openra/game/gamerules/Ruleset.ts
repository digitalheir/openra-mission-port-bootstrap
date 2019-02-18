import {IReadOnlyDictionary} from "../primitives/ReadOnlyDictionary";
import {MiniYamlNode} from "../../MiniYamlNode";
import {TileSet} from "../map/TileSet";
import {ActorInfo} from "./ActorInfo";

export class Ruleset {
    readonly Actors: IReadOnlyDictionary<string, ActorInfo> ;
    // readonly Weapons: IReadOnlyDictionary<string, WeaponInfo> ;
    // readonly Voices: IReadOnlyDictionary<string, SoundInfo> ;
    // readonly Notifications: IReadOnlyDictionary<string, SoundInfo> ;
    // readonly Music: IReadOnlyDictionary<string, MusicInfo> ;
    readonly TileSet: TileSet ;
    // readonly Sequences: SequenceProvider ;
    readonly ModelSequences: IReadOnlyDictionary<string, MiniYamlNode> ;
}