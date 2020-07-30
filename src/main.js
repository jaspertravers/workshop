// stopify is included via <script> in /public
// codemirror
import {EditorState as cmEditorState,
        EditorView as cmEditorView,
        basicSetup,
        startupDoc} from './codemirror/codemirror.js'
// prosemirror
import {EditorState as pmEditorState,
        EditorView as pmEditorView,
        DOMParser, pmSetup, pmSchema, pmStartupDoc} from './prosemirror/prosemirror.js'
// console

// setup
window.addEventListener("load", onLoad);

function onLoad() {
  // html setup
  let main = document.createElement("main");
  main.id = "main";
  document.body.appendChild(main);

  let cmnode = document.createElement("div");
  cmnode.id = "cmnode";

  let pmnode = document.createElement("div");
  pmnode.id = "pmnode";
  let pmdoc = document.createElement("div");
  pmdoc.id = "pmdoc";
  let pmdoch1 = document.createElement("h1");
  pmdoch1.innerHTML = "Hello ProseMirror";
  let pmdocp = document.createElement("p");
  pmdocp.innerHTML = "Here we have an editor";
  pmdoc.appendChild(pmdoch1);
  pmdoc.appendChild(pmdocp);
  // main.appendChild(pmdoc); // intentionally omitted

  main.appendChild(pmnode);
  main.appendChild(cmnode);
  document.body.style.fontSize = "1.1rem";

  // javascript setup

  /////////////////////////////////////////////////////////////////////////////
  // prosemirror //
  /////////////////////////////////////////////////////////////////////////////

  let pmview = prosemirrorInit(pmEditorView, pmEditorState,
                               pmdoc, pmSetup, pmSchema, pmnode);
  pmview.dom.style.marginLeft = "1rem";

  /////////////////////////////////////////////////////////////////////////////
  // code mirror next //
  /////////////////////////////////////////////////////////////////////////////

  let cmview = codemirrorInit(cmEditorView, cmEditorState,
                              startupDoc, basicSetup, pmnode);

  /////////////////////////////////////////////////////////////////////////////
  // execution //
  /////////////////////////////////////////////////////////////////////////////

  window.onkeydown = onKeyDown;

  function onKeyDown(evt) {
    if (evt.ctrlKey && evt.key == "Enter") {
      run(cmview.state.doc.toString());
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


//
//  utility
//


function codemirrorInit (EditorView, EditorState, doc, setup, parent) {
  let view = new EditorView({
    state: EditorState.create({
      doc,
      extensions: [setup]
    }),
    parent
  })
  return view;
}

function prosemirrorInit(EditorView, EditorState, docToParse, setup, schema, parent) {
  let view = new EditorView(parent, {
    state: EditorState.create({
      doc: DOMParser.fromSchema(pmSchema).parse(docToParse),
      plugins: setup({schema})
    })
  })
  return view;
}
