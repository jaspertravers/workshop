import {Card} from './card.js';
import {putProseMirror} from './utility.js';
import {putCodeMirror} from './utility.js';
import {emptyprose, emptycode} from './mirrors/emptymirrors.js'


window.onload = function(event) {
  document.body.style.fontSize = '12px';

  const root = new Card();
  root.position = 'absolute';
  root.spec = {left: 0, top: 0, width: window.innerWidth, height: window.innerHeight};
  root.parent = {node: document.body}; //special cased root
  root.frame();

  styleGrid(root);
  setupBoot(root);
}
function setupBoot(root) {
  const bootContainer = root.addCard();
  bootContainer.position = 'absolute';
  bootContainer.spec = {left: root.spec.left,
                        top: root.spec.top,
                        width: root.spec.width,
                        height: root.spec.height}
  bootContainer.frame();

  const bootBrowser = bootContainer.addCard();
  bootBrowser.position = 'absolute';
  bootBrowser.spec = {left: 12,
                      top: 48,
                      width: 121,
                      height: 0}
  bootBrowser.frame();
  bootBrowser.node.style.height = '';
  bootBrowser.node.style.borderTop = '1px dashed black';
  bootBrowser.node.style.borderLeft = '1px dashed black';
  bootBrowser.node.style.borderRight = '1px dashed black';

  const mainTab = bootContainer.addCard();
  mainTab.position = 'absolute';
  mainTab.spec = {left: 144,
                  top: 12,
                  width: 121,
                  height: 24}
  mainTab.frame();
  mainTab.node.style.border = '1px dashed black';
  mainTab.node.onclick = (event) => {
    boot.main.forEach (e => {
      makeBootSet(content, bootBrowser, e.code, e.label);
    })
  }

  const cardTab = bootContainer.addCard();
  cardTab.position = 'absolute';
  cardTab.spec = {left: 276,
                  top: 12,
                  width: 121,
                  height: 24}
  cardTab.frame();
  cardTab.node.style.border = '1px dashed black';
  cardTab.node.onclick = (event) => {
    boot.Card.forEach (e => {
      makeBootSet(content, bootBrowser, e.code, e.label);
    })
  }

  const content = bootContainer.addCard();
  content.position = 'absolute';
  content.spec = {left: 144,
                  top: 48,
                  width: window.innerWidth - 156 + 1} //no height
  content.frame();
  //content.node.style.display = 'flex';
  //content.node.style.flexDirection = 'column';
  content.node.style.maxHeight = window.innerHeight - 60 + 'px';
  content.node.style.overflow = 'auto';

  function getString(func) {
    const regex = /(^    )/gm; //cleans extra spaces added by toString()
    const string = func.toString().replace(regex, '');
    return string;
  }

  const onloadStr = "window.onload = " + getString(window.onload);
  const styleGridStr = getString(styleGrid);
  const setupBootStr = getString(setupBoot);
  const makeBootSetStr = getString(makeBootSet);

  const boot = {main: [], Card: []};
  boot.main.push({code: onloadStr, prose: '', label: 'onload'})
  boot.main.push({code: styleGridStr, prose: '', label: 'style grid'})
  boot.main.push({code: setupBootStr, prose: '', label: 'setup boot'})
  boot.main.push({code: makeBootSetStr, prose: '', label: 'make set'})

  boot.main.forEach (e => {
    makeBootSet(content, bootBrowser, e.code, e.label);
  })
}
function styleGrid(root) {
  //grid
  console.log(root);
  let canvas = document.createElement('canvas');
  root.node.appendChild(canvas);
  canvas.width = root.spec.width;
  canvas.height = root.spec.height
  let ctx = canvas.getContext('2d');

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#282828';
  ctx.globalAlpha = 1;

  const step = 12;
  const margin = 2;

  function distort() {
    const damper = 2; //2 looks best
    return Math.random() / damper - (0.5 / damper);
  }

  //ctx.beginPath();
  for (let x = step; x < canvas.width; x += step) {
    for (let y = step; y < canvas.height; y += step) {
      for (let iter = 0; iter < step; iter+=3) {
        if (iter === 0) {
          ctx.globalAlpha = 0.3;
        }
        else {
          ctx.globalAlpha = 0.1;
        }
        if (x + step <= canvas.width) {
          ctx.fillRect(x + iter + distort(), y + distort(), 1, 1);
        }
        if (y + step <= canvas.height) {
          ctx.fillRect(x + distort(), y + iter + distort(), 1, 1);
        }
      }
    }
  }
}
function makeBootSet(content, browser, sourcecode, label) {
  const pair = content.addCard();
  pair.frame();
  pair.node.style.display = 'flex';
  pair.node.style.marginBottom = '12px';
  pair.node.style.minHeight = '24px';

  const cm = pair.addCard();
  cm.frame();
  cm.node.style.width = '721px';
  cm.node.style.border = '1px solid black';
  cm.content = sourcecode;
  cm.makeCodeMirror()
  const pm = pair.addCard();
  pm.content = JSON.stringify({type:"doc",
    content:[{type:"paragraph", content:[]}]})
  pm.frame();
  pm.node.style.width = '721px';
  pm.node.style.marginLeft = '11px';
  pm.node.style.border = '1px solid black';
  pm.makeProseMirror()

  //toc
  const tab = browser.addCard();
  tab.frame();
  tab.node.style.background = '#fff';
  tab.node.style.height = '24px';
  tab.node.style.borderBottom = '1px dashed black';
  tab.node.style.display = 'flex';
  tab.node.style.justifyContent = 'center';
  tab.node.style.alignItems = 'center';
  tab.node.innerHTML = label;

  tab.node.onclick = (event) => pair.node.scrollIntoView();

  tab.node.onmouseenter = (event) => tab.node.style.background = '#eee';
  tab.node.onmouseleave = (event) => tab.node.style.background = '#fff';

  return {pair, cm, pm, tab}
}

/*
window.onload = function(event) {
  document.body.style.fontSize = '12px';

  let debug = true; //DEBUG

  if (window.localStorage.state && !debug) {
    console.info('local storage read')
    window.root = Card.fromStorage();
    window.Card = Card; //DEBUG
  }
  else {
    // root
    console.info('no local storage')
    const root = new Card({left: 0, top: 0, width: window.innerWidth, height: window.innerHeight});
    root.parent = {node: document.body}; //special cased root
    root.generate();

    //ctx.fill();

    window.root = root; //DEBUG
    window.Card = Card; //DEBUG

    const container = root.addCard({left: root.spec.left,
                                    top: root.spec.top,
                                    width: root.spec.width,
                                    height: root.spec.height},
                                   'container');

    const pad = 12;
    const tabs = container.addCard({left: 48,
                                    top: pad,
                                    width: container.spec.width - 60,
                                    height: 24},
                                   'container.tabs');
    let offset = 0;
    let tabLabels = ['Boot', 'Viewport', 'Workshop', 'Reader'];
    tabLabels.forEach (key => {
      let width = 100;
      let name = key;
      let tab = tabs.addCard({left:offset,
                              top: 0,
                              width: width,
                              height: tabs.spec.height},
                             'tabs.tab',
                             name);
      offset += width + 1; //for border
      let space = container.addCard({left: 36,
                                     top: tabs.spec.height + pad,
                                     width: container.spec.width - 36,
                                     height: container.spec.height - tabs.spec.height - pad},
                                    'container.space',
                                    name,
                                    (name === tabLabels[0])); //sets the open tab to Boot

      const codeEditor = space.addCard({left: 12,
                                        top: 12,
                                        width: 620,
                                        height: 800},
                                       'codemirror',
                                       `//${name}`,
                                       (name === tabLabels[0]));

      const execButton = codeEditor.addCard({left: codeEditor.spec.width - 100,
                                             top: codeEditor.spec.height + 12,
                                             width: 100,
                                             height: 24},
                                            'executeButton',
                                            'Execute',
                                            (name === tabLabels[0]));
    })
    container.content = tabLabels[0]; //sets the open tab to Boot

    const tools = container.addCard({left: pad,
                                     top: 48,
                                     width: 24,
                                     height: container.spec.height - 60},
                                    'container.tools');
    let toolOffset = 0;
    let toolLabels = ['New', 'Assign', 'Move', 'Resize&Move', 'Clone'];

    toolLabels.forEach(key => {
      let height = 24;
      let name = key;

      let icon = tools.addCard({left: 0,
                                top: toolOffset,
                                width: 24,
                                height: 24},
                               'tools.icon',
                               name);
      toolOffset += height + 1; //for border
    })
  }

  window.onbeforeunload = function (event) {
    if (root) root.toStorage();
  }

  window.reset = function() { //DEBUG
    window.onbeforeunload = null;
    window.localStorage.clear();
  }
}
*/
