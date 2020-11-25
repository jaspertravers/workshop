import { putProseMirror } from "./mirrors/mirrors.js";
import { putCodeMirror } from "./mirrors/mirrors.js";
import { styleEmpty } from "./styles.js";
import { putInspector } from "./observable/inspector.js";

let cardTypes = new Map();

function removeCard(card) {
  window.state.delete(card.id);
  card.parent.children = card.parent.children.filter(
    (c) => c.node != card.node
  );
  card.node.remove();
}
function setProseMirror(card) {
  card.node.style.background = "#fff";
  card.node.style.border = "1px solid black";
  card.view = putProseMirror(card.node, card.content);
  card.node.addEventListener("keyup", savepm);
  function savepm(event) {
    card.content = card.view.state.doc.toJSON();
  }
}
function setCodeMirror(card) {
  card.node.style.background = "#fff";
  card.node.style.border = "1px solid black";
  card.view = putCodeMirror(card.node, card.content);
  card.node.addEventListener("keyup", savecm);
  function savecm(event) {
    card.content = card.view.state.doc.toString();
  }
}
function setInspector(card) {
  card.view = putInspector(card.node);
  card.node.style.background = "#fff";
  card.node.style.border = "1px solid black";
}
function runCodeMirror(card) {
  let task = card.view.state.doc.toString();
  new Function(task)();
}
function setCustom(card) {
  card.node.style.background = "#fff";
  card.node.style.border = "1px solid black";
}

cardTypes.set("prosemirror", {
  f: setProseMirror,
  fromType: "empty",
  toType: "prosemirror",
});
cardTypes.set("codemirror", {
  f: setCodeMirror,
  fromType: "empty",
  toType: "codemirror",
});
cardTypes.set("inspector", {
  f: setInspector,
  fromType: "empty",
  toType: "inspector",
});
cardTypes.set("run", { f: runCodeMirror, fromType: "codemirror" });
cardTypes.set("custom", { f: setCustom, fromType: "empty", toType: "custom" });
cardTypes.set("remove", { f: removeCard, fromType: "all" });

function initContainer(card) {
  //root
  //effects:
  //card onmousedown set

  let newCard = null;
  let dx = 0; //minimum 12x12
  let dy = 0;
  let startX = null;
  let startY = null;

  card.node.onmousedown = onMouseDown;
  card.node.oncontextmenu = (event) => event.preventDefault();

  function onMouseDown(event) {
    //card.parent.node.appendChild(card.node);
    if (event.which === 1) {
      if (event.ctrlKey) {
        event.preventDefault();
        //New Card
        startX = Math.floor(event.clientX / 12) * 12;
        startY = Math.floor(event.clientY / 12) * 12;
        let left = Math.floor(event.offsetX / 12) * 12;
        let top = Math.floor(event.offsetY / 12) * 12;

        newCard = card.addCard();
        newCard.attach({
          position: "absolute",
          left,
          top,
          width: 12,
          height: 12,
        });
        newCard.type = "empty";
        initCard(newCard);
        document.onmousemove = onMouseMove;
      }
    }
    if (event.which === 3) {
    } //no designation
    document.onmouseup = onMouseUp; //end
  }
  function onMouseMove(event) {
    dx += event.movementX;
    dy += event.movementY;

    let changeX = 0;
    let changeY = 0;
    if (dx > 9) {
      let value = Math.ceil(dx / 12) * 12;
      changeX = value;
      dx -= value;
    } else if (dx < -9) {
      let value = Math.floor(dx / 12) * 12;
      changeX = value;
      dx -= value;
    }
    if (dy > 9) {
      let value = Math.ceil(dy / 12) * 12;
      changeY = value;
      dy -= value;
    } else if (dy < -9) {
      let value = Math.floor(dy / 12) * 12;
      changeY = value;
      dy -= value;
    }

    //TODO fix lossly anchor corner
    if (event.clientX > startX && event.clientY > startY) {
      //quadrant = 'SE'
      newCard.move({ width: changeX, height: changeY }, true);
    }
    if (event.clientX < startX && event.clientY > startY) {
      //quadrant = 'SW'
      newCard.move({ left: changeX, width: -changeX, height: changeY }, true);
    }
    if (event.clientX > startX && event.clientY < startY) {
      //quadrant = 'NE'
      newCard.move({ top: changeY, width: changeX, height: -changeY }, true);
    }
    if (event.clientX < startX && event.clientY < startY) {
      //quadrant = 'NW'
      newCard.move(
        { left: changeX, top: changeY, width: -changeX, height: -changeY },
        true
      );
    }
  }
  function onMouseUp(event) {
    newCard = null;
    dx = 0;
    dy = 0;
    document.onmousemove = null;
    document.onmouseup = null;
  }
}
function initCard(card) {
  if (card.type === "empty") {
    styleEmpty(card);
  } else if (card.type) {
    cardTypes.get(card.type)?.f(card);
  }
  let startX;
  let startY;
  let offsetX;
  let offsetY;
  let dx = 0;
  let dy = 0;
  let region;

  card.node.onmousedown = onMouseDown;
  card.node.oncontextmenu = (event) => event.preventDefault();

  function onMouseDown(event) {
    startX = event.clientX;
    startY = event.clientY;
    offsetX = event.offsetX;
    offsetY = event.offsetY;
    if (event.which === 1) {
    } //no designation
    if (event.which === 3) {
      region = determineRegion();
      //if drag vs contextmenu?
      //contextmenu:
      card.node.onmouseup = cardOnMouseUp;
      //drag:
      document.onmousemove = onMouseMove;
    }
    document.onmouseup = onMouseUp; //end
  }
  function cardOnMouseUp(event) {
    if (startX === event.clientX && startY === event.clientY) {
      addContextMenu(card, event);
    }
    card.node.onmouseup = null;
  }
  function onMouseMove(event) {
    dx += event.movementX;
    dy += event.movementY;

    let changeX = 0;
    let changeY = 0;
    if (dx > 9) {
      let value = Math.ceil(dx / 12) * 12;
      changeX = value;
      dx -= value;
    } else if (dx < -9) {
      let value = Math.floor(dx / 12) * 12;
      changeX = value;
      dx -= value;
    }
    if (dy > 9) {
      let value = Math.ceil(dy / 12) * 12;
      changeY = value;
      dy -= value;
    } else if (dy < -9) {
      let value = Math.floor(dy / 12) * 12;
      changeY = value;
      dy -= value;
    }

    if (region === "NW") {
      card.move(
        { left: changeX, top: changeY, width: -changeX, height: -changeY },
        true
      );
    } else if (region === "NE") {
      card.move(
        { left: 0, top: changeY, width: changeX, height: -changeY },
        true
      );
    } else if (region === "SE") {
      card.move({ left: 0, top: 0, width: changeX, height: changeY }, true);
    } else if (region === "SW") {
      card.move(
        { left: changeX, top: 0, width: -changeX, height: changeY },
        true
      );
    } else if (region === "N") {
      card.move({ left: 0, top: changeY, width: 0, height: -changeY }, true);
    } else if (region === "E") {
      card.move({ left: 0, top: 0, width: changeX, height: 0 }, true);
    } else if (region === "S") {
      card.move({ left: 0, top: 0, width: 0, height: changeY }, true);
    } else if (region === "W") {
      card.move({ left: changeX, top: 0, width: -changeX, height: 0 }, true);
    } else {
      //move
      card.move({ left: changeX, top: changeY }, true);
    }
  }
  function determineRegion() {
    let lowerX = card.spec.width * 0.25;
    let higherX = card.spec.width * 0.75;
    let lowerY = card.spec.height * 0.25;
    let higherY = card.spec.height * 0.75;

    let xval = startX - card.spec.left;
    let yval = startY - card.spec.top;

    if (xval <= lowerX && yval <= lowerY) {
      return "NW";
    } else if (xval >= higherX && yval <= lowerY) {
      return "NE";
    } else if (xval >= higherX && yval >= higherY) {
      return "SE";
    } else if (xval <= lowerX && yval >= higherY) {
      return "SW";
    } else if (xval > lowerX && xval < higherX && yval < lowerY) {
      return "N";
    } else if (xval > higherX && yval > lowerY && yval < higherY) {
      return "E";
    } else if (xval > lowerX && xval < higherX && yval > higherY) {
      return "S";
    } else if (xval < lowerX && yval > lowerY && yval < higherY) {
      return "W";
    } else {
      return "move";
    }
  }
  function onMouseUp(event) {
    region = null;
    document.onmousemove = null;
    document.onmouseup = null;
  }
}
function addContextMenu(card, event) {
  const menu = document.createElement("div");
  document.body.appendChild(menu);
  menu.style.position = "absolute";
  menu.style.left = event.clientX + "px";
  menu.style.top = event.clientY + "px";
  menu.style.borderTop = "1px dashed black";
  menu.style.borderLeft = "1px dashed black";
  menu.style.borderRight = "1px dashed black";

  document.body.addEventListener("click", removeMenu);
  document.body.addEventListener("contextmenu", removeMenu);
  function removeMenu(event) {
    document.body.removeEventListener("click", removeMenu);
    document.body.removeEventListener("contextmenu", removeMenu);
    menu.remove();
  }

  function addButton(pair) {
    const [label, def] = pair;
    const button = document.createElement("div");
    button.innerHTML = label;
    button.style.minHeight = "1.8rem";
    button.style.paddingLeft = "1rem";
    button.style.paddingRight = "1rem";
    button.style.borderBottom = "1px dashed black";
    button.style.display = "flex";
    button.style.alignItems = "center";
    button.style.cursor = "pointer";
    button.style.background = "#fff";

    button.onmouseover = (event) => {
      button.style.background = "#eee";
    };
    button.onmouseout = (event) => {
      button.style.background = "#fff";
    };

    button.onclick = (event) => {
      if (def.toType) card.type = def.toType;
      menu.remove();
      def.f(card);
    };
    menu.appendChild(button);
  }

  for (let pair of cardTypes) {
    const [label, def] = pair;
    if (card.type === def.fromType || def.fromType === "all") {
      addButton(pair);
    }
  }
}

export { initContainer };
export { initCard };
export { addContextMenu };
export { cardTypes };
