// stopify is included via <script> in /public
// codemirror
import {EditorState, EditorView, basicSetup} from './codemirror/codemirror.js'
// prosemirror
import {EditorState as proseEditorState} from "prosemirror-state"
import {EditorView as proseEditorView} from "prosemirror-view"
import {Schema, DOMParser} from "prosemirror-model"
import {schema} from "prosemirror-schema-basic"
import {addListNodes} from "prosemirror-schema-list"
import {exampleSetup} from "prosemirror-example-setup"
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
  let pmnode = document.createElement("div");
  pmnode.id = "cmnode";
  main.appendChild(pmnode);

  document.body.style.fontSize = "1.2rem";

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
  // prosemirror //
  /////////////////////////////////////////////////////////////////////////////


  // Mix the nodes from prosemirror-schema-list into the basic schema to
  // create a schema with list support.
  const mySchema = new Schema({
    nodes: addListNodes(schema.spec.nodes, "paragraph block*", "block"),
    marks: schema.spec.marks
  })

  //window.view = new proseEditorView(document.querySelector("#editor"), {
  let pview = new proseEditorView(document.querySelector("#editor"), {
    state: proseEditorState.create({
      doc: DOMParser.fromSchema(mySchema).parse(document.querySelector("#content")),
      plugins: exampleSetup({schema: mySchema})
    })
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
