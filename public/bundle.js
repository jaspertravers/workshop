(function () {
  'use strict';

  function handleNewCard (targetCard) {
    let target = targetCard.state.activeCard;
    let canvas = target.canvas;
    let step = 12;
    let dx = 0;
    let dy = 0;
    let newCard;

    target.canvas.onmousemove = function (evt) {
      canvas.onmousemove = readyNewCard;
    };

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
      let newSpec = {left: x, top: y, width: step, height: step};
      newCard = new Card (target, newSpec, {border: true});

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
        newCard.move({dleft: 0, dtop: 0, dwidth: distance, dheight: 0});
        dx -= step * times;
      }
      if (dx < -step * proportion) {
        let times = Math.ceil(Math.abs(dx) / step);
        let distance = step * times;
        newCard.move({dleft: 0, dtop: 0, dwidth: -distance, dheight: 0});
        dx += step * times;
      }
      if (dy > step * proportion) {
        let times = Math.ceil(dy / step);
        let distance = step * times;
        newCard.move({dleft: 0, dtop: 0, dwidth: 0, dheight: distance});
        dy -= step * times;
      }
      if (dy < -step * proportion) {
        let times = Math.ceil(Math.abs(dy) / step);
        let distance = step * times;
        newCard.move({dleft: 0, dtop: 0, dwidth: 0, dheight: -distance});
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
    });

    function buildMove(card) {
      function cursorMove(evt) {
        let proportion = 3 / 4;
        dx += evt.movementX;
        dy += evt.movementY;

        if (dx > step * proportion) {
          let times = Math.ceil(dx / step);
          let distance = step * times;
          card.move({dleft: distance, dtop: 0, dwidth: 0, dheight: 0});
          dx -= step * times;
        }
        if (dx < -step * proportion) {
          let times = Math.ceil(Math.abs(dx) / step);
          let distance = step * times;
          card.move({dleft: -distance, dtop: 0, dwidth: 0, dheight: 0});
          dx += step * times;
        }
        if (dy > step * proportion) {
          let times = Math.ceil(dy / step);
          let distance = step * times;
          card.move({dleft: 0, dtop: distance, dwidth: 0, dheight: 0});
          dy -= step * times;
        }
        if (dy < -step * proportion) {
          let times = Math.ceil(Math.abs(dy) / step);
          let distance = step * times;
          card.move({dleft: 0, dtop: -distance, dwidth: 0, dheight: 0});
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
        });
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
        });
      }

      return function startMoveCard(evt) {
        document.onmousemove = cursorMove;
        document.onmouseup = repeatMoveCard;
        document.body.style.cursor = 'move';
        document.onkeydown = function (evt) {
          if (evt.key === "Escape") {
            endMoveCard();
          }
        };
      }
    }

  }

  class Card$1 {
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
      card.classList.add('card');
      card.style.position = 'absolute';
      card.style.top = this.spec.top + 'px';
      card.style.left = this.spec.left + 'px';
      card.style.width = this.spec.width + 'px';
      card.style.height = this.spec.height + 'px';

      this.node = card;

      if (this.parent instanceof Card$1) {
        this.parent.appendChild(this);
        Card$1.all.push(this); //root is not in all
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

        function distort() {
          const damper = 2; //2 looks best
          return Math.random() / damper - (0.5 / damper);
        }
        for (let x = step; x < this.spec.width ; x += step) {
          for (let y = step; y < this.spec.height ; y += step) {
            for (let iter = 0; iter < step; iter++) {
              if (x + step < this.spec.width) {
                this.state.grid.push({x: x + iter + distort(), y: y + distort()});
              }
              if (y + step < this.spec.height) {
                this.state.grid.push({x: x + distort(), y: y + iter + distort()});
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
            state.diagonals.push({x: x + distort(), y: y + distort()});
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
      this.node.appendChild(card.node);
    }

    get allChildren() {
      let children = [];

      // root: Card
      function recurse(root) {
        root.children.forEach(c => {
          children.push(c);
          if(c.children.length != 0) recurse(c);
        });
      }

      recurse(this);
      return children;
    }
    static fromHTML (node) {
      return Card$1.all.find(c => c.node === node)
    }
    static fromName (name) {
      return Card$1.all.find(c => c.name === name)
    }
    static fromEvent (event) {
      for(let node of evt.path) {
        if (node.classList.contains('card')) {
          return Card$1.all.find(c => c.node === node)
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

      if (this.options.border) this.styleBorder();
      if (this.options.grid) this.styleGrid();
      if (this.options.empty) this.styleEmpty();
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
          buttonSpec = {top: 0, left: this.state.filled, width: 100, height: this.spec.height};
          this.state.filled += buttonSpec.width;
        }
        if (this.state.orientation === 'vertical') {
          buttonSpec = {top: this.state.filled, left: 0, width: this.spec.width, height: 24};
          this.state.filled += buttonSpec.height;
        }

        buttonCard = new Card$1 (this, buttonSpec, {border: true});

        buttonCard.set('button');
        buttonCard.put(content);
        buttonCard.target = this.target;
        if(this.name === 'Tabs') {
          buttonCard.action = () => {
            let newActiveCard = Card$1.fromName(content);
            this.target.state.activeCard.save();
            this.target.state.activeCard = newActiveCard;
            newActiveCard.view();
          };
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
          };
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
        this.ctx.fillText(content, this.canvas.width / 2, this.canvas.height / 2 + 1);
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

      let root = Card$1.root;

      let storage = JSON.stringify(root, replacer);
      return storage;
    }

    viewState() {}
  }

  window.onload = function(evt) {
    document.body.style.overflow = 'hidden';

    let state = {cards: []};
    window.state = state;
    window.Card = Card$1;
    const handler = {
      apply: function(target, thisArg, args) {
        console.log(target, thisArg, args);
        return target(...args);
      },
      construct: function(target, args) {
        console.log('target:', target);
        console.log('args: ', args);
        let build = `new proxy (Card.fromName(${args[0].name}), ${JSON.stringify(args[1])}, ${JSON.stringify(args[2])})`;

        console.log(build);
        return new target(...args);
      }
    };

    const proxy = new Proxy(Card$1, handler);

    //>

    let rootSpec = {top: 0, left: 0, width: window.innerWidth, height: window.innerHeight};
    let rootCard = new Card$1 (document.body, rootSpec, {root: true});
    Card$1.root = rootCard;

    let tabSpec = {top: 12, left: 48, width: window.innerWidth - 60, height: 24};
    let tabCard = new Card$1 (rootCard, tabSpec, {empty: true, border: true});
    tabCard.name = 'Tabs';

    let mainSpec = {top: 36, left: 36, width: window.innerWidth - 36, height: window.innerHeight - 36};
    let mainCard = new Card$1 (rootCard, mainSpec, {grid: true});
    mainCard.name = 'Main';

    tabCard.target = mainCard;

    tabCard.set('controller');
    tabCard.put('Boot');
    tabCard.put('Workshop');
    tabCard.put('Viewport');

    let toolSpec = {top: 48, left: 12, width: 24, height: window.innerHeight - 60};
    let toolCard = new Card$1 (rootCard, toolSpec, {empty: true, border: true});
    toolCard.name = 'Tools';
    toolCard.target = mainCard;
    toolCard.set('controller');
    toolCard.put('N'); //new
    toolCard.put('M'); //move
    toolCard.put('R'); //resize
    toolCard.put('C'); //clone
    toolCard.put('A'); //assign


    let bootSpec = {top: 0, left: 0, width: mainSpec.width, height: mainSpec.height};
    let bootCard = new Card$1 (mainCard, bootSpec, {grid: true});
    bootCard.name = 'Boot';
    mainCard.state.activeCard = bootCard;

    let pspec = {top: 12, left: 12, width: 120, height: 120};
    new proxy (bootCard, pspec, {empty: true, border: true});

    let workshopSpec = {top: 0, left: 0, width: mainSpec.width, height: mainSpec.height};
    let workshopCard = new Card$1 (mainCard, workshopSpec, {grid: true});
    workshopCard.name = 'Workshop';
    workshopCard.save();

    let viewportSpec = {top: 0, left: 0, width: mainSpec.width, height: mainSpec.height};
    let viewportCard = new Card$1 (mainCard, viewportSpec, {grid: true});
    viewportCard.name = 'Viewport';
    viewportCard.save();
  };

}());
//# sourceMappingURL=bundle.js.map
