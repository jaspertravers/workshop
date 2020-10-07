import {putProseMirror} from './mirrors/mirrors.js'
import {putCodeMirror} from './mirrors/mirrors.js'

const dragNewCard = (context) => (event) => {
  if (event.which != 1) return;
  const startX = Math.floor(event.offsetX / 12 * 12);
  const startY = Math.floor(event.offsetY / 12 * 12);
  const clientX = Math.floor(event.clientX / 12 * 12);
  const clientY = Math.floor(event.clientY / 12 * 12);

  const card = context.addCard();
  card.attach({
    position: 'absolute',
    left: startX,
    top: startY,
    width: 0,
    height: 0
  })
  
  //TODO below here should be excised
  card.node.style.background = '#fff'; // debug
  card.node.style.border = '1px dashed black'; // debug


  addContextMenu(card);
  //move
  card.node.onmousedown = (event) => {
    event.stopPropagation();
    if (event.which === 3) { // rmb
      document.onmousemove = cardMove(card);
      document.onmouseup = (event) => {
        document.body.style.cursor = null;
        document.onmousemove = null;
        document.onmouseup = null;
      }
    }
  }

  //TODO above here should be excised
  document.onmousemove = (event) => {
    //TODO probably bugs between event.offset/client, can't test atm
    const dx = event.clientX - clientX;
    const dy = event.clientY - clientY;
    document.body.style.cursor = 'crosshair';
    if (dx > 1 && dy > 1) {
      move({left: clientX, top: clientY, width: dx, height: dy}, card)
    }
    else if (dx < 1 && dy > 1) {
      move({left: dx + clientX, top: clientY, width: -dx, height: dy}, card)
    }
    else if (dx > 1 && dy < 1) {
      move({left: clientX, top: dy + clientY, width: dx, height: -dy}, card)
    }
    else if (dx < 1 && dy < 1) {
      move({left: dx + clientX, top: dy + clientY, width: -dx, height: -dy}, card)
    }

  }
  document.onmouseup = (event) => {
    document.body.style.cursor = null;
    document.onmousemove = null;
    document.onmouseup = null;
  }
}

const cardMove = (card) => (event) => {
  //need to determine region then activate that move/resize
  let xp = (event.clientX - card.spec.top) / card.spec.width;
  let yp = (event.clientY - card.spec.left) / card.spec.height;
  let region;
  let lo = 0.25; // lower bound
  let hi = 0.75; // higher bound
  if (xp > lo && xp < hi && yp < lo) region = 'n';
  if (xp > hi && yp > lo && yp < hi) region = 'e';
  if (xp < lo && yp > lo && yp < hi) region = 'w';
  if (xp > lo && xp < hi && yp > hi) region = 's';
  if (xp <= lo && yp <= lo) region = 'nw';
  if (xp >= hi && yp <= lo) region = 'ne';
  if (xp <= lo && yp >= hi) region = 'sw';
  if (xp >= hi && yp >= hi) region = 'se';
  if (xp > lo && xp < hi && yp > lo && yp < hi) region = 'mid';

  const dx = event.clientX - clientX;
  const dy = event.clientY - clientY;

  if (region === 'mid') {
    document.body.style.cursor = 'move';
    move({left: dx + clientX, top: dy + clientY, width: -dx, height: -dy}, card)
  }
}

function move(moveset, card) {
  //TODO fix jump in negative directions
  for (let key in moveset) {
    let value = moveset[key];
    if (value >=0) {
      moveset[key] = Math.floor(value / 12) * 12 + (value % 12 <= 6 ? 0 : 12);
    }
    else { //value less than 0
      moveset[key] = (Math.floor(value / 12) + 1) * 12 + (value % 12 <= 6 ? 0 : 12);
    }
  }
  card.move(moveset);
}

function addContextMenu(card) {
  card.node.oncontextmenu = (event) => {
    event.preventDefault();

    const menu = document.createElement('div');
    document.body.appendChild(menu);
    menu.style.position = 'absolute';
    menu.style.left = event.clientX + 'px';
    menu.style.top = event.clientY + 'px';
    menu.style.borderTop = '1px dashed black';
    menu.style.borderLeft = '1px dashed black';
    menu.style.borderRight = '1px dashed black';

    menu.onmouseout = (evt) => { //make it so that any click anywhere else removes this. not mouseout
      if (!menu.contains(evt.relatedTarget)) {
        menu.remove();
      }
    }

    function addButton(type, func) {
      const button = document.createElement('div');
      button.innerHTML = type;
      button.style.width = '100% - 1rem';
      button.style.minHeight = '1.8rem';
      button.style.paddingLeft = '1rem';
      button.style.paddingRight = '1rem';
      button.style.borderBottom = '1px dashed black';
      button.style.display = 'flex';
      button.style.alignItems = 'center';
      button.style.cursor = 'pointer';
      button.style.background = '#fff';

      button.onmouseover = (event) => {button.style.background = '#eee'}
      button.onmouseout = (event) => {button.style.background = '#fff'}

      button.onclick = (event) => {
        card.type = type;
        menu.remove();
        func(card);
      }
      menu.appendChild(button);
    }

    if(!card.type) {
      addButton('prosemirror', setProseMirror);
      addButton('codemirror', setCodeMirror);
      addButton('remove', removeCard);
    }
    if(card.type) {
      addButton('remove', removeCard);
    }
  }
}
function removeCard(card) {
  card.parent.children = card.parent.children.filter(c => c.node != card.node);
  card.node.remove();
}
function setProseMirror(card) {
  card.node.style.background = '#fff';
  card.node.style.border = '1px solid black';
  card.view = putProseMirror(card.node, card.content);
}
function setCodeMirror(card) {
  card.node.style.background = '#fff';
  card.node.style.border = '1px solid black';
  card.view = putCodeMirror (card.node, card.content);
}

///

function initCard (card) {

}

export {dragNewCard}
export {addContextMenu}
