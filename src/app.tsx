import * as React from "react";
import * as ReactDOM from 'react-dom';
import {ScriptRenderComponent} from "./app/App";
import {scg03ea} from "./data/scg";

const mountPoint = document.getElementById("mount-point");

if (mountPoint) ReactDOM.render(<ScriptRenderComponent iniInput={scg03ea}/>, mountPoint);
else console.error("Mount point not found");