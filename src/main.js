import {Card} from './card.js'
import {initContainer} from './utility.js'
import {initCard} from './utility.js'
import {cardTypes} from './utility.js'
import {styleGrid} from './styles.js'
import {setRelate} from './relate.js'

window.onload = onLoad;

function onLoad(event) {
  const root = buildRoot();
}

function buildRoot() {
  //document.body.style.fontSize = '12px';
  document.body.style.overflow = 'hidden';

  window.cardTypes = cardTypes;
  cardTypes.setRelate = setRelate;
  cardTypes.setRelate.label = 'relate';
  cardTypes.setRelate.targetType = 'empty';
  cardTypes.setRelate.setType = 'relate';

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

  initContainer(root);

  return root;
}
