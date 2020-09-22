import {EditorState as cmEditorState,
        EditorView as cmEditorView,
        cmSetup} from './codemirror/codemirror.js'
import {EditorState as pmEditorState,
        EditorView as pmEditorView,
        DOMParser, pmSetup, pmSchema} from './prosemirror/prosemirror.js'
import {emptyprose, emptycode} from './emptymirrors.js'

import {activateCard} from './mouse.js'

//
//
//

function makeCard(cardSpec, parent) {
  // if put in layout it wont have these same attributes
  let card = document.createElement('div');

  card.classList.add('card')

  card.style.position = 'absolute';
  card.style.top = cardSpec.top + 'px';
  card.style.left = cardSpec.left + 'px';
  card.style.width = cardSpec.width + 'px'; //TODO this +1 applies each run...
  card.style.height = cardSpec.height + 'px'; //TODO this +1 applies each run...

  //styleCard(card);
  //makeDraggable(card);
  //addResizer(card);
  //addContextMenu(card);

  parent.appendChild(card);
  return card;
}

function styleCard(card) {
  //card.style.border = '1px dashed black';
  card.style.background = '#ffffff';
  card.style.background = '#fffbf4';
  return card;
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
  view.dom.style.height = '100%';
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
  view.dom.style.height = '100%';
  view.dom.style.overflow = 'auto';
  return view;
}
function putCanvas(parent) {
  let canvas = document.createElement('canvas');
  canvas.width = parseInt(parent.style.width);
  canvas.height = parseInt(parent.style.height);

  let ctx = canvas.getContext('2d');

  parent.appendChild(canvas);

  return ctx;
}

function viewState(cards, root, opts={}) {
  cards.forEach (c => {
    if(c.name === 'boot') {
      c.spec = {top: 0, left: 0, width: window.innerWidth, height: window.innerHeight}
    }
    c.node = makeCard(c.spec, root);
    c.view = putComponent(c.type, c.node, c.content);

    if (opts.style) styleCard(c.node);
    if (opts.active) activateCard(c.node); //mouse.js

    viewState(c.children, c.node, {style: true, active: true});
  });
  return cards;
}

function viewCard(card) {

}

function saveCard(card, parent) {
  let parentRuntime = getCardRuntime(parent);
  let runtime = specToState(card);
  parentRuntime.children.push(runtime);
  return runtime;
}

function specToState(card) {
  let top = parseInt(card.style.top);
  let left = parseInt(card.style.left);
  let width = parseInt(card.style.width);
  let height = parseInt(card.style.height);
  return {spec: {top, left, width, height},
          children: [],
          node: card,
          type: 'empty',
          view: null,
          content: null
         }
}

function putComponent(type, parent, content) {
  let runtime = getCardRuntime(parent);
  let view;
  if (type === 'codemirror') {
    view = putCodeMirror(content || emptycode, parent);
  }
  if (type === 'prosemirror') {
    view = putProseMirror(content || emptyprose, parent);
  }
  if (type === 'container') {
    view = putContainer(parent);
  }
  if (type === 'canvas') {
    view = putCanvas(parent);
  }
  if (runtime) runtime.type = type;
  if (runtime) runtime.view = view;
  return view;
}

function putContainer(node) {

  // grid
  let canvas = document.createElement('canvas');
  node.appendChild(canvas);
  canvas.width = parseInt(node.style.width);
  canvas.height = parseInt(node.style.height);
  let ctx = canvas.getContext('2d');
  ctx.globalAlpha = 1.0;
  ctx.fillStyle = '#282828';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.globalAlpha = 0.3;
  ctx.fillStyle = '#fffbf4';
  for (let x = 12; x < canvas.width; x += 12) {
    for (let y = 12; y < canvas.height; y += 12) {
      ctx.fillRect(x, y, 1, 1);
    }
  }
}


function getCardRuntime(target) {
  function findTarget(target, root) {
    for (let card of root) {
      if (card.node === target) return card;
      if (card.children && card.children.length != 0) return findTarget(target, card.children);
    }
  }
  return findTarget(target, window.state.cards);
}

function getFirstCardFromEvent(evt) {
  for(let node of evt.path) {
    if (node.classList.contains('card')) return node;
  }
}

window.getFirstCardFromEvent = getFirstCardFromEvent; //TODO Debug

function getAllChildren(card) {
  let children = [];
  function eachCard(root) {
    for (let index = 0; index < root.length; index++) {
      let card = root[index];
      children.push(card);

      if (card.children && card.children.length != 0 && card.type != 'container') {
        eachCard(card.children);
      }
    }
  }

  eachCard(card.children);
  return children;
}

/* for every card, recursing through children
 * if any are different, save state
 */
function saveState() {
  function updateEachCard(root) {
    for (let index = 0; index < root.length; index++) {
      let card = root[index];

      if (card.removed) {
        root.splice(index, 1);
      }

      let spec = getSpecFromNode(card.node);
      card.spec.top = spec.top;
      card.spec.left = spec.left;
      card.spec.width = spec.width;
      card.spec.height = spec.height;

      setComponentContent(card);

      if (card.children && card.children.length != 0) {
        return updateEachCard(card.children);
      }
    }
  }

  let root = window.state.cards;

  updateEachCard(root);

  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Cyclic_object_value
  function replacer (key, value) {
    if (key === 'view') {
      return null;
    }
    if (key === 'node') {
      return null;
    }
    return value;
  }
  // save
  //let json = JSON.stringify(root, getCircularReplacer);
  let json = JSON.stringify(root, replacer);
  window.localStorage.state = json;
}

function setComponentContent(card) {
  if (card.type === 'codemirror') {
    card.content = card.view.state.doc.toString();
  }
  if (card.type === 'prosemirror') {
    card.content = JSON.stringify(card.view.state.doc.toJSON());
  }
}

function getSpecFromNode(node) {
  let top = parseInt(node.style.top);
  let left = parseInt(node.style.left);
  let width = parseInt(node.style.width);
  let height = parseInt(node.style.height);
  return {top, left, width, height};
}



export {makeCard}
export {styleCard}
export {putCodeMirror}
export {putProseMirror}
export {viewState}
export {viewCard}
export {putComponent}
export {activateCard}
export {getCardRuntime}
export {getFirstCardFromEvent}
export {getAllChildren}
export {saveCard}
export {saveState}
