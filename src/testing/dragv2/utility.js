import {EditorState as cmEditorState,
        EditorView as cmEditorView,
        cmSetup} from './codemirror/codemirror.js'
import {EditorState as pmEditorState,
        EditorView as pmEditorView,
        DOMParser, pmSetup, pmSchema} from './prosemirror/prosemirror.js'
import {emptyprose, emptycode} from './emptymirrors.js'


/*
 *
 * makeCard(cardSpec, parent)
 * styleCard(card)
 * makeConstrainedDraggable(step)
 * constraintHandlerBuilder(step, fdx, fdy)
 * makeConstrainedResizable(padding, key)
 * assignHotEdges(padding)
 * putGridBackground(target)
 * makeCreateNewDrag(target)
 * makeConstrainedCard(evt)
 * activateCard(card)
 * addContextMenu(card)
 *
 *
 *
 */

function makeCard(cardSpec, parent) {
  // if put in layout it wont have these same attributes
  let card = document.createElement('div');
  card.classList.add('card');
  card.style.position = 'absolute';
  card.style.top = cardSpec.top + 'px';
  card.style.left = cardSpec.left + 'px';
  card.style.width = cardSpec.width + 'px';
  card.style.height = cardSpec.height + 'px';

  //styleCard(card);
  //makeDraggable(card);
  //addResizer(card);
  //addContextMenu(card);

  parent.appendChild(card);
  return card;
}

function styleCard(card) {
  card.style.border = '1px dashed black';
  card.style.background = '#ffffff';
  card.style.cursor = 'auto';
  return card;
}

function makeConstrainedDraggable(step) {
  function fdx(delta, target) {
    target.style.left = parseInt(target.style.left) + delta + 'px';
  }
  function fdy(delta, target) {
    target.style.top = parseInt(target.style.top) + delta + 'px';
  }

  return constraintHandlerBuilder(step, fdx, fdy);
}

function constraintHandlerBuilder(step, fdx, fdy) {
  let dx = 0;
  let dy = 0;
  let target;

  return function (evt) {
    evt.stopPropagation();
    target = evt.currentTarget;
    target.style.cursor = 'move';
    document.onmousemove = function(evt) {
      dx += evt.movementX;
      dy += evt.movementY;

      //3/4 prevents problems present at 1/2
      //while ensures speedy drags are followed
      while(dx >  step * 3 / 4) { fdx(step, target); dx -= step }
      while(dx < -step * 3 / 4) { fdx(-step, target); dx += step }
      while(dy >  step * 3 / 4) { fdy(step, target); dy -= step }
      while(dy < -step * 3 / 4) { fdy(-step, target); dy += step }
    }

    document.onmouseup = function(evt) {
      target.style.cursor = 'auto';
      document.onmousemove = null;
      document.onmouseup = null;
    }
  }
}

function makeConstrainedResizable(padding, key) {
  let dx = 0;
  let dy = 0;
  let step = 12;
  let fdx;
  let fdy;

  // switch
  if (key == 'nw') {
    fdx = function (delta, target) {
      target.style.width = parseInt(target.style.width) - delta + 'px';
      target.style.left = parseInt(target.style.left) + delta + 'px';
    }
    fdy = function (delta, target) {
      target.style.height = parseInt(target.style.height) - delta + 'px';
      target.style.top = parseInt(target.style.top) + delta + 'px';
    }
  }
  if (key == 'ne') {
    fdx = function (delta, target) {
      target.style.width = parseInt(target.style.width) + delta + 'px';
    }
    fdy = function (delta, target) {
      target.style.height = parseInt(target.style.height) - delta + 'px';
      target.style.top = parseInt(target.style.top) + delta + 'px';
    }
  }
  if (key == 'se') {
    fdx = function (delta, target) {
      target.style.width = parseInt(target.style.width) + delta + 'px';
    }
    fdy = function (delta, target) {
      target.style.height = parseInt(target.style.height) + delta + 'px';
    }
  }
  if (key == 'sw') {
    fdx = function (delta, target) {
      target.style.width = parseInt(target.style.width) - delta + 'px';
      target.style.left = parseInt(target.style.left) + delta + 'px';
    }
    fdy = function (delta, target) {
      target.style.height = parseInt(target.style.height) + delta + 'px';
    }
  }

  return constraintHandlerBuilder(step, fdx, fdy);
}

function assignHotEdges(padding) {
  return function (evt) {
    //evt.stopPropagation();
    let target = evt.target;
    let parent = target.parentElement;
    let x = evt.offsetX;
    let y = evt.offsetY;
    let width = parseInt(target.style.width);
    let height = parseInt(target.style.height);

    //target.onmouseout = (evt) => {parent.style.cursor = 'auto'} //TODO

    if (x < padding && y < padding) {
      target.style.cursor = 'nwse-resize';
      //parent.style.cursor = 'nwse-resize';
      // handle nwse resize
      target.onmousedown = makeConstrainedResizable(12, 'nw');
      target.onmouseup = (evt) => {
        target.onmousedown = null;
        target.onmouseup = null;
      }
    }
    else if (x > width - padding && y < padding) {
      target.style.cursor = 'nesw-resize';
      //parent.style.cursor = 'nesw-resize';
      // handle nesw resize
      target.onmousedown = makeConstrainedResizable(12, 'ne');
      target.onmouseup = (evt) => {
        target.onmousedown = null;
        target.onmouseup = null;
      }
    }
    else if (x < padding && y > height - padding) {
      target.style.cursor = 'nesw-resize';
      //parent.style.cursor = 'nesw-resize';
      // handle nesw resize
      target.onmousedown = makeConstrainedResizable(12, 'sw');
      target.onmouseup = (evt) => {
        target.onmousedown = null;
        target.onmouseup = null;
      }
    }
    else if (x > width - padding && y > height - padding) {
      target.style.cursor = 'nwse-resize';
      //parent.style.cursor = 'nwse-resize';
      // handle nwse resize
      target.onmousedown = makeConstrainedResizable(12, 'se');
      target.onmouseup = (evt) => {
        target.onmousedown = null;
        target.onmouseup = null;
      }
    }

    // N, top is move
    else if (y < padding) {
      target.style.cursor = 'move';
      //parent.style.cursor = 'move';
      // handle move
      target.onmousedown = makeConstrainedDraggable(12);
    }
    else if (!evt.buttons) {
      target.style.cursor = 'auto';
      //parent.style.cursor = 'auto';
      target.onmousedown = null;
    }
  }
}

function putGridBackground(target) {
  let canvas = document.createElement('canvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  let ctx = canvas.getContext('2d');
  ctx.globalAlpha = 0.3;
  let step = 12;
  for (let x = step; x < canvas.width; x += step) {
    for (let y = step; y < canvas.height; y += step) {
      ctx.fillRect(x, y, 1, 1);
    }
  }
  target.appendChild(canvas);
}

function makeCreateNewDrag(target) {
  let step = 12;
  target.style.cursor = 'crosshair';
  //target.onmousedown = makeConstrainedCard(step);
  target.onmousedown = makeConstrainedCard;
}

function makeConstrainedCard(evt) {
  let step = 12;
  let leftoffset = evt.clientX % step;
  let topoffset = evt.clientY % step;

  let left = leftoffset > step / 2 ? evt.clientX + step - leftoffset : evt.clientX - leftoffset;
  let top = topoffset > step / 2 ? evt.clientY + step - topoffset : evt.clientY - topoffset;

  let card = makeCard({top: top, left: left, width: step * 2, height: step * 2}, evt.target.parentElement)
  card = styleCard(card);
  card = activateCard(card);
  addContextMenu(card);

  function fdx(delta, target) {
    target.style.width = parseInt(target.style.width) + delta + 'px';
  }
  function fdy(delta, target) {
    target.style.height = parseInt(target.style.height) + delta + 'px';
  }

  let dx = 0;
  let dy = 0;
  let target = card;

  document.onmousemove = function(evt) {
    dx += evt.movementX;
    dy += evt.movementY;

    //3/4 prevents problems present at 1/2
    //while ensures speedy drags are followed
    while(dx >  step * 3 / 4) { fdx(step, target); dx -= step }
    while(dx < -step * 3 / 4) { fdx(-step, target); dx += step }
    while(dy >  step * 3 / 4) { fdy(step, target); dy -= step }
    while(dy < -step * 3 / 4) { fdy(-step, target); dy += step }
  }

  document.onmouseup = function(evt) {
    target.style.cursor = 'auto';
    document.onmousemove = null;
    document.onmouseup = null;
  }
}

function activateCard(card) {
  card.addEventListener('mousemove', assignHotEdges(12))
  card.addEventListener('mousedown', function (evt) {
    evt.stopPropagation(); //TODO
  });
  return card;
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
      div.style.background = '#ffffff'

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

export {makeCard}
export {styleCard}
export {makeConstrainedDraggable}
export {assignHotEdges}
export {putGridBackground}
export {makeCreateNewDrag}
export {activateCard}
export {addContextMenu}
export {putCodeMirror}
export {putProseMirror}
