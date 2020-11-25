import { Card } from "./card.js";
import { initContainer } from "./utility.js";
import { initCard } from "./utility.js";
import { cardTypes } from "./utility.js";
import { styleGrid } from "./styles.js";
import { defaultState } from "./state.js";

window.onload = onLoad;

function onLoad(event) {
  //document.body.style.fontSize = '12px';
  document.body.style.overflow = "hidden";

  window.state = new Map();
  window.Card = Card;
  window.cardTypes = cardTypes;

  if (window.localStorage.state) {
    window.root = fromStorage(window.localStorage.state);
  } else {
    window.root = fromStorage(defaultState);
    //window.root = buildRoot();
  }
  window.onbeforeunload = function (event) {
    if (window.root) toStorage(window.root);
  };

  window.reset = function () {
    //DEBUG
    window.onbeforeunload = null;
    window.localStorage.clear();
  };

  //storage interface

  function toStorage(root) {
    //to be called on root

    function replacer(key, value) {
      if (key === "node") return null;
      if (key === "parent") return null; //prevent circular references
      if (key === "view") return null;
      return value;
    }
    window.localStorage.state = JSON.stringify(root, replacer);
  }
  function fromStorage(storage, parse) {
    let json;
    if (parse) {
      json = JSON.parse(storage);
    } else {
      json = storage;
    }

    let root = new Card();
    window.root = root;
    root.parent = { node: document.body }; // forces data structure integrity
    root.attach({
      //root is always made fullscreen
      position: "absolute",
      left: 0,
      top: 0,
      width: window.innerWidth,
      height: window.innerHeight,
    });

    root.type = "container";
    styleGrid(root);
    initContainer(root);
    root.counter = json.counter;

    //node is the object, parent is the Card
    function recurse(node, parent) {
      node.children.forEach((c) => {
        let card = parent.addCard(c.id);
        card.attach(c.spec);
        card.type = c.type;
        card.content = c.content;
        card.tags = c.tags;
        card.source = c.source;
        card.autorun = c.autorun;

        initCard(card);
        if (card.autorun) {
          new Function(card.source)();
        }

        if (c.children.length != 0) recurse(c, card);
      });
    }

    recurse(json, root);

    return root;
  }
}

function buildRoot() {
  window.root = new Card();
  root.parent = { node: document.body }; // forces data structure integrity
  root.attach({
    position: "absolute",
    left: 0,
    top: 0,
    width: window.innerWidth,
    height: window.innerHeight,
  });

  root.type = "container";
  styleGrid(root);

  initContainer(root);

  root.counter = 1;
  return root;
}
