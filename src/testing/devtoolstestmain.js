window.onload = onLoad;
window.onmessage = function (event) {
  console.log(event.data);
}


function onLoad() {
  let p = document.createTextNode("hello tools");
  let main = document.createElement("main");
  document.body.appendChild(main);
  main.appendChild(p);

  let iframe = document.createElement("iframe");
  iframe.width = '800';
  iframe.height = '800';
  main.appendChild(iframe);

  const { port, hostname, protocol } = window.location;
  console.log({port, hostname, protocol})
  const baseURL = `${protocol}//${hostname}${port ? `:${port}` : ''}`;
  console.log(baseURL)
  const secure = /(https)|(wss)/g.test(protocol);
  console.log(secure);
  const search = window.location.search;
  console.log(search);

  //const wsLocation = `${hostname}${port ? `:${port}` : ''}/debugger`;
  const wsLocation = `${hostname}${port ? `:${port}` : ''}`;
  console.log(wsLocation);

  //iframe.src = `https://chrome-devtools-frontend.appspot.com/serve_file/@9c7912d3335c02d62f63be2749d84b2d0b788982/devtools_app.html?${secure ? 'wss' : 'ws'}=${wsLocation}`;
  iframe.src = `https://chrome-devtools-frontend.appspot.com/serve_file/@9c7912d3335c02d62f63be2749d84b2d0b788982/devtools_app.html?ws=localhost:5000/ws&remoteFrontend=true`;

/*
  const wsLocation = `${hostname}${port ? `:${port}` : ''}/debugger`;

  $debugFrame.src = `/devtools/inspector.html?${secure ? 'wss' : 'ws'}=${wsLocation}`;
*/

}
