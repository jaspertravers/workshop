export function setRelate (card) {
  const div = document.createElement('div');
  card.node.appendChild(div);
  div.style.width = '100%';
  div.style.height = '100%';

  buildList();

  function buildList() {
    const list = document.createElement('div');
    list.style.width = 'min-content';
    div.appendChild(list);

    root.children.forEach(c => {
      buildItem(c, list);
    })
  }
  function buildItem(card, list) {
    const item = document.createElement('div');
    item.innerHTML = card.type;
    item.style.minHeight = '1.8rem';
    item.style.paddingLeft = '1rem';
    item.style.paddingRight = '1rem';
    item.style.marginTop = '0.2rem';
    item.style.marginLeft = '0.2rem';
    item.style.border= '1px dashed black';
    item.style.display = 'flex';
    item.style.alignItems = 'center';
    item.style.cursor = 'pointer';
    item.style.background = '#fff';

    item.onmouseover = (event) => {item.style.background = '#eee'}
    item.onmouseout = (event) => {item.style.background = '#fff'}

    list.appendChild(item);
  }
}
