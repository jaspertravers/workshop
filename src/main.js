// stopify is included via <script> in /public
// codemirror
import {EditorState as cmEditorState,
        EditorView as cmEditorView,
        basicSetup,
        cmStartupDoc} from './codemirror/codemirror.js'
// prosemirror
import {EditorState as pmEditorState,
        EditorView as pmEditorView,
        DOMParser, pmSetup, pmSchema, pmStartupDoc} from './prosemirror/prosemirror.js'
// console
// card

// setup
window.onload = onLoad;

function onLoad() {
  // html setup
  let main = document.createElement("main");
  main.id = "main";
  document.body.appendChild(main);

  let tabs = document.createElement("div");
  tabs.id = "tabs";
  tabs.style.width = "100%";
  tabs.style.height = "36px";
  tabs.style.border = "1px dashed #999";

  let editorContainer = document.createElement("div");
  editorContainer.id = "editorContainer";
  editorContainer.style.display = "flex"

  let cmnode = document.createElement("div");
  cmnode.id = "cmnode";
  cmnode.style.width = "50%"

  let pmnode = document.createElement("div");
  pmnode.id = "pmnode";
  pmnode.style.width = "50%"
  let pmdoc = document.createElement("div");
  pmdoc.id = "pmdoc";
  let pmdoch1 = document.createElement("h1");
  pmdoch1.innerHTML = "Hello ProseMirror";
  let pmdocp = document.createElement("p");
  pmdocp.innerHTML = "Here we have an editor";
  pmdoc.appendChild(pmdoch1);
  pmdoc.appendChild(pmdocp);
  // main.appendChild(pmdoc); // intentionally omitted

  main.appendChild(tabs);
  main.appendChild(editorContainer);
  editorContainer.appendChild(pmnode);
  editorContainer.appendChild(cmnode);

  document.body.style.fontSize = "1.1rem";

  // javascript setup

  // prosemirror //

  let pmview = prosemirrorInit(pmEditorView, pmEditorState,
                               pmdoc, pmSetup, pmSchema, pmnode);
  pmview.dom.style.marginLeft = "1rem";

  // code mirror next //

  let cmview = codemirrorInit(cmEditorView, cmEditorState,
                              cmStartupDoc, basicSetup, cmnode);
  // execution //

  window.onkeydown = onKeyDown;
  function onKeyDown(evt) {
    if (evt.ctrlKey && evt.key == "Enter") {
      run(cmview.state.doc.toString());
    }
  }

  //
  //  utility
  //

  function run(task) {
    let runner = stopify.stopifyLocally(task);
    runner.g = window;
    console.log(runner.g);
    runner.run(result => console.log(result));
  }

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

  function prosemirrorInit (EditorView, EditorState, docToParse, setup, schema, parent) {
    let view = new EditorView(parent, {
      state: EditorState.create({
        doc: DOMParser.fromSchema(pmSchema).parse(docToParse),
        plugins: setup({schema})
      })
    })
    return view;
  }

  //window init for runtime
  // imports
  window.cmEditorState = cmEditorState;
  window.cmEditorView = cmEditorView;
  window.basicSetup = basicSetup;
  window.cmStartupDoc = cmStartupDoc;
  window.pmEditorState = pmEditorState;
  window.pmEditorView = pmEditorView;
  window.DOMParser = DOMParser;
  window.pmSetup = pmSetup;
  window.pmSchema = pmSchema;
  window.pmStartupDoc = pmStartupDoc;
  window.Card = Card;

  //local
  window.cmview = cmview;
  window.pmview = pmview;
  window.codemirrorInit = codemirrorInit;
  window.prosemirrorInit = prosemirrorInit;
}
