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

export {makeCard, styleCard}
export {putCodeMirror, putProseMirror}
export {putButton, putCanvas, putConsole, putLayout}
export {execute}
export {emptyprose, emptycode}
