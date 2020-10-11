class Card {
  constructor() {
    // serializable
    this.type = null;
    this.content = null;
    this.tags = [];
    // data structure
    this.parent = null;
    this.children = [];
    // generated
    this.node = document.createElement('div');
    this.node.classList.add('card');
    this.node.onmousedown = (event) => {
      event.stopPropagation();
    }
    this.view = null;
  }
  addCard() {
    const card = new Card();
    this.children.push (card);
    card.parent = this;

    return card;
  }
  attach(spec) {
    this.spec = spec;
    this.parent.node.appendChild(this.node);
    for (let key in spec) {
      if (spec.position === 'absolute' && typeof spec[key] === 'number') {
        this.node.style[key] = `${spec[key]}px`;
      }
      else {
        this.node.style[key] = spec[key];
      }
    }
  }
  move(spec, delta=false) {
    //assumes spec only contains subsets of top, left, width, height
    if(!delta) { //absolute move
      for (let key in spec) {
        this.spec[key] = spec[key];
        this.node.style[key] = `${this.spec[key]}px`;
      }
    }
    else { //delta move
      for (let key in spec) {
        this.spec[key] += spec[key];
        this.node.style[key] = `${this.spec[key]}px`;
      }
    }
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

export {Card}
