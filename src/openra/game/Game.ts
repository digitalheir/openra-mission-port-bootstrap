import {InstalledMods} from "./InstalledMods";
import {ModData} from "./ModData";

class GameData {
    NetTickScale: number = 3; // 120 ms net tick for 40 ms local tick
    Timestep: number = 40;
    TimestepJankThreshold: number = 250; // Don't catch up for delays larger than 250ms

    Mods:InstalledMods;
    // const ExternalMods:ExternalMods;

    ModData : ModData ;
    // Settings : Settings ;
    // Cursor : ICursor ;
    // worldRenderer : WorldRenderer ;

    // OrderManager:OrderManager ;
    // server:Server.Server ;
}


export const Game = new GameData();
