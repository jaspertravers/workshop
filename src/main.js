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
  let card = makeCard({top: 12, left: 12, width: 120, height: 120}, boot)
  card.style.resize = 'both';
  let card2 = makeCard({top: 12, left: 12, width: 120, height: 120}, boot)
  putCodeMirror(emptycode, card)
  putProseMirror(emptyprose, card2);



}
