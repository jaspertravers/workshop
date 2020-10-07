function setupEvent(event, space, content) {
  if (content === 'New') {
    let target = space;
    target.node.onmouseover = (event) => {
      event.stopPropagation();
      event.preventDefault();
      document.body.style.cursor = 'crosshair';
      document.body.onmousedown = (event) => {
        event.stopPropagation();
        event.preventDefault();
        let card = space.addCard({left: event.offsetX,
                                  top: event.offsetY,
                                  width: 0,
                                  height: 0},
                                 'empty');
        document.body.onmousemove = (event) => {
          event.stopPropagation();
          event.preventDefault();
          card.move({dleft: 0, dtop: 0, dwidth: event.movementX, dheight: event.movementY});
        }
        document.body.onmouseup = (event) => {
          event.stopPropagation();
          event.preventDefault();
          stopNew();
        }
      }
    }
    document.body.addEventListener('keydown', escEnd)
    function escEnd (event) {
      if (event.key === 'Escape') {
        endNew();
      }
    }
    function stopNew() {
      document.body.onmousemove = null;
      document.body.onmouseup = null;
    }
    function endNew() {
      target.node.onmouseover = null;
      document.body.style.cursor = null;
      document.body.onmousedown = null;
      document.body.onmousemove = null;
      document.body.onmouseup = null;
      document.body.removeEventListener('keydown', escEnd);
    }
  }
  if (content === 'Move') {
    let targets = space.allChildren();
    console.log(targets);

    targets.forEach(card => {
      let storeonclick = card.node.onclick;

      card.node.onmouseover = (event) => {
        event.stopPropagation();
        event.preventDefault();
        card.node.onclick = null;
        document.body.style.cursor = 'move';

        document.body.onmousedown = (event) => {
          event.stopPropagation();
          event.preventDefault();
          card.node.onmouseout = null;

          document.body.onmousemove = (event) => {
            event.stopPropagation();
            event.preventDefault();
            card.move({dleft: event.movementX, dtop: event.movementY, dwidth: 0, dheight: 0});
          }

          document.body.onmouseup = (event) => {
            event.stopPropagation();
            event.preventDefault();
            card.node.onmouseout = onMouseOut;
            card.node.onclick = storeonclick;
            stopMove();
          }
        }
      }
      card.node.onmouseout = onMouseOut;
      function onMouseOut (event) {
        if (event.relatedTarget.parentNode == this || event.relatedTarget == this) {
          return;
        }
        document.body.style.cursor = null;
        card.node.onclick = storeonclick;
        document.body.onmousedown = null;
      }
    }) //end targets foreach

    document.body.addEventListener('keydown', escEnd)
    function escEnd (event) {
      if (event.key === 'Escape') {
        endMove();
      }
    }
    function stopMove() {
      document.body.style.cursor = null;
      document.body.onmousedown = null;
      document.body.onmousemove = null;
      document.body.onmouseup = null;
    }
    function endMove() {
      document.body.style.cursor = null;
      document.body.onmousedown = null;
      document.body.onmousemove = null;
      document.body.onmouseup = null;
      targets.forEach(card => {
        card.node.onmouseover = null;
        card.node.onmouseout = null;
      })
      document.body.removeEventListener('keydown', escEnd);
    }
  }
  if (content === 'Resize&Move') {
    let targets = space.allChildren();
    console.log(targets);

    targets.forEach(card => {
      let storeonclick = card.node.onclick;
      let storecursor = card.node.style.cursor;

      card.node.onmouseover = onMouseOver;
      function onMouseOver(event) {
        event.stopPropagation();
        event.preventDefault();
        card.node.onclick = null;
        card.node.style.cursor = null;

        card.node.onmousemove = onMouseMove;
        function onMouseMove (event) {
          event.stopPropagation();
          event.preventDefault();
          let region = whichRegion(event, card);
          if (region === 'NW') {document.body.style.cursor = 'nwse-resize';}
          else if (region === 'NE') {document.body.style.cursor = 'nesw-resize';}
          else if (region === 'SW') {document.body.style.cursor = 'nwse-resize';}
          else if (region === 'SE') {document.body.style.cursor = 'nesw-resize';}
          else if (region === 'N') {document.body.style.cursor = 'n-resize';}
          else if (region === 'E') {document.body.style.cursor = 'e-resize';}
          else if (region === 'S') {document.body.style.cursor = 's-resize';}
          else if (region === 'W') {document.body.style.cursor = 'w-resize';}
          else {document.body.style.cursor = 'move';}
        }

        card.node.onmouseout = onMouseOut;
        function onMouseOut (event) {
          if (event.relatedTarget.parentNode == this || event.relatedTarget == this) {
            return;
          }
          document.body.style.cursor = null;
          card.node.onclick = storeonclick;
          card.node.style.cursor = storecursor;
          document.body.onmousedown = null;
          card.node.onmousemove = null;
          card.node.onmouseout = null;
          //TODO mouseout is still buggy. It's still not happening for nested cards like execbutton and codemirror
        }

        document.body.onmousedown = (event) => {
          event.stopPropagation();
          event.preventDefault();
          card.node.onmouseover = null;
          card.node.onmouseout = null;
          card.node.onmousemove = null;
          //TODO determine region

          document.body.onmousemove = (event) => {
            event.stopPropagation();
            event.preventDefault();
            //TODO act on region
            card.move({dleft: event.movementX, dtop: event.movementY, dwidth: 0, dheight: 0});
          }

          document.body.onmouseup = (event) => {
            event.stopPropagation();
            event.preventDefault();
            card.node.onmouseover = onMouseOver;
            card.node.onmouseout = onMouseOut;
            card.node.onclick = storeonclick;
            card.node.style.cursor = storecursor;
            stopResize();
          }
        }
      }
      function whichRegion(event, card) {
        let x = event.offsetX;
        let y = event.offsetY;
        let w = card.spec.width;
        let h = card.spec.height;
        if (x < w * 1 / 4 && y < h * 1 / 4) return 'NW';
        if (x > w * 3 / 4 && y < h * 1 / 4) return 'NE';
        if (x > w * 3 / 4 && y > h * 3 / 4) return 'SW';
        if (x < w * 1 / 4 && y > h * 3 / 4) return 'SE';
        if (x < w * 1 / 4) return 'W';
        if (x > w * 3 / 4) return 'E';
        if (y < h * 1 / 4) return 'N';
        if (y > h * 3 / 4) return 'S';
      }
    }) //end targets foreach

    document.body.addEventListener('keydown', escEnd)
    function escEnd (event) {
      if (event.key === 'Escape') {
        endResize();
      }
    }
    function stopResize() {
      document.body.style.cursor = null;
      document.body.onmousedown = null;
      document.body.onmousemove = null;
      document.body.onmouseup = null;
    }
    function endResize() {
      document.body.style.cursor = null;
      document.body.onmousedown = null;
      document.body.onmousemove = null;
      document.body.onmouseup = null;
      targets.forEach(card => {
        card.node.onmouseover = null;
        card.node.onmouseout = null;
      })
      document.body.removeEventListener('keydown', escEnd);
    }
  }
  if (content === 'Assign') {}
  if (content === 'Clone') {}
}

export {setupEvent}
