import {Card} from './card.js';
import {putProseMirror} from './utility.js';
import {putCodeMirror} from './utility.js';
import {emptyprose, emptycode} from './mirrors/emptymirrors.js'


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

    //grid
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
          if (x + step < canvas.width) {
            ctx.fillRect(x + iter + distort(), y + distort(), 1, 1);
          }
          if (y + step < canvas.height) {
            ctx.fillRect(x + distort(), y + iter + distort(), 1, 1);
          }
        }
      }
    }
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



    //const codeEditorspec = {left: 12, top: 12, width: 620, height: 800};
    //const codeEditortype = {codemirror: {content: emptycode}};
    //const codeEditor = root.addCard(codeEditorspec, codeEditortype);
    //codeEditor.generate();

    //const execButtonspec = {left: codeEditorspec.width - 100, top: codeEditorspec.height + 12, width: 100, height: 36}
    //const execButtontype = {executeButton: {content: {}}};
    //const execButton = codeEditor.addCard(execButtonspec, execButtontype);
    //execButton.generate();

    //const proseEditorspec = {left: 644, top: 12, width: 580, height: 800};
    //const proseEditortype = {prosemirror: {content: emptyprose}};
    //const proseEditor = root.addCard(proseEditorspec, proseEditortype);
    //proseEditor.generate();
  }
}

window.onbeforeunload = function (event) {
  if (root) root.toStorage();
}

window.reset = function() { //DEBUG
  window.onbeforeunload = null;
  window.localStorage.clear();
}
