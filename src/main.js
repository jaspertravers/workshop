import {Card} from './card.js'
import {dragNewCard} from './utility.js'
import {styleGrid} from './styles.js'

window.onload = onLoad;

function onLoad(event) {
  const root = buildRoot();
}

function buildRoot() {
  //document.body.style.fontSize = '12px';
  document.body.style.overflow = 'hidden';
  window.root = new Card();
  root.parent = {node: document.body}; // forces data structure integrity
  root.attach({
    position: 'absolute',
    left: 0,
    top: 0,
    width: window.innerWidth,
    height: window.innerHeight
  });
  root.type = 'container';
  styleGrid(root);

  root.node.onmousedown = dragNewCard(root);

  return root;
}

