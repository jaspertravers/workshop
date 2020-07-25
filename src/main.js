// stopify is included via <script> in /public
// codemirror
import {EditorState, EditorView, basicSetup} from './codemirror.js'
// prosemirror
// console

// javascript
window.addEventListener("load", onLoad);

function onLoad() {
  let main = document.createElement("main");
  main.id = "main";
  document.body.appendChild(main);

  let cmnode = document.createElement("div");
  cmnode.id = "cmnode";
  main.appendChild(cmnode);

  /////////////////////////////////////////////////////////////////////////////
  // code mirror next //
  /////////////////////////////////////////////////////////////////////////////

  let view = new EditorView({
    state: EditorState.create({
      doc: 
`// Hello CodeMirror next
let x = 5;
console.log(x)
// ctrl-enter runs this editor
// open console to see console.log`,
      extensions: [basicSetup]
    }),
    parent: cmnode
  })

  /////////////////////////////////////////////////////////////////////////////
  // execution //
  /////////////////////////////////////////////////////////////////////////////

  window.onkeydown = onKeyDown;

  function onKeyDown(evt) {
    if (evt.ctrlKey && evt.key == "Enter") {
      run(view.state.doc.toString());
    }
  }

  function run(task) {
    let runner = stopify.stopifyLocally(task);
    //somehow this is undefined here; I'm unsure how that's possible, probably rollup?
    //runner.g = this; 
    runner.g = globalThis; // hack
    runner.run(result => result); //ignoring result
  }
}
