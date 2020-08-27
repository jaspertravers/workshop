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
import {emptyprose, emptycode} from './emptymirrors.js'

//import {sbiife} from './sandbox/sandbox.js'; sbiife(); //iife once removed
import {minimumSandbox} from './sandbox/minimumSandbox.js';
minimumSandbox(); //iife once removed
//  default

//  setup
window.onload = onLoad;
function onLoad() {
  window.makeCard = makeCard;
  window.styleCard = styleCard
  window.putCodeMirror = putCodeMirror;
  window.putProseMirror = putProseMirror;
  window.putButton = putButton;
  window.putCanvas = putCanvas;
  window.putConsole = putConsole;
  window.putLayout = putLayout;
  window.execute = execute;

  window.main = document.createElement('main');
  document.body.appendChild(main);
  document.body.style.fontSize = '1.1rem';

  buildBoot();
}

function buildBoot() {
  let boot = makeCard({top: 0, left: 0,
                       width: window.innerWidth, height: window.innerHeight},
                       main);
  boot.id = 'boot';
  boot.style.border = '';
  let browser = makeCard({top: 48, left: 12, width: 200, height: 600}, boot);
  let cmeditor = makeCard({top: 48, left: 224, width: 700, height: 1020}, boot);
  let pmeditor = makeCard({top: 48, left: 936, width: 700, height: 500}, boot);
  let consoleNode = makeCard({top: 560, left: 936, width: 686, height: 508}, boot);
  consoleNode.style.paddingLeft = '1rem'; //guessed 14, was 14
  consoleNode.style.overflowX = 'auto';
  //consoleNode.style.width = '700px - 1rem';
  let focusTarget = makeCard({top: 12, left: 1648, width: 260, height: 24}, boot);
  focusTarget.style.display = 'flex';
  focusTarget.style.alignItems = 'center';
  focusTarget.style.justifyContent = 'center';

  let nav1Spaces = makeCard({top: 12, left: 12, width: 1624, height: 24}, boot);
  let nav2Activity = makeCard({top: 48, left: 1648, width: 260, height: 1020}, boot);
  nav1Spaces.id = 'nav1Spaces';
  nav2Activity.id = 'nav2Activity';


  browser.id = 'browser';
  cmeditor.id = 'cmeditor';
  pmeditor.id = 'pmeditor';
  consoleNode.id = 'consoleNode';
  focusTarget.id = 'focusTarget';

  let cmview = putCodeMirror(getFuncStr(buildBoot), cmeditor);
  let pmview = putProseMirror(emptyprose, pmeditor);

  window.boot = boot; //DEBUG
  window.cmview = cmview; //DEBUG
  window.pmview = pmview; //DEBUG

  let functions = [buildBoot, buildBrowser, getFuncStr, makeCard,
                   styleCard, putCodeMirror, putProseMirror,
                   putButton, putCanvas, putConsole, putLayout, execute, () => {}];
  buildBrowser(browser, functions, cmeditor);

  boot.onmousemove = (evt) => {
    let target = evt.target;
    while (!target.id) {
      target = target.parentElement;
    }
    focusTarget.innerHTML = target.id;
  }

  // console
  setupConsole(consoleNode, cmview)
}

//target is a card
function buildBrowser (browser, functions, target) {
  functions.forEach (f => {
  let div;
    div = document.createElement('div');
    div.style.width = '100% - 1rem';
    div.style.height = '1.8rem';
    div.style.paddingLeft = '1rem';

    div.style.display = 'flex';
    div.style.alignItems = 'center';

    div.style.borderBottom = '1px dashed black';
    div.innerHTML = f.name;
    div.onmouseover = () => {div.style.background = '#eeeeee'}
    div.onmouseout = () => {div.style.background = '#ffffff'}
    div.onclick = (evt) =>  {
      while(target.firstChild) {
        target.removeChild(target.firstChild);
      }
      cmview = putCodeMirror(getFuncStr(f), target);
      console.info(cmview.state.doc.toString());
    }
    browser.appendChild(div);
  })
}

function getFuncStr(func) {
  const regex = /(^    )/gm; //cleans extra spaces added by toString()
  const string = func.toString().replace(regex, '');

  return string;
}

//
//
//

function makeCard(cardSpec, parent) {
  // if put in layout it wont have these same attributes
  let card = document.createElement('div');
  card.classList.add('card');
  card.style.position = 'absolute';
  card.style.top = cardSpec.top + 'px';
  card.style.left = cardSpec.left + 'px';
  card.style.width = cardSpec.width + 'px';
  card.style.height = cardSpec.height + 'px';

  styleCard(card);

  parent.appendChild(card);

  return card;
}

function styleCard(card) {
  card.style.border = '1px dashed black';
}

function putCodeMirror(doc, parent) {
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
function putProseMirror(docObj, parent) {
  let doc = pmSchema.nodeFromJSON(JSON.parse(docObj));

  let view = new pmEditorView(parent, {
    state: pmEditorState.create({
      doc: doc,
      plugins: pmSetup({schema: pmSchema})
    })
  })

  view.dom.style.paddingLeft = '1rem';
  view.dom.style.paddingRight = '0.5rem';

  // put it in parent's box
  view.dom.style.height = parent.style.height;
  view.dom.style.overflow = 'auto';
  return view;
}

function putButton(func, parent) {}

function putCanvas(target, parent) {
  let canvas = document.createElement('canvas');
  let ctx = canvas.getContext('2d');

  canvas.style.width = '100%';
  canvas.style.height = '100%';

  parent.appendChild(canvas);

  canvas.width = parseInt(parent.style.width);
  canvas.height = parseInt (parent.style.height);

  return {canvas, ctx};
}
function putConsole(target, parent) {}

// different...
function putLayout(layout, parent) {}

function execute(task) {
  let runner = stopify.stopifyLocally(task, {newMethod: 'direct'});
  console.info(task);
  runner.g = window;
  runner.run(result => console.info(result));
}

// console

function setupConsole(outnode, cmview) {
  let output = new Output(outnode);

  window.console.log = (arg) => {
    output.out(typeof arg, [arg])
  }

  window.onkeydown = (evt) => {
    if (evt.ctrlKey && evt.key == "Enter") {
      output.clear();
      execute(window.cmview.state.doc.toString());
    }
  }
}

