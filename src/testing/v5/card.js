import {putProseMirror} from './utility.js';
import {putCodeMirror} from './utility.js';
import {setupEvent} from './events.js';

class Card {
  /**
   * spec: {left, top, width, height}
   *   left, top, width, height: integer -- card position
   * type: {type: content}
   *   type:    string  -- indicates card type
   *   content: depends -- used to build a card of type
   */
  constructor() {
    //serializable
    //this.spec = spec;
    //this.type = type;
    //this.content = content;
    //this.visible = visible;

    this.parent = null;
    this.children = [];

    //generated
    this.node = null;
    this.view = null;
  }
  addCard() {
    const card = new Card();
    this.children.push (card);
    card.parent = this;

    return card;
  }
  move({dleft, dtop, dwidth, dheight}) {
    this.spec.left += dleft;
    this.spec.top += dtop;
    this.spec.width += dwidth;
    this.spec.height += dheight;

    this.updateNode();
  }
  updateNode() {
    if (parseInt(this.node.style.left) != this.spec.left) {
      this.node.style.left = this.spec.left + 'px';
    }
    if (parseInt(this.node.style.top) != this.spec.top) {
      this.node.style.top = this.spec.top + 'px';
    }
    if (parseInt(this.node.style.width) != this.spec.width) {
      this.node.style.width = this.spec.width + 'px';
    }
    if (parseInt(this.node.style.height) != this.spec.height) {
      this.node.style.height = this.spec.height + 'px';
    }
  }
  frame() {
    const card = document.createElement('div');
    card.classList.add('card')
    let spec;
    if (this.position) {
      card.style.position = this.position;
    }
    if (this.spec && this.position === 'absolute') {
      card.style.top = this.spec.top + 'px';
      card.style.left = this.spec.left + 'px';
      card.style.width = this.spec.width + 'px';
      card.style.height = this.spec.height + 'px';
    }

    card.style.boxSizing = 'border-box'; //makes placement easier
    this.node = card;
    this.parent.node.appendChild(this.node);
    return card;
  }
  set action(func) {
    this.node.onclick = func(this);
  }
  toStorage() {
    //to be called on root
    this.save();

    function replacer (key, value) {
      if (key === 'node') return null;
      if (key === 'parent') return null; //prevent circular references
      if (key === 'view') return null;
      return value;
    }

    console.log(JSON.stringify(this, replacer))
    window.localStorage.state = JSON.stringify(this, replacer);
  }
  static fromStorage() {
    //builds a root
    let state = JSON.parse(window.localStorage.state);
    let root = new Card(state.spec);
    root.parent = {node: document.body};
    root.generate();

    /*
    state.children.forEach(c => {
      let card = root.addCard(c.spec, c.type);
      card.generate();
    });
    */

    //node is the object, parent is the Card
    function recurse(node, parent) {
      node.children.forEach(c => {
        let card = parent.addCard(c.spec, c.type, c.content, c.visible);
        if (card.visible) card.generate();

        if (c.children.length != 0) recurse(c, card);
      });
    }

    recurse(state, root)

    return root;
  }
  save(visible=null) {
    if (visible) this.visible = false;
    if (this.type === 'codemirror' && this.view) this.content = this.view.state.doc.toString();
    if (this.type === 'prosemirror' && this.view) this.content = JSON.stringify(this.view.state.doc.toJSON());

    if (this.node) this.node.remove();
    this.node = null;

    this.children.forEach(c => c.save(visible));
  }
  load() {
    this.visible = true;
    this.generate();
    this.children.forEach(c => c.load());
  }
  allChildren() {
    let allchildren = [];
    function recurse(node) {
      node.children.forEach(c => {
        allchildren.push(c);

        if (c.children.length != 0) recurse(c);
      });
    }

    recurse(this)
    return allchildren;
  }
  makeProseMirror(content=this.content) {
    this.node.style.background = '#fff';
    //card.node.style.border = '1px solid black';
    this.view = putProseMirror(this.node, content);
  }
  makeCodeMirror(content=this.content) {
    this.node.style.background = '#fff';
    //card.node.style.border = '1px solid black';
    this.view = putCodeMirror (this.node, content);
  }
}
export {Card}
