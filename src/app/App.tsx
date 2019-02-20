import * as React from 'react';
import {useState} from "react";
import {ImportRedAlertLegacyMapCommand} from "../openra/mods/cnc/utilitycommands/ImportRedAlertLegacyMapCommand";
import {Manifest} from "../openra/game/Manifest";
import {ReadOnlyPackage} from "../openra/game/filesystem/IReadOnlyPackage";
import {InstalledMods} from "../openra/game/InstalledMods";
import {ModData} from "../openra/game/ModData";
import {Utility} from "../openra/game/IUtilityCommand";

interface RProps {
    iniInput: string;
}

const raImport = new ImportRedAlertLegacyMapCommand();
var manifest = new Manifest("~EnterModHere~", new ReadOnlyPackage("readonlypack", []));
var installedMods = new InstalledMods();
const modData = new ModData(manifest, installedMods);
const mods = new InstalledMods();
const u = new Utility(modData, mods);


export const ScriptRenderComponent: React.FunctionComponent<RProps> = (initialState) => {
    const [state, setState] = useState(initialState);
    let map = raImport.Run(u, ["~mission title~", "missionFileName"], state.iniInput.split("\n"));
    const parsedMap = map.save();
    return <div>
        <h1>OpenRA Mission port bootstrap</h1>
        <section>
            <h2>Source .ini</h2>
            From <select disabled={true}>
            <option>Red Alert</option>
        </select>
            <textarea defaultValue={state.iniInput} className="input-ini" onChange={(e) => {
                setState({iniInput: e.target.value});
            }}/>
        </section>
        <h2>Log</h2>
        <div className="errors">{
            map.Logger.logs.map((log, i) => <div key={i} className={"log-" + log.level}>{log.s}</div>)
            //createCnCMap(new IniFile(state.iniInput.split("\n"))).save().lua
        }</div>
        <section>
        </section>
        <h2>Generated Lua</h2>
        <pre className="code-block">{
            parsedMap ? parsedMap.lua : "???"
            //createCnCMap(new IniFile(state.iniInput.split("\n"))).save().lua
        }</pre>
        <section>
            <h2>Generated Yaml</h2>
            <pre className="code-block">{
                parsedMap ? parsedMap.yaml : "???"
                //createCnCMap(new IniFile(state.iniInput.split("\n"))).save().lua
            }</pre>
        </section>
    </div>;
};