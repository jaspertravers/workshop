import { Inspector } from "@observablehq/inspector";
import { inspect } from "../../node_modules/@observablehq/inspector/src/inspect.js";

export function putInspector(parent) {
  //return Inspector.into(parent);
  return (value) => parent.appendChild(inspect(value));
}
