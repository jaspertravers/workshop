import {Card} from './card.js';
import {putProseMirror} from './utility.js';
import {putCodeMirror} from './utility.js';

/*
window.onload = function(event) {
  const rootspec = {left: 0, top: 0, width: window.innerWidth, height: window.innerHeight};
  const root = new Card(rootspec);
  root.build();
  document.body.appendChild(root.node);
  window.root = root;
}
*/

onload = function(event) {
  // root
  const root = new Card({left: 0, top: 0, width: window.innerWidth, height: window.innerHeight});
  root.parent = {node: document.body} //special cased root
  root.render()
  window.root = root; //DEBUG

  // tabs, tools and target content area
  const margin = 12;
  const pad = 48;

  const tabs = root.addCard({left: pad, top: margin, width: root.spec.width - pad - margin, height: 24});
  tabs.render({border: 'all'});

  const tools = root.addCard({left: margin, top: pad, width: 24, height: root.spec.height - pad - margin});
  tools.render({border: 'all'});

  const content = root.addCard({left: pad, top: pad, width: root.spec.width - pad, height: root.spec.height - pad});
  content.render();

  makeController(tabs, content, ['boot', 'viewport', 'workspace']);
}
window.onload = function(event) {
  // root
  const root = new Card({left: 0, top: 0, width: window.innerWidth, height: window.innerHeight});
  root.parent = {node: document.body} //special cased root
  root.type = {empty: {}} //special cased root
  root.generate()
  window.root = root; //DEBUG

  // tabs, tools and target content area
  const margin = 12;
  const pad = 48;

  const contentspec = {left: pad, top: pad, width: root.spec.width - pad, height: root.spec.height - pad};
  const contenttype = {empty: {}};
  const content = root.addCard(contentspec, contenttype);
  content.generate();

  const tabspec = {left: pad, top: margin, width: root.spec.width - pad - margin, height: 24};
  const tabtype = {controller: {target: content, keys: ['boot', 'viewport', 'workshop']}};
  const tabs = root.addCard(tabspec, tabtype);
  tabs.generate();

  const toolspec = {left: margin, top: pad, width: 24, height: root.spec.height - pad - margin};
  const tooltype = {empty: {border: 'all'}};
  const tools = root.addCard(toolspec, tooltype);
  tools.generate();

  //makeController(tabs, content, ['boot', 'viewport', 'workspace']);
}
