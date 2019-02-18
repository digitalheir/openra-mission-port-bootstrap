import {TypeDictionary} from "../primitives/TypeDictionary";

export const AbstractActorPrefix = "^";

/**
 * A unit/building inside the game. Every rules starts with one and adds trait to it.
 */
export class ActorInfo {

    /**
     * The actor name can be anything, but the sprites used in the Render*: traits default to this one.
     If you add an ^ in front of the name, the engine will recognize this as a collection of traits
     that can be inherited by others (using Inherits:) and not a real unit.
     You can remove inherited traits by adding a - in front of them as in -TraitName: to inherit everything, but this trait.
     */
    Name: string;

    traits: TypeDictionary = new TypeDictionary();
}