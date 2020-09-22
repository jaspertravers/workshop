import {
  makeCard,
  styleCard,
  putComponent,
  viewState,
  putCodeMirror,
  putProseMirror,
  getCardRuntime,
  saveState,
} from './utility.js'


window.onload = function(evt) {
  let state = {cards: []};
  window.state = state;

  let boot = {spec: {top: 0, left: 0, width: window.innerWidth, height: window.innerHeight},
                    children: [],
                    node: null,
                    type: 'container',
                    view: null,
                    content: null,
                    name: 'boot'
             };
  state.cards.push(boot);
  /*
  state.cards[0].children.push({spec: {top: 12, left: 12, width: 120, height: 120},
                    children: [],
                    node: null,
                    type: 'codemirror',
                    view: null
                   })
  state.cards[0].children.push({spec: {top: 12, left: 144, width: 120, height: 120},
                    children: [],
                    node: null,
                    type: 'prosemirror',
                    view: null
                   })
  */

  //might want more saves
  document.addEventListener('mouseup', saveState);
  document.body.style.overflow = 'hidden';

  let json;
  if (json = window.localStorage.state) {
    window.state.cards = viewState(JSON.parse(json), document.body, {active: true});
  }
  else {
    viewState(state.cards, document.body, {active: true});
  }

  //let boot = makeCard({top: 0, left: 0, width: window.innerWidth, height: window.innerHeight}, document.body);
  //let card = styleCard(makeCard({top: 12, left: 12, width: 120, height: 120}, boot));

  window.getCardRuntime = getCardRuntime;
  window.selected = null;
  window.canvas = null;

  window.onkeydown = onKeyDown;
  function onKeyDown(evt) {
    if (evt.ctrlKey && evt.key == "Enter") {
      //saveSpace(space);
      let task = window.selected.view.state.doc.toString();
      run(task);
      //run(cmview.state.doc.toString());
    }
  }

  // should be in a card
  function run(task) {
    let runner = stopify.stopifyLocally(task, {newMethod: "direct"});
    runner.g = window;
    runner.run(result => result); //ignores stopify value
  }
}
