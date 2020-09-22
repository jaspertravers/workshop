import {Card} from './card.js'
import {eventSetup} from './events.js'

window.onload = function(evt) {
  document.body.style.overflow = 'hidden';

  let state = {cards: []};
  window.state = state;
  window.Card = Card;

  //proxy
  let record = [];
  const handler = {
    apply: function(target, thisArg, args) {
      console.log(target, thisArg, args)
      return target(...args);
    },
    construct: function(target, args) {
      console.log('target:', target);
      console.log('args: ', args);
      let build = `new proxy (Card.fromName(${args[0].name}), ${JSON.stringify(args[1])}, ${JSON.stringify(args[2])})`;

      console.log(build);
      return new target(...args);
    }
  }

  const proxy = new Proxy(Card, handler);

  //>

  let rootSpec = {top: 0, left: 0, width: window.innerWidth, height: window.innerHeight}
  let rootCard = new Card (document.body, rootSpec, {root: true})
  Card.root = rootCard;

  let tabSpec = {top: 12, left: 48, width: window.innerWidth - 60, height: 24}
  let tabCard = new Card (rootCard, tabSpec, {empty: true, border: true})
  tabCard.name = 'Tabs';

  let mainSpec = {top: 36, left: 36, width: window.innerWidth - 36, height: window.innerHeight - 36}
  let mainCard = new Card (rootCard, mainSpec, {grid: true})
  mainCard.name = 'Main';

  tabCard.target = mainCard;

  tabCard.set('controller');
  tabCard.put('Boot');
  tabCard.put('Workshop');
  tabCard.put('Viewport');

  let toolSpec = {top: 48, left: 12, width: 24, height: window.innerHeight - 60}
  let toolCard = new Card (rootCard, toolSpec, {empty: true, border: true})
  toolCard.name = 'Tools';
  toolCard.target = mainCard;
  toolCard.set('controller');
  toolCard.put('N') //new
  toolCard.put('M') //move
  toolCard.put('R') //resize
  toolCard.put('C') //clone
  toolCard.put('A') //assign


  let bootSpec = {top: 0, left: 0, width: mainSpec.width, height: mainSpec.height}
  let bootCard = new Card (mainCard, bootSpec, {grid: true})
  bootCard.name = 'Boot';
  mainCard.state.activeCard = bootCard;

  let pspec = {top: 12, left: 12, width: 120, height: 120}
  new proxy (bootCard, pspec, {empty: true, border: true})

  let workshopSpec = {top: 0, left: 0, width: mainSpec.width, height: mainSpec.height}
  let workshopCard = new Card (mainCard, workshopSpec, {grid: true})
  workshopCard.name = 'Workshop';
  workshopCard.save();

  let viewportSpec = {top: 0, left: 0, width: mainSpec.width, height: mainSpec.height}
  let viewportCard = new Card (mainCard, viewportSpec, {grid: true})
  viewportCard.name = 'Viewport';
  viewportCard.save();

  eventSetup();

  // should be in a card
  function run(task) {
    let runner = stopify.stopifyLocally(task, {newMethod: "direct"});
    runner.g = window;
    runner.run(result => result); //ignores stopify value
  }
}
