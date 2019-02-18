import * as React from 'react';
import {useState} from "react";
import {createCnCMap} from "../../start";
import {IniFile} from "../openra/mods/common/fileformats/IniFile";

interface RProps {
    iniInput: string;
}

export const ScriptRenderComponent: React.FunctionComponent<RProps> = (initialState) => {
    const [state, setState] = useState(initialState);
    return <div>
        <h2>Source .ini</h2>
        <textarea defaultValue={state.iniInput} className="input-ini" onChange={(e) => {
            // setState({iniInput: e.target.value});
        }}/>
        <h2>Generated Lua</h2>
        <pre>{
            createCnCMap(new IniFile(state.iniInput.split("\n"))).save().lua
        }</pre>
    </div>;
};