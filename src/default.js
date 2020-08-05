export const defaultString =
`// allows re running
let main;
if (main = document.getElementById("main")) {
  document.body.removeChild(main);
}
main = document.createElement("main");
main.id = "main";
document.body.appendChild(main);
document.body.style.fontSize = "1.1rem";

function buildStorage () {
  const baseRoot = {spaces: [{cards: {content: null}}]}
  window.localStorage.workshop = JSON.stringify(baseRoot)
}

if(!localStorage.workshop) { buildStorage() }

// TODO interfacing functions

//
// execution
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
  let pmview = prosemirrorInit(pmEditorView, pmEditorState,
                               defaultProse, pmSetup, pmSchema, pmcard.firstChild)

  let cmcard = buildCard({top: 48, left: 660, width: 700, height: 800})
  let cmview = codemirrorInit(cmEditorView, cmEditorState,
                              defaultString, basicSetup, cmcard.firstChild)

  return {pmview, cmview};
}
let views = buildVisualEnvironment();
let pmview = views.pmview;
let cmview = views.cmview;
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
