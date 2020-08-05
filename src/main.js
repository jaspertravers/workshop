// stopify is included via <script> in /public
// codemirror
import {EditorState as cmEditorState,
        EditorView as cmEditorView,
        basicSetup,
        cmStartupDoc} from './codemirror/codemirror.js'
// prosemirror
import {EditorState as pmEditorState,
        EditorView as pmEditorView,
        DOMParser, pmSetup, pmSchema} from './prosemirror/prosemirror.js'
// console
// card
import {defaultString, defaultProse} from './default.js'
//  default

// setup
window.onload = onLoad;
function onLoad() {
  //
  //  Base
  //
  let main;
  if (main = document.getElementById("main")) {
    document.body.removeChild(main);
  }
  main = document.createElement("main");
  main.id = "main";
  document.body.appendChild(main);
  document.body.style.fontSize = "1.1rem";

  //
  // Storage
  //

  function buildStorage () {
    const baseRoot = {root: [{spaces: [{cards: {content: null}}]}]}
    window.localStorage.workshop = JSON.stringify(baseRoot)
  }

  if(!localStorage.workshop) { buildStorage() }

  // TODO interfacing functions

  function cardInterface(value, space) {
    let context = getStorage();
    context.root.space
    pushStorage(json);
  }

  function viewSpace (space) {
    let context = getStorage();
    context.space.cards.forEach (c => {
      viewCard(c);
    })
  }
  function saveSpace (space) {

  }
  function viewCard (card) {

  }

  function getStorage() {
    return JSON.parse(window.localStorage.workshop);
  }

  function displayState() {

  }

  //
  // Execution
  //
  window.onkeydown = onKeyDown;
  function onKeyDown(evt) {
    if (evt.ctrlKey && evt.key == "Enter") {
      run(cmview.state.doc.toString());
    }
  }

  // should be in a card
  function run(task) {
    let runner = stopify.stopifyLocally(task, {newMethod: "direct"});
    //console.log(runner)
    runner.g = window;
    //runner.run(result => console.log(result));
    runner.run(result => result);
  }

  //
  // Interface
  //

  //should be in a card
  function codemirrorInit (EditorView, EditorState, doc, setup, parent) {
    let view = new EditorView({
      state: EditorState.create({
        doc,
        extensions: [setup]
      }),
      parent
    })

    // put it in parent's box
    view.dom.style.height = parent.style.height;
    return view;
  }

  //should be in a card
  function prosemirrorInit (EditorView, EditorState, docJSON, setup, schema, parent) {
    let doc = schema.nodeFromJSON(JSON.parse(docJSON));

    let view = new EditorView(parent, {
      state: EditorState.create({
        doc: doc,
        plugins: setup({schema})
      })
    })

    // put it in parent's box
    view.dom.style.paddingLeft = "1rem";
    view.dom.style.paddingRight = "0.5rem";
    view.dom.style.height = parent.style.height;
    view.dom.style.overflow = "auto";
    return view;
  }


  //
  // visual interface
  //

  // TODO
  // should be in a card
  // function buildCard ({top, left, width, height}) {
  // stopify breaks parsing the {} destructuring
  function buildCard (position) {
    let top, left, width, height;
    top = position.top;
    left = position.left;
    width = position.width;
    height = position.height;
    let card = document.createElement("div");
    card.classList.add("card");
    card.style.border = "1px dashed black"
    card.style.position = "absolute";
    card.style.top = top + "px";
    card.style.left = left + "px";
    card.style.width = width + "px";
    card.style.height = height + "px";
    main.appendChild(card);

    let content = document.createElement("div");
    content.classList.add("content");
    content.style.width = "100%";
    content.style.height = "100%";

    card.appendChild(content);

    return card;
  }

  function buildVisualEnvironment () {
    let pmcard = buildCard({top: 48, left: 48, width: 600, height: 600})
    let pmview = prosemirrorInit(pmEditorView, pmEditorState, defaultProse, pmSetup, pmSchema, pmcard.firstChild)

    let cmcard = buildCard({top: 48, left: 660, width: 700, height: 800})
    let cmview = codemirrorInit(cmEditorView, cmEditorState, defaultString, basicSetup, cmcard.firstChild)

    return {pmview, cmview};
  }

  let views = buildVisualEnvironment();
  let pmview = views.pmview;
  let cmview = views.cmview;

  function buildWindowEnvironment () {
    // window init for runtime
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
    window.defaultString = defaultString;
    // local
    window.run = run;
    window.stopify = stopify;
    window.onKeyDown = onKeyDown;
    window.defaultProse = defaultProse;
    window.pmview = pmview;
    window.cmview = cmview;
  }
  buildWindowEnvironment();
}
