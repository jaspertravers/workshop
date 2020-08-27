//import * as util from './utility.js'
import {makeCard, styleCard, putCodeMirror, putProseMirror, putButton, putCanvas, putConsole, putLayout, execute, emptyprose}
from './utility.js'

window.onload = () => {
  let main = document.createElement('main');
  document.body.appendChild(main);
  let card = makeCard({top: 12, left: 12, width: 120, height: 120}, main)
  let card2 = makeCard({top: 12, left: 12, width: 120, height: 120}, main)
  putCodeMirror("// cm",card)
  putProseMirror(emptyprose, card2);
  makeDraggable(card);
  makeDraggable(card2);
}

function makeDraggable(node, step=12) {
  //const step = 12; //constrain to 12pt grid
  node.onmousedown = function (evt) {
    node.dataset.startX = parseInt(evt.clientX);
    node.dataset.startY = parseInt(evt.clientY);

    document.onmousemove = function (evt) {
      let startX = parseInt(node.dataset.startX);
      let startY = parseInt(node.dataset.startY);
      let offsetX = evt.clientX - startX;
      let offsetY = evt.clientY - startY;

      let top = parseInt(node.style.top);
      let left = parseInt(node.style.left);

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

      console.log(top, left, startY, startX)
      node.dataset.startX = startX;
      node.dataset.startY = startY;
      node.style.top = top + 'px';
      node.style.left = left + 'px';
    }
    document.onmouseup = function (evt) {
      document.onmousemove = null;
      document.onmouseup = null;
    }
  }
}
