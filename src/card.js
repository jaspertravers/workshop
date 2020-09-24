class Cardold {
  constructor(spec) {
    this.spec = spec;
    this.parent = null;
    this.children = [];
  }
  build() {
    const card = document.createElement('div');
    card.classList.add('card')
    card.style.position = 'absolute';
    card.style.top = this.spec.top + 'px';
    card.style.left = this.spec.left + 'px';
    card.style.width = this.spec.width + 'px';
    card.style.height = this.spec.height + 'px';
    //card.style.background = '#eee'; //DEBUG

    this.node = card;
    this.contextMenu();
  }
  styleBorder() {
    //temprary method, I like the canvas take from last time.
    this.node.style.border = '1px dashed #282828'
  }
  anchorNew(dx, dy) {
    //quadrants
    this.spec.width += dx;
    this.spec.height += dy;
    this.node.style.width = parseInt(this.node.style.width) + dx + 'px';
    this.node.style.height = parseInt(this.node.style.height) + dy + 'px';
  }
  newCardFromMouse() {
    document.body.style.cursor = 'crosshair';

    this.node.onmousedown = (event) => {
      let defaultspec = {left: event.offsetX, top: event.offsetY, width: 0, height: 0};
      let newCard = new Card(defaultspec);
      newCard.build();
      newCard.styleBorder();
      this.children.push(newCard);
      this.node.appendChild(newCard.node);
      document.body.onmousemove = (event) => {
        newCard.anchorNew(event.movementX, event.movementY);
      }
    }
    // cleanup
    document.body.onmouseup = (event) => {
      document.body.style.cursor = null;
      this.node.onmousedown = null;
      document.body.onmousemove = null;
      document.body.onmouseup = null;
    }
  }
  setProseMirror() {
    this.view = putProseMirror(this.node);
  }
  setCodeMirror() {
    this.view = putCodeMirror(this.node, Card.toString());
    //this.view = putCodeMirror(this.node);
  }
  save() {
    return this;
  }
}


class Card {
  constructor(spec) {
    this.spec = spec;
    this.parent = null;
    this.children = [];

    this.node = null;
    this.options = {};
    this.log = [];
  }
  newCard(spec) {
    const card = new Card(spec);
    this.children.push (card);
    card.parent = this;
    return card;
  }
  layout(spec) {
    //TODO
  }
  render(options=this.options) {
    const card = document.createElement('div');
    card.classList.add('card')
    card.style.position = 'absolute';
    card.style.top = this.spec.top + 'px';
    card.style.left = this.spec.left + 'px';
    card.style.width = this.spec.width + 'px';
    card.style.height = this.spec.height + 'px';
    //card.style.background = '#eee'; //DEBUG

    if (options.border === 'all') card.style.border = '1px dashed black';
    if (options.border === 'right') card.style.borderRight = '1px dashed black';
    this.options = options;

    this.node = card;
    this.visible = true;
    //root is appended to document.body not here; every other card added to DOM here
    if (this.parent) {
      this.parent.node.appendChild(this.node);
    }
  }

  set action(func) {
    this.node.onclick = func(this);
  }

  save(options={}) {
    if (options.visible) this.visible = options.visible;
    this.node.remove();
    this.node = null;
  }
  load(options={}) {
    //assumes this card and all children have not been loaded
    //assumes this card exists by having been constructed as a new Card or card.newCard

    if (options.visible) this.visible = true;
    if (this.visible) {
      this.render();
    }
    this.children.forEach(c => c.load());
  }
}


export {Card}
