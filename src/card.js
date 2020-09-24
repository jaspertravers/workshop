class Card {
  /**
   * spec: {left, top, width, height}
   *   left, top, width, height: integer -- card position
   * type: {type: content}
   *   type:    string  -- indicates card type
   *   content: depends -- used to build a card of type
   */
  constructor(spec, type) {
    //serializable
    this.spec = spec;
    this.type = type; //{type: content}

    this.parent = null;
    this.children = [];

    //generated
    this.node = null;
  }
  addCard(spec, type) {
    const card = new Card(spec, type);
    this.children.push (card);
    card.parent = this;
    return card;
  }
  layout(func) {
    //TODO
    //I'm in the dark on this one...
  }
  generate() {
    let content;
    let card;
    if (content = this.type.empty) {
      this.buildEmpty(content);
    }
    if (content = this.type.controller) {
      this.buildEmpty(content);
      this.buildController(content);
    }
  }
  buildEmpty(content) {
    const card = document.createElement('div');
    card.classList.add('card')
    card.style.position = 'absolute';
    card.style.top = this.spec.top + 'px';
    card.style.left = this.spec.left + 'px';
    card.style.width = this.spec.width + 'px';
    card.style.height = this.spec.height + 'px';

    if (content.border === 'all') card.style.border = '1px dashed black';
    if (content.border === 'left') card.style.borderLeft = '1px dashed black';
    if (content.border === 'top') card.style.borderTop = '1px dashed black';
    if (content.border === 'right') card.style.borderRight = '1px dashed black';
    if (content.border === 'bottom') card.style.borderBottom = '1px dashed black';

    this.node = card;
    this.parent.node.appendChild(this.node);
    return card;
  }
  buildController({target, keys}) {
    // make two cards, one appended to target one a child of this controller
    let leftoffset = 0;
    let buttonwidth = 100;
    let buttons = [];
    let tabs = [];
    keys.forEach(k => {
      let buttonspec = {left: leftoffset, top: 0, width: buttonwidth, height:this.spec.height}
      let buttontype = {empty: {border: 'all'}}
      let button = this.addCard(buttonspec, buttontype);
      button.generate();
      leftoffset += buttonwidth;

      let tabspec = {left: 0, top: 0, width: target.spec.width, height: target.spec.height}
      let tabtype = {empty: {}}
      let tab = target.addCard(tabspec, tabtype);

      button.action = (context) => (event) => {
        tab.generate();
      }
    });
  }
  set action(func) {
    //TODO
    this.node.onclick = func(this);
  }
  save() {
    this.node.remove();
    this.node = null;

    this.children.forEach(c => c.save());
  }
  load() {
    //TODO
    //assumes this card and all children have not been loaded
    //assumes this card exists by having been constructed as a new Card or card.newCard

    this.render();

    this.children.forEach(c => c.load());
  }
}

//class Kit extends Card {}

export {Card}

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
