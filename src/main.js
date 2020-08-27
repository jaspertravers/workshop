//import * as util from './utility.js'
import {makeCard, styleCard, putCodeMirror, putProseMirror,
        putButton, putCanvas, putConsole, putLayout,
        execute, emptyprose, emptycode, makeDraggable, putContainer}
from './utility.js'

window.onload = () => {
  let main = document.createElement('main');
  document.body.appendChild(main);
  let boot = makeCard({top: 0, left: 0,
                       width: window.innerWidth, height: window.innerHeight}, main)
  let grid = document.createElement('canvas');
  grid.width = window.innerWidth;
  grid.height = window.innerHeight;
  boot.appendChild(grid);
  let gctx = grid.getContext('2d');
  gctx.globalAlpha = 0.2;
  for (let x = 12; x < grid.width; x += 12) {
    for (let y = 12; y < grid.height; y += 12) {
      gctx.fillRect(x, y, 1, 1);
    }
  }
  boot.style.border = '';
  boot.style.cursor = 'crosshair';
  /*
  let card = makeCard({top: 12, left: 12, width: 120, height: 120}, boot)
  card.style.resize = 'both';
  let card2 = makeCard({top: 12, left: 12, width: 120, height: 120}, boot)
  putCodeMirror(emptycode, card)
  putProseMirror(emptyprose, card2);
  */

  // make cards by draggin

  boot.onmousedown = function (evt) {
    const step = 12;
    boot.dataset.startX = evt.clientX;
    boot.dataset.startY = evt.clientY;

    let left = Math.floor(evt.clientX / step) * step;
    let top = Math.floor(evt.clientY / step) * step;
    let newCard = makeCard({top: top, left: left, width: 12, height: 12}, boot)
    let resizer = newCard.firstChild;
    document.onmousemove = function (evt) {
      evt.preventDefault();
      evt.stopPropagation();
      let width = parseInt(newCard.style.width);
      let height = parseInt(newCard.style.height);

      let startX = parseInt(boot.dataset.startX);
      let startY = parseInt(boot.dataset.startY);

      let dx = evt.clientX - startX;
      let dy = evt.clientY - startY;

      if (Math.abs(dx) >= step) {
        let times = Math.floor(Math.abs(dx) / step) + (dx < 0 ? 0 : 1);
        if (dx < 0) {
          startX -= step * times;
          width -= step * times; //TODO
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

      boot.dataset.startX = startX;
      boot.dataset.startY = startY;
      newCard.style.width = width + 'px';
      newCard.style.height = height + 'px';
    }
    document.onmouseup = function (evt) {
      document.onmousemove = null;
      document.onmouseup = null;


    }
  }
}
