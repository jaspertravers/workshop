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
  constructor(spec, type, content=null, visible=true) {
    //serializable
    this.spec = spec;
    this.type = type;
    this.content = content;
    this.visible = visible;

    this.parent = null;
    this.children = [];

    //generated
    this.node = null;
    this.view = null;
  }
  addCard(spec, type, content=null, visible=true) {
    const card = new Card(spec, type, content, visible);
    this.children.push (card);
    card.parent = this;

    if (visible) card.generate(); //TODO ??
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
  generate() {
    let key; //for `switch`
    this.frame();

    //codemirror
    if (this.type === 'codemirror') {
      this.node.style.background = '#fff';
      this.node.style.border = '1px solid black';
      this.view = putCodeMirror (this.node, this.content);
    }
    //prosemirror
    if (this.type === 'prosemirror') {
      this.node.style.background = '#fff';
      this.node.style.border = '1px solid black';
      this.view = putProseMirror(this.node, this.content);
    }
    //execute button
    if (this.type === 'executeButton') {
      this.node.style.cursor = 'pointer';
      this.node.style.border = '1px dashed black';
      this.node.style.background = '#fff';
      this.node.style.display = 'flex';
      this.node.style.justifyContent = 'center';
      this.node.style.fontSize = '1rem';
      this.node.style.alignItems = 'center';
      this.node.innerHTML = this.content;
      this.node.addEventListener('mouseover', (event) => {this.node.style.background = '#eee'});
      this.node.addEventListener('mouseout', (event) => {this.node.style.background = '#fff'});

      this.node.onclick = (event) => {
        event.preventDefault();
        let task = this.parent.view.state.doc.toString();
        new Function(task)();
      }
    }
    if (this.type === 'container') {
    }
    if (this.type === 'container.tabs') {
      this.node.style.background = '#fff';
      this.node.style.border = '1px dashed black';
    }
    if (this.type === 'tabs.tab') {
      //style
      this.node.style.cursor = 'pointer';
      this.node.style.borderRight = '1px dashed black';
      this.node.style.background = '#fff';
      this.node.style.display = 'flex';
      this.node.style.justifyContent = 'center';
      this.node.style.fontSize = '1rem';
      this.node.style.alignItems = 'center';
      this.node.innerHTML = this.content;
      this.node.addEventListener('mouseover', (event) => {this.node.style.background = '#eee'});
      this.node.addEventListener('mouseout', (event) => {this.node.style.background = '#fff'});

      //functionality
      this.node.onclick = (event) => {
        event.preventDefault();
        let container = this.parent.parent;
        let lastOpen = container.children.find(item =>
          item.type === 'container.space' && item.content === container.content);
        let space = container.children.find(item =>
          item.type === 'container.space' && item.content === this.content);
        container.content = this.content;
        lastOpen.save(true);
        space.load();
      }
    }
    if (this.type === 'container.tools') {
    }
    if (this.type === 'tools.icon') {
      this.node.style.cursor = 'pointer';
      this.node.style.border= '1px dashed black';
      this.node.style.background = '#fff';
      this.node.style.display = 'flex';
      this.node.style.justifyContent = 'center';
      this.node.style.fontSize = '1rem';
      this.node.style.alignItems = 'center';
      this.node.innerHTML = this.content[0];
      this.node.addEventListener('mouseover', (event) => {this.node.style.background = '#eee'});
      this.node.addEventListener('mouseout', (event) => {this.node.style.background = '#fff'});

      this.node.onclick = (event) => {
        event.preventDefault();
        let container = this.parent.parent;
        let space = container.children.find(item =>
          item.type === 'container.space' && item.content === container.content);

        setupEvent(event, space, this.content);
      }
    }
    if (this.type === 'empty') {
      this.node.style.background = '#fff';
    }
    if (this.type === 'container.space') {
    }
  } //end switch
  frame(content={}) {
    const card = document.createElement('div');
    card.classList.add('card')
    card.style.position = 'absolute';
    card.style.top = this.spec.top + 'px';
    card.style.left = this.spec.left + 'px';
    card.style.width = this.spec.width + 'px';
    card.style.height = this.spec.height + 'px';

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
}
//class Kit extends Card {}
export {Card}
