import * as React from "react";
import * as ReactDOM from 'react-dom';
import {ScriptRenderComponent} from "./app/App";
import {scg01ea} from "./data/scg";

const mountPoint = document.getElementById("mount-point");

if (mountPoint) ReactDOM.render(<ScriptRenderComponent iniInput={scg01ea}/>, mountPoint);
else console.error("Mount point not found");