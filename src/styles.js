// this is disgustingly inefficient
function styleGrid(card) {
  //grid
  let canvas = document.createElement('canvas');
  card.node.appendChild(canvas);
  canvas.width = card.spec.width;
  canvas.height = card.spec.height
  let ctx = canvas.getContext('2d');

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#282828';
  ctx.globalAlpha = 1;

  const step = 12;
  const margin = 2;

  function distort() {
    const damper = 2; //2 looks best
    return Math.random() / damper - (0.5 / damper);
  }

  for (let x = step; x < canvas.width; x += step) {
    for (let y = step; y < canvas.height; y += step) {
      for (let iter = 0; iter < step; iter+=3) {
        if (iter === 0) {
          ctx.globalAlpha = 0.3;
        }
        else {
          ctx.globalAlpha = 0.1;
        }
        if (x + step <= canvas.width) {
          ctx.fillRect(x + iter + distort(), y + distort(), 1, 1);
        }
        if (y + step <= canvas.height) {
          ctx.fillRect(x + distort(), y + iter + distort(), 1, 1);
        }
      }
    }
  }
}

export {styleGrid}
