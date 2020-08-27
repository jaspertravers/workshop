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
  makeDraggable(card);
  addResizer(card);
  addContextMenu(card);

  parent.appendChild(card);

  return card;
}

function styleCard(card) {
  card.style.border = '1px dashed black';
  card.style.background = '#ffffff';
  card.style.cursor = 'auto';
}
function addResizer(card, step=12) {
  let resizer = document.createElement('div');
  resizer.style.position = 'absolute'
  resizer.style.top = parseInt(card.style.height) - 10 + 'px';
  resizer.style.left = parseInt(card.style.width) - 10 + 'px';
  resizer.style.width = '10px';
  resizer.style.height = '10px';

  resizer.style.background = '#eeeeee';
  resizer.style.zIndex = 1;
  resizer.style.cursor = 'nwse-resize';

  resizer.onmousedown = function (evt) {
    evt.stopPropagation();
    resizer.dataset.startX = evt.clientX;
    resizer.dataset.startY = evt.clientY;

    document.onmousemove = function (evt) {
      evt.preventDefault();
      let width = parseInt(card.style.width);
      let height = parseInt(card.style.height);

      let startX = parseInt(resizer.dataset.startX);
      let startY = parseInt(resizer.dataset.startY);

      let dx = evt.clientX - startX;
      let dy = evt.clientY - startY;

      if (Math.abs(dx) >= step) {
        let times = Math.floor(Math.abs(dx) / step) + (dx < 0 ? 0 : 1);
        if (dx < 0) {
          startX -= step * times;
          width -= step * times;
          resizer.style.left = parseInt(resizer.style.left) - step * times + 'px';
        }
        else { //positive
          startX += step * times;
          width += step * times;
          resizer.style.left = parseInt(resizer.style.left) + step * times + 'px';
        }
      }
      if (Math.abs(dy) >= step) {
        let times = Math.floor(Math.abs(dy) / step) + (dy < 0 ? 0 : 1);
        if (dy < 0) {
          startY -= step * times;
          height -= step * times;
          resizer.style.top = parseInt(resizer.style.top) - step * times + 'px';
        }
        else { //positive
          startY += step * times;
          height += step * times;
          resizer.style.top = parseInt(resizer.style.top) + step * times + 'px';
        }
      }

      resizer.dataset.startX = startX;
      resizer.dataset.startY = startY;
      card.style.width = width + 'px';
      card.style.height = height + 'px';
    }
    document.onmouseup = function (evt) {
      document.onmousemove = null;
      document.onmouseup = null;
    }
  }

  card.appendChild(resizer);
}
function makeDraggable(card, step=12) {
  //const step = 12; //constrain to 12pt grid
  card.onmousedown = function (evt) {
    evt.stopPropagation();
    if(evt.altKey) {
      card.style.cursor = 'move';
      card.dataset.startX = evt.clientX;
      card.dataset.startY = evt.clientY;

      document.onmousemove = function (evt) {
        evt.preventDefault();
        let startX = parseInt(card.dataset.startX);
        let startY = parseInt(card.dataset.startY);
        let offsetX = evt.clientX - startX;
        let offsetY = evt.clientY - startY;

        let top = parseInt(card.style.top);
        let left = parseInt(card.style.left);

        let xtimes = Math.floor(Math.abs(offsetX) / step) + (offsetX < 0 ? 0 : 1);
        let leftOffset = offsetX % step;
        if (Math.abs(leftOffset) >= (9)) {
          leftOffset >= 0 ? (left += step * xtimes, startX += step * xtimes) :
            (left -= step * xtimes, startX -= step * xtimes);
        }

        let ytimes = Math.abs(Math.floor(offsetY / step)) + (offsetY < 0 ? 0 : 1);
        let topOffset = offsetY % step;
        if (Math.abs(topOffset) >= (9)) {
          topOffset >= 0 ? (top += step * ytimes, startY += step * ytimes) :
            (top -= step * ytimes, startY -= step * ytimes);
        }

        card.dataset.startX = startX;
        card.dataset.startY = startY;
        card.style.top = top + 'px';
        card.style.left = left + 'px';
      }
      document.onmouseup = function (evt) {
        document.onmousemove = null;
        document.onmouseup = null;
        card.style.cursor = 'auto';
      }
    }
  }
}
function addContextMenu(card) {
  card.oncontextmenu = function (evt) {
    evt.preventDefault();
    evt.stopPropagation();

    let menu = document.createElement('div');
    menu.style.position = 'absolute';
    menu.style.left = evt.offsetX + 'px';
    menu.style.top = evt.offsetY + 'px';
    menu.style.borderLeft = "1px dashed black";
    menu.style.borderTop = "1px dashed black";
    menu.style.borderRight = "1px dashed black";

    menu.onmouseout = (evt) => {
      if (!menu.contains(evt.relatedTarget)) {
        menu.remove();
      }
    }

    let emptybuttons = ['codemirror', 'prosemirror', 'remove'];
    let contentbuttons = ['clone', 'remove'];

    card.appendChild(menu);
    if (card.dataset.filled === 'true') {
      contentbuttons.forEach (btn => buildButtons(btn))
    }
    else {
      emptybuttons.forEach (btn => buildButtons(btn))
    }

    function buildButtons(btn) {
      let div;
      div = document.createElement('div');
      div.style.width = '100% - 1rem';
      div.style.height = '1.8rem';
      div.style.paddingLeft = '1rem';
      div.style.paddingRight = '1rem';

      div.style.display = 'flex';
      div.style.alignItems = 'center';

      div.style.borderBottom = '1px dashed black';
      div.innerHTML = btn;
      div.onmouseover = () => {div.style.background = '#eeeeee'}
      div.onmouseout = () => {div.style.background = '#ffffff'}
      div.onclick = (evt) =>  {
        let target = evt.target;
        let type = target.innerHTML;
        let parent = target.parentElement.parentElement;
        if (type == 'codemirror') {
          putCodeMirror(emptycode, parent);
          parent.dataset.filled = true;
        }
        if (type == 'prosemirror') {
          putProseMirror(emptyprose, parent);
          parent.dataset.filled = true;
        }
        if (type == 'remove') {
          parent.remove();
        }
        //TODO
        if (type == 'clone') {
          //node.cloneNode(true) is a bit rough to work with.
          //it doesn't copy event listeners and breaks the editors
          //come back to this after runtime objects are connected to nodes
        }
        target.parentElement.remove();
      }
      menu.appendChild(div);
    }
  }
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
function putContainer(parent) {}

function execute(task) {
  let runner = stopify.stopifyLocally(task, {newMethod: 'direct'});
  console.info(task);
  runner.g = window;
  runner.run(result => console.info(result));
}

export {makeCard, styleCard}
export {putCodeMirror, putProseMirror}
export {putButton, putCanvas, putConsole, putLayout, putContainer}
export {execute}
export {emptyprose, emptycode}
export {makeDraggable}
