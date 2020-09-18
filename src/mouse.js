import {putComponent} from './utility.js'
import {getCardRuntime} from './utility.js'
import {getFirstCardFromEvent} from './utility.js'
import {getAllChildren} from './utility.js'
import {makeCard} from './utility.js'
import {styleCard} from './utility.js'
import {saveCard} from './utility.js'
import {saveState} from './utility.js'

function activateCard(card) {
  //card.addEventListener('mousedown', activate, {capture: true});
  //card.addEventListener('contextmenu', activate, {capture: false});

  card.onclick = selection;
  card.oncontextmenu = activate;

  function selection(evt) {
    const target = getFirstCardFromEvent(evt);
    const runtime = getCardRuntime(target);
    if (runtime.type === 'codemirror') {
      window.selected = runtime;
    }
    else if (runtime.type === 'canvas') {
      window.canvas = runtime;
    }
    window.target = runtime;
  }

  function activate(evt) {
    evt.preventDefault();
    evt.stopPropagation();

    const target = getFirstCardFromEvent(evt);
    const parent = target.parentElement; //this is only true by convention, not correctness
    const runtime = getCardRuntime(target);

    const top = parseInt(target.style.top);
    const left = parseInt(target.style.left);
    const width = parseInt(target.style.width);
    const height = parseInt(target.style.height);
    const clientx = evt.clientX;
    const clienty = evt.clientY;

    const region = clickRegion(evt);

    // closure for constrainedManipulation
    let dx = 0;
    let dy = 0;
    let step = 12;

    // for container move
    const children = getAllChildren(runtime);

    //if click, open context menu
    //if mousemove
    //  on outer eights then resize
    //  middle then move

    document.onmouseup = onMouseUp;
    document.onmousemove = onMouseMove;

    // save state for undo and reload

    function onMouseUp (evt) {
      document.onmouseup = null;
      document.onmousemove = null;
      target.style.cursor = '';
      target.parentElement.style.cursor = '';
      //was a click
      if (evt.clientX === clientx && evt.clientY === clienty) {
        addContextMenu(target, evt);
      }
    }
    function onMouseMove (evt) {
      if(runtime.type === 'container' && runtime.move != 'move') {
        target.style.cursor = 'move';
        target.parentElement.style.cursor = 'move';

        constrainedMoveAll(evt, children); //pan

        return; //no other conditions; maybe else if the rest
      }
      if(region == 'middle') {
        target.style.cursor = 'move';
        target.parentElement.style.cursor = 'move';
        constrainedManipulation({top: '+', left: '+'}, evt, target);
      }
      if (region == 'north') {
        target.style.cursor = 'n-resize';
        target.parentElement.style.cursor = 'n-resize';
        constrainedManipulation({top: '+', height: '-'}, evt, target);
      }
      if (region == 'northeast') {
        target.style.cursor = 'nesw-resize';
        target.parentElement.style.cursor = 'nesw-resize';
        constrainedManipulation({top: '+', height: '-', width: '+'}, evt, target);
      }
      if (region == 'east') {
        target.style.cursor = 'e-resize';
        target.parentElement.style.cursor = 'e-resize';
        constrainedManipulation({width: '+'}, evt, target);
      }
      if (region == 'southeast') {
        target.style.cursor = 'nwse-resize';
        target.parentElement.style.cursor = 'nwse-resize';
        constrainedManipulation({height: '+', width: '+'}, evt, target);
      }
      if (region == 'south') {
        target.style.cursor = 's-resize';
        target.parentElement.style.cursor = 's-resize';
        constrainedManipulation({height: '+'}, evt, target);
      }
      if (region == 'southwest') {
        target.style.cursor = 'nesw-resize';
        target.parentElement.style.cursor = 'nesw-resize';
        constrainedManipulation({left: '+', height: '+', width: '-'}, evt, target);
      }
      if (region == 'west') {
        target.style.cursor = 'w-resize';
        target.parentElement.style.cursor = 'w-resize';
        constrainedManipulation({left: '+', width: '-'}, evt, target);
      }
      if (region == 'northwest') {
        target.style.cursor = 'nwse-resize';
        target.parentElement.style.cursor = 'nwse-resize';
        constrainedManipulation({left: '+', top: '+', width: '-', height: '-'}, evt, target);
      }
      // resizing a container; passed through first container if
      if(runtime.type === 'container') {
        let nodechildren = runtime.node.children;
        for (let index = 0; index < nodechildren.length; index++) {
          let node = nodechildren[index];
          if (node.tagName === 'CANVAS') {
            node.remove();
            putComponent('container', target)
          }
        }
      }
    }

    function constrainedMoveAll(evt, targets) {
      dx += evt.movementX;
      dy += evt.movementY;

      function left(step) {
        targets.forEach (card => {
          card.node.style.left = parseInt(card.node.style.left) + step + 'px';
        })
      }
      function top(step) {
        targets.forEach (card => {
          card.node.style.top = parseInt(card.node.style.top) + step + 'px';
        })
      }

      while(dx >  step * 3 / 4) { left(step);
                                  dx -= step;
                                }

      while(dx < -step * 3 / 4) { left(-step);
                                  dx += step;
                                }

      while(dy >  step * 3 / 4) { top(step);
                                  dy -= step;
                                }

      while(dy < -step * 3 / 4) { top(-step);
                                  dy += step;
                                }
    }

    function constrainedManipulation(opts, evt, target) {
      dx += evt.movementX;
      dy += evt.movementY;
      let fdx = () => {}; //noop
      let fdy = () => {}; //noop
      let funcs = {top: () => {}, left: () => {}, width: () => {}, height: () => {}};

      let keys = Object.keys(opts);

      keys.forEach(key => {
        if (opts[key] === '+') {
          funcs[key] = function (step) {
            target.style[key] = parseInt(target.style[key]) + step + 'px'
          }
        }
        if (opts[key] === '-') {
          funcs[key] = function (step) {
            target.style[key] = parseInt(target.style[key]) - step + 'px'
          }
        }
      });

      let eject;
      if (parseInt(target.style.width) < step * 1) {
        target.style.width = parseInt(target.style.width) + step + 'px';
        eject = true;
      }
      if (parseInt(target.style.height) < step * 1) {
        target.style.height = parseInt(target.style.height) + step + 'px';
        eject = true;
      }
      if (eject) {
        return;
      }

      while(dx >  step * 3 / 4) { funcs.left(step);
                                  funcs.width(step);
                                  dx -= step;
                                }

      while(dx < -step * 3 / 4) { funcs.left(-step);
                                  funcs.width(-step);
                                  dx += step;
                                }

      while(dy >  step * 3 / 4) { funcs.top(step);
                                  funcs.height(step);
                                  dy -= step;
                                }

      while(dy < -step * 3 / 4) { funcs.top(-step);
                                  funcs.height(-step);
                                  dy += step;
                                }
    }

    function clickRegion(evt) {
      //TODO - parent left recursively, currently hardcoded to max 2 depth
      const x = evt.clientX - left - parseInt(parent.style.left);
      const y = evt.clientY - top - parseInt(parent.style.top);

      // for interactive resizer
      let xsm = window.xsm || (2 / 8);
      let xlg = window.xlg || (6 / 8);
      let ysm = window.ysm || (2 / 8);
      let ylg = window.ylg || (6 / 8);

      xsm *= width;
      xlg *= width;
      ysm *= height;
      ylg *= height;

      if (x > xsm &&
          x < xlg &&
          y > ysm &&
          y < ylg) return 'middle';
      else if (x > xsm &&
               x < xlg &&
               y <= ysm) return 'north';
      else if (x >= xlg &&
               y <= ysm) return 'northeast';
      else if (x >= xlg &&
               y > ysm &&
               y < ylg) return 'east';
      else if (x >= xlg &&
               y >= ylg) return 'southeast';
      else if (x > xsm &&
               x < xlg &&
               y >= ylg) return 'south';
      else if (x <= xsm &&
               y >= ylg) return 'southwest';
      else if (x <= xsm &&
               y > ysm &&
               y < ylg) return 'west';
      else if (x <= xsm &&
               y <= ysm) return 'northwest';
    }

    function addContextMenu(card, evt) {
      let menu = document.createElement('div');
      menu.style.position = 'absolute';
      menu.style.left = evt.clientX + 'px';
      menu.style.top = evt.clientY + 'px';
      menu.style.borderLeft = "1px dashed black";
      menu.style.borderTop = "1px dashed black";
      menu.style.borderRight = "1px dashed black";

      menu.onmouseout = (evt) => {
        if (!menu.contains(evt.relatedTarget)) {
          menu.remove();
        }
      }

      let emptybuttons = ['codemirror', 'prosemirror', 'canvas', 'container', 'remove'];
      let contentbuttons = ['clone', 'remove'];
      let containerbuttons = ['new', 'move', 'remove'];

      document.body.appendChild(menu);

      if (runtime.type === 'container') {
        containerbuttons.forEach (btn => buildButtons(btn))
      }
      if (runtime.type === 'empty') {
        emptybuttons.forEach (btn => buildButtons(btn))
      }
      if (runtime.type === 'prosemirror' || runtime.type === 'codemirror' || runtime.type === 'canvas') {
        contentbuttons.forEach (btn => buildButtons(btn))
      }

      function buildButtons(btn) {
        let div;
        div = document.createElement('div');
        div.style.width = '100% - 1rem';
        div.style.height = '1.8rem';
        div.style.paddingLeft = '1rem';
        div.style.paddingRight = '1rem';
        div.style.background = '#ffffff';

        div.style.display = 'flex';
        div.style.alignItems = 'center';

        div.style.borderBottom = '1px dashed black';
        div.innerHTML = btn;
        div.onmouseover = (evt) => {div.style.background = '#eeeeee'}
        div.onmouseout = (evt) => {div.style.background = '#ffffff'}
        div.onclick = (evt) =>  {
          let type = evt.target.innerHTML;
          if (type === 'codemirror' || type === 'prosemirror' || type === 'canvas' || type === 'container') {
            putComponent(type, target);
          }
          if (type == 'remove') {
            runtime.removed = true;
            target.remove();
          }
          if (type == 'clone') {
            let card = styleCard(makeCard({top: top + 12, left: left + 12, width, height}, parent));
            let newruntime = saveCard(card, parent);
            if (runtime.type) {
              newruntime.view = putComponent(runtime.type, card, runtime.content)
            }
          }
          if (type == 'new') {
            newCard();
            target.style.cursor = 'crosshair';
          }
          if (type == 'move') {
            if (runtime.move === 'move') {
              runtime.move = undefined;
            }
            else if(runtime.move === undefined) {
              runtime.move = 'move';
            }
          }
          menu.remove();
        }
        menu.appendChild(div);
      }
      function newCard() {
        let card;
        document.onmousedown = function (evt) {
          //TODO profile this method
          let x = evt.clientX - parseInt(target.style.left);
          let y = evt.clientY - parseInt(target.style.top);
          let xround = Math.round(x / 12) * 12;
          let yround = Math.round(y / 12) * 12;
          card = styleCard(makeCard({top: yround, left: xround, width: 12, height: 12}, target));
          document.onmousemove = function (evt) {
            evt.preventDefault();
            target.style.cursor = 'nwse-resize';
            target.parentElement.style.cursor = 'nwse-resize';
            constrainedManipulation({height: '+', width: '+'}, evt, card);
          }
        }
        document.onmouseup = function (evt) {
          target.style.cursor = '';
          target.parentElement.style.cursor = '';
          document.onmousedown = null;
          document.onmousemove = null;
          document.onmouseup = null;

          saveCard(card, target);
        }
      }
    }
  }
}

export {activateCard}
