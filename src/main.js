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

window.onload = function(event) {
  // root
  const rootspec = {left: 0, top: 0, width: window.innerWidth, height: window.innerHeight};
  const root = new Card(rootspec);
  root.parent = {node: document.body}
  root.render()
  //document.body.appendChild(root.node);
  window.root = root;

  // tabs, tools and target content area
  const margin = 12;
  const pad = 36;

  const tabsspec = {left: pad, top: margin, width: root.spec.width - pad - margin, height: 24};
  const tabs = root.newCard(tabsspec);
  tabs.render({border: 'all'});

  const toolsspec = {left: margin, top: pad, width: 24, height: root.spec.height - pad - margin};
  const tools = root.newCard(toolsspec);
  tools.render({border: 'all'});

  const contentspec = {left: pad, top: pad, width: root.spec.width - pad, height: root.spec.height - pad};
  const content = root.newCard(contentspec);
  content.render({});

  // tabs
  const boottabspec = {left: 0, top: 0, width: 100, height: 24};
  const boottab = tabs.newCard(boottabspec);
  boottab.render({border: 'right'});
  const worktabspec = {left: 100, top: 0, width: 100, height: 24};
  const worktab = tabs.newCard(worktabspec);
  worktab.render({border: 'right'});
  const viewtabspec = {left: 200, top: 0, width: 100, height: 24};
  const viewtab = tabs.newCard(viewtabspec);
  viewtab.render({border: 'right'});

  // content fill
  const bootspec = {left: 0, top: 0, width: content.spec.width, height: content.spec.height};
  const workspec = {left: 0, top: 0, width: content.spec.width, height: content.spec.height};
  const viewspec = {left: 0, top: 0, width: content.spec.width, height: content.spec.height};

  const boot = content.newCard(bootspec);
  const work = content.newCard(workspec);
  const view = content.newCard(viewspec);

  const bootchildtest = {left: 12, top: 12, width: 120, height: 120};
  const bootchild = boot.newCard(bootchildtest);

  let target;
  boottab.action = (context) => (event) => {
    if (target = content.target) target.save({visible: false});
    content.target = boot;
    boot.load({visible: true});
  }
  worktab.action = (context) => (event) => {
    if (target = content.target) target.save({visible: false});
    content.target = work;
    work.load({visible: true});
  }
  viewtab.action = (context) => (event) => {
    if (target = content.target) target.save({visible: false});
    content.target = view;
    view.load({visible: true});
  }
}
