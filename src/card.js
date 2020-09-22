import {handleNewCard} from './events.js'
import {handleMoveCard} from './events.js'

class Card {
  static all = [];
  static root;
  static defaultSpec = {top: 0, left: 0, width: 0, height: 0}
  /**
   * spec: {top, left, width, height : numbers}
   * parent: Card
   * options: {root, border, grid, empty : boolean}
   *
   */
  constructor(parent, spec, options={}) {
    this.parent = parent;
    this.spec = spec;
    this.options = options;
    this.children = [];

    this.type = null;
    this.content = null;
    this.name = null;

    this.action = () => {}; //noop. For buttons like events
    this.target = null;
    this.state = {};

    this.node = null;
    this.buildNode();
    this.draw();
  }
  buildNode() {
    let card = document.createElement('div');
    card.classList.add('card')
    card.style.position = 'absolute';
    card.style.top = this.spec.top + 'px';
    card.style.left = this.spec.left + 'px';
    card.style.width = this.spec.width + 'px';
    card.style.height = this.spec.height + 'px';

    this.node = card;

    if (this.parent instanceof Card) {
      this.parent.appendChild(this);
      Card.all.push(this); //root is not in all
    }
    else {
      // this is a root node being attached to an HTML element
      this.parent.appendChild(this.node);
    }

    return card;
  }
  styleBorder() {
    if (!this.canvas) {
      this.canvas = document.createElement('canvas');
      this.canvas.width = this.spec.width;
      this.canvas.height = this.spec.height;
      this.node.appendChild(this.canvas);
      this.ctx = this.canvas.getContext('2d');
    }
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillRect(0, 0, this.spec.width, this.spec.height);

    //edges dark
    const borderStep = 1;
    this.ctx.fillStyle = '#282828';
    this.ctx.globalAlpha = 0.8;

    // horizontal
    for (let x = 0; x <= this.spec.width; x += borderStep) {
      this.ctx.fillRect(x, 0, 1, 1);
      this.ctx.fillRect(x, this.spec.height - 1, 1, 1);
    }
    // vertical
    for (let y = 0; y <= this.spec.height; y += borderStep) {
      this.ctx.fillRect(0, y, 1, 1);
      this.ctx.fillRect(this.spec.width - 1, y, 1, 1);
    }
  }
  styleGrid() {
    if (!this.canvas) {
      this.canvas = document.createElement('canvas');
      this.canvas.width = this.spec.width;
      this.canvas.height = this.spec.height;
      this.node.appendChild(this.canvas);
      this.ctx = this.canvas.getContext('2d');
    }
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillRect(0, 0, this.spec.width, this.spec.height);
    this.ctx.fillStyle = '#282828';
    this.ctx.globalAlpha = 0.1;

    if (!this.state.gird) {
      this.state.grid = [];
      const step = 12;
      const margin = 2;

      function distort() {
        const damper = 2; //2 looks best
        return Math.random() / damper - (0.5 / damper);
      }
      for (let x = step; x < this.spec.width ; x += step) {
        for (let y = step; y < this.spec.height ; y += step) {
          for (let iter = 0; iter < step; iter++) {
            if (x + step < this.spec.width) {
              this.state.grid.push({x: x + iter + distort(), y: y + distort()})
            }
            if (y + step < this.spec.height) {
              this.state.grid.push({x: x + distort(), y: y + iter + distort()})
            }
          }
        }
      }
    }

    this.ctx.beginPath();
    for (let iter = 0; iter < this.state.grid.length; iter++) {
      this.ctx.rect(this.state.grid[iter].x, this.state.grid[iter].y, 1, 1);
    }
    this.ctx.fill();

  }
  styleEmpty() {
    if (!this.canvas) {
      this.canvas = document.createElement('canvas');
      this.canvas.width = this.spec.width;
      this.canvas.height = this.spec.height;
      this.node.appendChild(this.canvas);
      this.ctx = this.canvas.getContext('2d');
    }

    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillRect(1, 1, this.spec.width - 2, this.spec.height - 2);

    this.ctx.fillStyle = '#282828';
    this.ctx.globalAlpha = 0.6;

    if (!this.state.diagonals) {
      this.state.diagonals = [];
      const diagonalStep = 6;
      let diagonalLeftover = 0; // handles rectangles
      for (let x = diagonalStep; x <= this.spec.width; x += diagonalStep) {
        diagonal(x, 0, this.spec.height, 1, this.state);
        diagonalLeftover = this.spec.width - x;
      }
      for (let y = diagonalStep - diagonalLeftover; y < this.spec.height; y += diagonalStep) {
        diagonal(this.spec.width, y, this.spec.height, 1, this.state);
      }

      function diagonal(x, y, height, step=1, state) {
        while(x >= 0 && y < height) {
          state.diagonals.push({x: x + distort(), y: y + distort()})
          x -= step;
          y += step;
        }
      }
      function distort() {
        const damper = 2; //2 looks best
        return Math.random() / damper - (0.5 / damper);
      }
    }

    this.ctx.beginPath();
    for (let iter = 0; iter < this.state.diagonals.length; iter++) {
      this.ctx.rect(this.state.diagonals[iter].x, this.state.diagonals[iter].y, 1, 1);
    }
    this.ctx.fill();
  }
  appendChild(card) {
    this.children.push(card);
    this.node.appendChild(card.node)
  }

  get allChildren() {
    let children = [];

    // root: Card
    function recurse(root) {
      root.children.forEach(c => {
        children.push(c);
        if(c.children.length != 0) recurse(c);
      })
    }

    recurse(this);
    return children;
  }
  static fromHTML (node) {
    return Card.all.find(c => c.node === node)
  }
  static fromName (name) {
    return Card.all.find(c => c.name === name)
  }
  static fromEvent (event) {
    for(let node of evt.path) {
      if (node.classList.contains('card')) {
        return Card.all.find(c => c.node === node)
      }
    }
  }

  move({dtop, dleft, dwidth, dheight}) {
    this.spec.top += dtop;
    this.spec.left += dleft;
    this.spec.width += dwidth;
    this.spec.height += dheight;

    this.updateNode();
  }
  updateNode() {
    if (parseInt(this.node.style.top) != this.spec.top) {
      this.node.style.top = this.spec.top + 'px';
    }
    if (parseInt(this.node.style.left) != this.spec.left) {
      this.node.style.left = this.spec.left + 'px';
    }
    if (parseInt(this.node.style.width) != this.spec.width) {
      this.node.style.width = this.spec.width + 'px';
    }
    if (parseInt(this.node.style.height) != this.spec.height) {
      this.node.style.height = this.spec.height + 'px';
    }

    this.redraw = true;
    this.draw();
  }
  draw() {
    if (this.redraw) {
      this.canvas.remove();
      this.canvas = null;
      this.ctx = null;

      this.state.grid = null;
      this.state.diagonals = null;

      this.redraw = null;
    }

    if (this.canvas) {
      return;
    }

    if (this.options.border) this.styleBorder()
    if (this.options.grid) this.styleGrid()
    if (this.options.empty) this.styleEmpty()
  }

  set(type) {
    this.type = type;
    if (type === 'controller') {
      this.state.orientation = this.spec.width > this.spec.height ? 'horizontal' : 'vertical';
      this.state.filled = 0;
    }
  }
  put(content) {
    //switch
    if (this.type === 'controller') {
      let buttonSpec;
      let buttonCard;
      if (this.state.orientation === 'horizontal') {
        buttonSpec = {top: 0, left: this.state.filled, width: 100, height: this.spec.height}
        this.state.filled += buttonSpec.width;
      }
      if (this.state.orientation === 'vertical') {
        buttonSpec = {top: this.state.filled, left: 0, width: this.spec.width, height: 24}
        this.state.filled += buttonSpec.height
      }

      buttonCard = new Card (this, buttonSpec, {border: true})

      buttonCard.set('button');
      buttonCard.put(content);
      buttonCard.target = this.target;
      if(this.name === 'Tabs') {
        buttonCard.action = () => {
          let newActiveCard = Card.fromName(content);
          this.target.state.activeCard.save();
          this.target.state.activeCard = newActiveCard;
          newActiveCard.view();
        }
      }
      if(this.name === 'Tools') {
        buttonCard.action = () => {
          console.log(content);
          // new card
          if (content === 'N') {
            handleNewCard(this.target);
          }
          if (content === 'M') {
            handleMoveCard(this.target);
          }
        }
      }
      buttonCard.node.onclick = buttonCard.action;
      buttonCard.content = content;
    }

    if (this.type === 'button') {
      this.ctx.save();
      this.ctx.fillStyle = '#282828';
      this.ctx.globalAlpha = 1.0;
      this.ctx.font = '16px serif';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText(content, this.canvas.width / 2, this.canvas.height / 2 + 1)
      this.ctx.restore();
    }
  }

  save() {
    this.node.remove();
  }
  view() {
    this.parent.node.appendChild(this.node);
  }

  saveState() {
    function replacer (key, value) {
      console.log(key);
      console.log(value);
      const includes = ['spec', 'options', 'children', 'type', 'content', 'name', 'action', 'target', 'state'];

      for (let element of includes) {
        if (element == key) {
          return value;
        }
      }
    }

    let root = Card.root;

    let storage = JSON.stringify(root, replacer);
    return storage;
  }

  viewState() {}
}

export {Card}
