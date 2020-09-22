function eventSetup() {}

function handleNewCard (targetCard) {
  let target = targetCard.state.activeCard;
  let canvas = target.canvas;
  let step = 12;
  let dx = 0;
  let dy = 0;
  let newCard;

  target.canvas.onmousemove = function (evt) {
    canvas.onmousemove = readyNewCard;
  }

  function readyNewCard(evt) {
    canvas.onmousemove = null;
    canvas.onmousedown = startNewCard;
    document.body.style.cursor = 'crosshair';
  }

  function startNewCard(evt) {
    canvas.onmousedown = null;
    //make new card at cursor
    //snap to grid
    //lift or click ends new card

    dx = evt.offsetX % step;
    dy = evt.offsetY % step;

    let x = Math.floor(evt.offsetX / step) * step;
    let y = Math.floor(evt.offsetY / step) * step;
    let newSpec = {left: x, top: y, width: step, height: step}
    newCard = new Card (target, newSpec, {border: true})

    document.onmousemove = cursorMove;
    document.onmouseup = endNewCard;
  }

  function cursorMove(evt) {
    let proportion = 3 / 4;
    dx += evt.movementX;
    dy += evt.movementY;

    if (dx > step * proportion) {
      let times = Math.ceil(dx / step);
      let distance = step * times;
      newCard.move({dleft: 0, dtop: 0, dwidth: distance, dheight: 0})
      dx -= step * times;
    }
    if (dx < -step * proportion) {
      let times = Math.ceil(Math.abs(dx) / step);
      let distance = step * times;
      newCard.move({dleft: 0, dtop: 0, dwidth: -distance, dheight: 0})
      dx += step * times;
    }
    if (dy > step * proportion) {
      let times = Math.ceil(dy / step);
      let distance = step * times;
      newCard.move({dleft: 0, dtop: 0, dwidth: 0, dheight: distance})
      dy -= step * times;
    }
    if (dy < -step * proportion) {
      let times = Math.ceil(Math.abs(dy) / step);
      let distance = step * times;
      newCard.move({dleft: 0, dtop: 0, dwidth: 0, dheight: -distance})
      dy += step * times;
    }
  }

  function endNewCard(evt) {
    document.onmouseup = null;
    document.onmousemove = null;
    document.body.style.cursor = null;
    //handleNewCard(targetCard); //repeat until canceled. how to cancel?
  }
}
function handleMoveCard (targetCard) {
  let main = targetCard.state.activeCard;
  let step = 12;
  let dx = 0;
  let dy = 0;

  main.children.forEach (c => {
    c.node.style.cursor = 'move';
    c.node.onmousedown = buildMove(c);
  })

  function buildMove(card) {
    function cursorMove(evt) {
      let proportion = 3 / 4;
      dx += evt.movementX;
      dy += evt.movementY;

      if (dx > step * proportion) {
        let times = Math.ceil(dx / step);
        let distance = step * times;
        card.move({dleft: distance, dtop: 0, dwidth: 0, dheight: 0})
        dx -= step * times;
      }
      if (dx < -step * proportion) {
        let times = Math.ceil(Math.abs(dx) / step);
        let distance = step * times;
        card.move({dleft: -distance, dtop: 0, dwidth: 0, dheight: 0})
        dx += step * times;
      }
      if (dy > step * proportion) {
        let times = Math.ceil(dy / step);
        let distance = step * times;
        card.move({dleft: 0, dtop: distance, dwidth: 0, dheight: 0})
        dy -= step * times;
      }
      if (dy < -step * proportion) {
        let times = Math.ceil(Math.abs(dy) / step);
        let distance = step * times;
        card.move({dleft: 0, dtop: -distance, dwidth: 0, dheight: 0})
        dy += step * times;
      }
    }

    function repeatMoveCard(evt) {
      document.onmouseup = null;
      document.onmousemove = null;
      document.body.style.cursor = null;
      main.children.forEach (c => {
        c.node.style.cursor = null;
        c.node.onmousedown = null;
      })
      handleMoveCard (targetCard);
    }
    function endMoveCard(evt) {
      document.onmouseup = null;
      document.onmousemove = null;
      document.onkeydown = null;
      document.body.style.cursor = null;
      main.children.forEach (c => {
        c.node.style.cursor = null;
        c.node.onmousedown = null;
      })
    }

    return function startMoveCard(evt) {
      document.onmousemove = cursorMove;
      document.onmouseup = repeatMoveCard;
      document.body.style.cursor = 'move';
      document.onkeydown = function (evt) {
        if (evt.key === "Escape") {
          endMoveCard(evt);
        }
      }
    }
  }

}

export {eventSetup}
export {handleNewCard}
export {handleMoveCard}
