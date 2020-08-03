class Card {
  constructor ({top, left, width, height}) {
    this.card = document.createElement("div");
    this.card.classList.add("card");

    this.content = document.createElement("div");
    this.content.classList.add("content");
    this.content.width = "100%";
    this.content.height = "100%";
    this.card.appendChild(this.content);

    this.card.style.position = "absolute";
    this.card.style.top = top + "px";
    this.card.style.left = left + "px";
    this.card.style.width = width + "px";
    this.card.style.height = height + "px";

    return this.card;
  }

  mouseMove () {
    this.card.onmousedown = onMouseDown;
  }

  toggleBorder () {
    this.card.style.border = "1px dashed black";
  }
}

function onMouseDown(evt) {
  document.onmousemove = handleCardMove;
  document.onmouseup = handleCardUp;
}

function handleCardMove (evt) {

}
function handleCardUp (evt) {
  document.onmousemove = null;
  document.onmouseup = null;
}

export {Card}
