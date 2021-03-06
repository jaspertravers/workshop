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
import {exdefault} from './exdefault.js'
//  default

// setup
window.onload = onLoad;
function onLoad() {
  //
  //  Base
  //
  let cards = [];
  let space = "boot";
  //
  // Storage
  //

  function buildStorage() {
    const baseStorage = {root: [{spaces: [{cards: {content: null}}]}]} // type
    /*
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
    */
    const storage = JSON.parse(exdefault);
    saveStorage(storage);
  }

  //
  // interfacing functions
  //

  // viewSpace (space)
  // space from storage, stores current deck in cards variable
  function viewSpace(space) {
    createOrClearMain();
    cards = [];
    let context = getStorage();
    context[space].cards.forEach (card => {
      cards.push(viewCard(card));
      //viewCard(card);
    })
  }

  function saveSpace(space) {
    let context = getStorage();
    context[space].cards = []; // "reset"

    cards.forEach(card => {
      if (card.cardSpec.type == "prosemirror") {
        card.cardSpec.content = JSON.stringify(card.view.state.doc.toJSON());
      }
      if (card.cardSpec.type == "codemirror") {
        card.cardSpec.content = card.view.state.doc.toString();
      }

      //let storeCard = Object.assign({}, card.cardSpec); //shallow copy
      context[space].cards.push(card.cardSpec);
    });

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

    let view;
    if (cardSpec.type == "prosemirror") {
      view = viewProseMirror(cardSpec.content, content);
    }
    if (cardSpec.type == "codemirror") {
      view = viewCodeMirror(cardSpec.content, content);
    }
    if (cardSpec.type == "button") {
      content.style.display = "flex";
      content.style.justifyContent = "center";
      content.style.alignItems = "center";
      content.style.background = "#e5e5e5";

      let label = document.createTextNode(cardSpec.content)
      content.appendChild(label);

      content.onclick = () => {
        saveSpace(space);
        viewSpace(cardSpec.content);
        space = cardSpec.content; //update space global pointer
      }
    }

    return {card, cardSpec, view}; //don't use this atm
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

  //
  // Execution
  //
  // locked into "boot" only right now
  window.onkeydown = onKeyDown;
  function onKeyDown(evt) {
    if (evt.ctrlKey && evt.key == "Enter") {
      saveSpace(space);
      let task = buildTask(cards);
      run(task);
      //run(cmview.state.doc.toString());
    }
    if (evt.ctrlKey && evt.key == "s") {
      evt.preventDefault();
      saveSpace(space);
    }
  }

  function buildTask(cards) {
    return cards.filter(card => card.cardSpec.type == "codemirror")
      .map(card => card.view.state.doc.toString())
      .join(" ");
  }

  // should be in a card
  function run(task) {
    let runner = stopify.stopifyLocally(task, {newMethod: "direct"});
    runner.g = window;
    runner.run(result => result); //ignores stopify value
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
    window.cards = cards;
    window.space = space;
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
    window.buildTask = buildTask;
    window.exdefault = exdefault;
  }

  function mainrun() {
    if(!localStorage.workshop) { buildStorage() }
    //buildStorage();

    viewSpace("boot");
    buildWindowEnvironment();
  }
  mainrun();
}
