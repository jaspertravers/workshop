export const defaultCode = `let cards = [];
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
buildStorage();

//
// interfacing functions
//

function viewSpace(space) {
  createOrClearMain();
  cards = [];
  let context = getStorage();
  context[space].cards.forEach (card => {
    viewCard(card);
  })
}

function saveSpace(space) {
  let context = getStorage();
  context[space].cards = []; // "reset"

  cards.forEach(card => {
    if (card.type == "prosemirror") {
      card.content = JSON.stringify(card.view.state.doc.toJSON());
    }
    if (card.type == "codemirror") {
      card.content = card.view.state.doc.toString();
    }

    let view = card.view;
    delete card.view; //remove circle
    let storeCard = Object.assign({}, card); //shallow copy
    context[space].cards.push(storeCard);
    card.view = view;
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

  buildReference(cardSpec, view);

  return card; //don't use this atm
}
// TODO onchange?
function saveCard() {}
function buildReference(cardSpec, view) {
  //cards.push({...cardSpec, view}); //correct
  let card = Object.assign({}, cardSpec);
  card.view = view;
  cards.push(card);
}

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
// locked into "boot" only right now
window.onkeydown = onKeyDown;
function onKeyDown(evt) {
  if (evt.ctrlKey && evt.key == "Enter") {
    let task = buildTask(cards);
    run(task);
    //run(cmview.state.doc.toString());
  }
  if (evt.ctrlKey && evt.key == "s") {
    evt.preventDefault();
    saveSpace("boot");
  }
}

function buildTask(cards) {
  return cards.filter(card => card.type == "codemirror")
    .map(card => card.view.state.doc.toString())
    .join(" ");
}

// should be in a card
function run(task) {
  let runner = stopify.stopifyLocally(task, {newMethod: "direct"});
  runner.g = window;
  runner.run(result => result);
}
`

export const defaultProse = `{
  "type": "doc",
  "content": [
    {
      "type": "heading",
      "attrs": {
        "level": 1
      },
      "content": [
        {
          "type": "text",
          "text": "Workshop"
        }
      ]
    },
    {
      "type": "paragraph",
      "content": [
        {
          "type": "text",
          "text": "This is the beginnings of a digital workshop. It is intended to be an environment to provide full interface and computational control to the user. To that end, this environment initially provides three primitives on top of the browser: execution control, a rich content editor, and a code editor. The environment is intended to be a prototyping tool in which any and all functionality can be directly tied to its source, as well as redefined and re-evaluated at any point."
        }
      ]
    },
    {
      "type": "horizontal_rule"
    },
    {
      "type": "paragraph",
      "content": [
        {
          "type": "text",
          "text": "The initial view is this rich text editor which has a few basic facilities of a markdown editor, the codemirror editor to the right and an execution control engine tied to control-Enter. "
        }
      ]
    },
    {
      "type": "paragraph",
      "content": [
        {
          "type": "text",
          "text": "In the codemirror editor is the computational description for this page. Go ahead and try to run it, ctrl-enter anywhere will do. If you make any changes to that document, or say, add another code cell or tab to this page, running it will rebuild the entire document each time."
        }
      ]
    },
    {
      "type": "paragraph"
    },
    {
      "type": "paragraph",
      "content": [
        {
          "type": "text",
          "text": "This is just the most basic setup possible, in the days to come I will expand upon the initial content within the default setup and keep it all present and editable directly from the source. The Workshop is now in a state where all future development can occur within the system itself. With just a few more wires to connect to localStorage it will persist between saves and that’s the beginning of the adventure. "
        }
      ]
    },
    {
      "type": "paragraph",
      "content": [
        {
          "type": "text",
          "text": "— Jasper"
        }
      ]
    },
    {
      "type": "paragraph"
    },
    {
      "type": "paragraph",
      "content": [
        {
          "type": "text",
          "text": "(P.S: I wrote this damn thing twice and the first was much better. Off to fix the localStorage…)"
        }
      ]
    }
  ]
}`
