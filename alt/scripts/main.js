window.addEventListener("load", onLoad);

function onLoad() {
  value =
`/* this is this */

//allows re-running
if (main) {
  if (codemirror) {
    value = codemirror.getValue();
  }
	document.body.removeChild(main);
}

//start here
let main = document.createElement("main");
main.id = "main";
document.body.appendChild(main);

let CodeMirrorNode = document.createElement("div");
CodeMirrorNode.id = "CodeMirrorNode";
main.appendChild(CodeMirrorNode);

const CMOPTS = {
  lineNumbers: true,
  lineWrapping: true,
  indentWithTabs: true,
  indentUnit: 2,
  tabSize: 2,
  mode: "javascript"
};

let codemirror = CodeMirror(CodeMirrorNode, CMOPTS);

let CMBodyNode = document.getElementsByClassName("CodeMirror")[0];
CMBodyNode.style.height = "100%";
CMBodyNode.style.width = "720px";
CMBodyNode.style.fontSize = "14px";
CMBodyNode.style.border = "1px dashed #282828";

codemirror.setValue(value); //this content is the initialvalue

// execution //

window.onkeydown = onKeyDown;

function onKeyDown(evt) {
  if (evt.ctrlKey && evt.key == "Enter") {
    run(codemirror.getValue());
  }
}

function run(task) {
  let runner = stopify.stopifyLocally(task);
  runner.g = this; //hmmm
  runner.run(result => result); //ignoring result, irrelevant
}
`; //end of init string template

  let runner = stopify.stopifyLocally(value);
  runner.g = this; //hmmm
  runner.value = value; //odd requirement, but works
  runner.run(result => console.log(result)); //can go back to ignoring this probably
}
