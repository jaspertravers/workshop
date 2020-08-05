// stopify is included via <script> in /public
// codemirror
import {EditorState as cmEditorState,
        EditorView as cmEditorView,
        cmSetup} from './codemirror/codemirror.js'
// prosemirror
import {EditorState as pmEditorState,
        EditorView as pmEditorView,
        DOMParser, pmSetup, pmSchema} from './prosemirror/prosemirror.js'
// console
// card
import {defaultCode, defaultProse} from './default.js'
//  default

// setup
window.onload = onLoad;
function onLoad() {
  //
  //  Base
  //
  let cmview, pmview;
  //
  // Storage
  //

  function buildStorage() {
    const baseStorage = {root: [{spaces: [{cards: {content: null}}]}]}
    const storage = {boot: {cards: [
      {
        top: 48, left: 48, width: 600, height: 600,
        type: "prosemirror",
        content: defaultProse
      },
      {
        top: 48, left: 660, width: 700, height: 800,
        type: "codemirror",
        content: defaultCode
      }
    ]}}
    window.localStorage.workshop = JSON.stringify(storage)
  }

  if(!localStorage.workshop) { buildStorage() }
  //buildStorage();

  //
  // interfacing functions
  //

  function viewSpace(space) {
    createOrClearMain();
    let context = getStorage();
    context[space].cards.forEach (card => {
      viewCard(card);
    })
  }
  // TODO onchange?
  // on ctrl-s right now, but limited to two editors pmview and cmview
  function saveSpace(space) {
    let context = getStorage();
    context[space].cards.forEach (card => {
      if (card.type == "prosemirror") {
        card.content = JSON.stringify(pmview.state.doc.toJSON());
      }
      if (card.type == "codemirror") {
        card.content = cmview.state.doc.toString();
      }
    })
    saveStorage(context);
  }
  function viewCard(cardSpec) {
    let card = document.createElement("div");
    card.classList.add("card");
    card.style.border = "1px dashed black"
    card.style.position = "absolute";
    card.style.top = cardSpec.top + "px";
    card.style.left = cardSpec.left + "px";
    card.style.width = cardSpec.width + "px";
    card.style.height = cardSpec.height + "px";
    main.appendChild(card);

    let content = document.createElement("div");
    content.classList.add("content");
    content.style.width = "100%";
    content.style.height = "100%";

    card.appendChild(content);

    if (cardSpec.type == "prosemirror") {
      // TODO cant set here
      pmview = viewProseMirror(cardSpec.content, content)
    }
    if (cardSpec.type == "codemirror") {
      // TODO cant set here
      cmview = viewCodeMirror(cardSpec.content, content)
    }

    return card;
  }
  // TODO onchange?
  function saveCard() {}

  function viewProseMirror(docObj, parent) {
    let doc = pmSchema.nodeFromJSON(JSON.parse(docObj));

    let view = new pmEditorView(parent, {
      state: pmEditorState.create({
        doc: doc,
        plugins: pmSetup({schema: pmSchema})
      })
    })

    // put it in parent's box
    view.dom.style.paddingLeft = "1rem";
    view.dom.style.paddingRight = "0.5rem";
    view.dom.style.height = parent.style.height;
    view.dom.style.overflow = "auto";
    return view;
  }
  function viewCodeMirror(doc, parent) {
    let view = new cmEditorView({
      state: cmEditorState.create({
        doc,
        extensions: [cmSetup]
      }),
      parent
    })

    // put it in parent's box
    view.dom.style.height = parent.style.height;
    return view;
  }

  function getStorage() {
    return JSON.parse(window.localStorage.workshop);
  }
  function saveStorage(context) {
    window.localStorage.workshop = JSON.stringify(context);
  }

  function createOrClearMain() {
    let main;
    if (main = document.getElementById("main")) {
      document.body.removeChild(main);
    }
    main = document.createElement("main");
    main.id = "main";
    document.body.appendChild(main);
    document.body.style.fontSize = "1.1rem";
  }

  //  end interfacing functions

  viewSpace("boot");

  //
  // Execution
  //
  // TODO hacked together right now
  window.onkeydown = onKeyDown;
  function onKeyDown(evt) {
    if (evt.ctrlKey && evt.key == "Enter") {
      run(cmview.state.doc.toString());
    }
    if (evt.ctrlKey && evt.key == "s") {
      evt.preventDefault();
      saveSpace("boot");
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
  function buildWindowEnvironment() {
    // window init for runtime
    // imports
    window.cmEditorState = cmEditorState;
    window.cmEditorView = cmEditorView;
    window.cmSetup = cmSetup;
    window.pmEditorState = pmEditorState;
    window.pmEditorView = pmEditorView;
    window.DOMParser = DOMParser;
    window.pmSetup = pmSetup;
    window.pmSchema = pmSchema;
    window.defaultCode = defaultCode;
    window.defaultProse = defaultProse;
    // local
    window.run = run;
    window.stopify = stopify;
    window.onKeyDown = onKeyDown;
    window.pmview = pmview;
    window.cmview = cmview;
    window.buildStorage = buildStorage;
    window.viewSpace = viewSpace;
    window.saveSpace = saveSpace;
    window.viewCard = viewCard;
    window.saveCard = saveCard;
    window.viewProseMirror = viewProseMirror;
    window.viewCodeMirror = viewCodeMirror;
    window.getStorage = getStorage;
    window.saveStorage = saveStorage;
    window.createOrClearMain = createOrClearMain;
  }
  buildWindowEnvironment();
}
