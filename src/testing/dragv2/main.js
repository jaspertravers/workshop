import {
  makeCard,
  styleCard,
  makeConstrainedDraggable,
  assignHotEdges,
  putGridBackground,
  makeCreateNewDrag,
  activateCard,
  addContextMenu,
  putCodeMirror,
  putProseMirror,
  //putButton,
  //putCanvas,
  //putConsole,
  //putLayout,
  //execute,
  //emptyprose,
  //emptycode,
  //putContainer
} from './utility.js'

window.onload = function(evt) {
  const main = document.createElement('main');
  document.body.appendChild(main);

  let boot = makeCard({top: 0, left: 0, width: window.innerWidth, height: window.innerHeight}, main);
  putGridBackground(boot);
  makeCreateNewDrag(boot);

  let card = styleCard(makeCard({top: 12, left: 12, width: 120, height: 120}, boot));
  card = activateCard(card);
  addContextMenu(card);

  //card.addEventListener('mousemove', assignHotEdges(12))
}

