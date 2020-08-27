export const exdefault = "{\"boot\":{\"cards\":[{\"top\":48,\"left\":48,\"width\":600,\"height\":600,\"type\":\"prosemirror\",\"content\":\"{\\\"type\\\":\\\"doc\\\",\\\"content\\\":[{\\\"type\\\":\\\"heading\\\",\\\"attrs\\\":{\\\"level\\\":1},\\\"content\\\":[{\\\"type\\\":\\\"text\\\",\\\"text\\\":\\\"Workshop\\\"}]},{\\\"type\\\":\\\"paragraph\\\",\\\"content\\\":[{\\\"type\\\":\\\"text\\\",\\\"text\\\":\\\"This is a prototype digital workshop. It is intended to be an environment in which full interface and computational control are explicitly provided to the user. To that end, this workshop is built in the browser on top of vanilla technologies. It’s source is available here in the \\\"},{\\\"type\\\":\\\"text\\\",\\\"marks\\\":[{\\\"type\\\":\\\"em\\\"}],\\\"text\\\":\\\"Boot\\\"},{\\\"type\\\":\\\"text\\\",\\\"text\\\":\\\" tab alongside this editor on first page load. The environment also initially provides three “primitives” on top of the browser: a rich content editor (with live markdown and common hotkeys), a code editor, and an execution environment that improves upon the single-threaded browser VM. \\\"}]},{\\\"type\\\":\\\"paragraph\\\",\\\"content\\\":[{\\\"type\\\":\\\"text\\\",\\\"text\\\":\\\"The Workshop is a prototyping interface in which any and all functionality can be directly tied to its source, as well as redefined and re-evaluated at any point. There are a few underlying constructs which are crucial to develop this prototyping meta-environment.\\\"}]},{\\\"type\\\":\\\"ordered_list\\\",\\\"attrs\\\":{\\\"order\\\":1},\\\"content\\\":[{\\\"type\\\":\\\"list_item\\\",\\\"content\\\":[{\\\"type\\\":\\\"paragraph\\\",\\\"content\\\":[{\\\"type\\\":\\\"text\\\",\\\"text\\\":\\\"In the spirit of HyperCard and the Wiki, all content is stored in a single container type \\\"},{\\\"type\\\":\\\"text\\\",\\\"marks\\\":[{\\\"type\\\":\\\"em\\\"}],\\\"text\\\":\\\"Card\\\"},{\\\"type\\\":\\\"text\\\",\\\"text\\\":\\\" to which all functionality and view are attached. This is a prosemirror card, to the right are a collection of codemirror cards. The collection of card interfacing functions are defined here in \\\"},{\\\"type\\\":\\\"text\\\",\\\"marks\\\":[{\\\"type\\\":\\\"em\\\"}],\\\"text\\\":\\\"Boot.\\\"}]}]},{\\\"type\\\":\\\"list_item\\\",\\\"content\\\":[{\\\"type\\\":\\\"paragraph\\\",\\\"content\\\":[{\\\"type\\\":\\\"text\\\",\\\"text\\\":\\\"This space defines the interface to the Workshop explicitly. Any and all other spaces may define themselves within the the view itself or be referenced by outside “source” spaces.\\\"}]}]}]},{\\\"type\\\":\\\"horizontal_rule\\\"},{\\\"type\\\":\\\"paragraph\\\",\\\"content\\\":[{\\\"type\\\":\\\"text\\\",\\\"text\\\":\\\"This is just the most basic setup possible, in the days to come I will expand upon the initial content within the default setup and keep it all present and editable directly from the source. The Workshop is now in a state where all future development can occur within the system itself. \\\"}]},{\\\"type\\\":\\\"paragraph\\\",\\\"content\\\":[{\\\"type\\\":\\\"text\\\",\\\"text\\\":\\\"— Jasper\\\"}]}]}\"},{\"top\":48,\"left\":660,\"width\":700,\"height\":800,\"type\":\"codemirror\",\"content\":\"/*\\nlet newCardSpec = {\\n  top: 12, left: 248, width: 100, height: 24,\\n  type: \\\"button\\\",\\n  content: \\\"third\\\"\\n}\\n*/\\n//let context = getStorage();\\n//context[\\\"Workshop\\\"].cards.push(newCardSpec);\\n\\n//saveStorage(context);\\n\\n//viewCard(newCardSpec)\\n\\n\\n// don't run this, this is the code which made the lower editor in \\\"Workshop\\\".\\n// If you want to make another editor, sub in different coordinates in the spec.\\n\\n\\nconsole.log(exdefault);\\n\\n\\n\\n\"},{\"top\":660,\"left\":48,\"width\":600,\"height\":400,\"type\":\"codemirror\",\"content\":\"// two more primitives are in the works: \\n// 1. Console/Sandbox\\n// 2. SVG/Canvas\\n\\n\\n\\n\"},{\"top\":12,\"left\":48,\"width\":1824,\"height\":24,\"type\":\"tabs\",\"content\":\"I guess some tabs\"},{\"top\":48,\"left\":1372,\"width\":500,\"height\":600,\"type\":\"prosemirror\",\"content\":\"{\\\"type\\\":\\\"doc\\\",\\\"content\\\":[{\\\"type\\\":\\\"heading\\\",\\\"attrs\\\":{\\\"level\\\":1},\\\"content\\\":[{\\\"type\\\":\\\"text\\\",\\\"text\\\":\\\"Patterns\\\"}]},{\\\"type\\\":\\\"heading\\\",\\\"attrs\\\":{\\\"level\\\":3},\\\"content\\\":[{\\\"type\\\":\\\"text\\\",\\\"text\\\":\\\"Tabs\\\"}]},{\\\"type\\\":\\\"paragraph\\\",\\\"content\\\":[{\\\"type\\\":\\\"text\\\",\\\"text\\\":\\\"Within the bounding box of a card?\\\"}]},{\\\"type\\\":\\\"paragraph\\\",\\\"content\\\":[{\\\"type\\\":\\\"text\\\",\\\"text\\\":\\\"How and what card listeners should exist? Are tabs simply low-content cards? How to attach listener? A separate constructor separating out the *mirror cases vs buttons, canvas or console?\\\"}]},{\\\"type\\\":\\\"paragraph\\\",\\\"content\\\":[{\\\"type\\\":\\\"text\\\",\\\"text\\\":\\\"How do we want to do wm decorators and names?\\\"}]},{\\\"type\\\":\\\"paragraph\\\"},{\\\"type\\\":\\\"paragraph\\\"},{\\\"type\\\":\\\"paragraph\\\",\\\"content\\\":[{\\\"type\\\":\\\"text\\\",\\\"text\\\":\\\"All the more reason to implement saveCard\\\"}]},{\\\"type\\\":\\\"paragraph\\\"},{\\\"type\\\":\\\"paragraph\\\"},{\\\"type\\\":\\\"paragraph\\\"},{\\\"type\\\":\\\"paragraph\\\"},{\\\"type\\\":\\\"horizontal_rule\\\"},{\\\"type\\\":\\\"paragraph\\\",\\\"content\\\":[{\\\"type\\\":\\\"text\\\",\\\"text\\\":\\\"i3 drawers? vs org drawers?\\\"}]},{\\\"type\\\":\\\"paragraph\\\",\\\"content\\\":[{\\\"type\\\":\\\"text\\\",\\\"text\\\":\\\"c2 object browser for window attachments from build?\\\"}]}]}\"},{\"top\":660,\"left\":1372,\"width\":500,\"height\":300,\"type\":\"prosemirror\",\"content\":\"{\\\"type\\\":\\\"doc\\\",\\\"content\\\":[{\\\"type\\\":\\\"heading\\\",\\\"attrs\\\":{\\\"level\\\":1},\\\"content\\\":[{\\\"type\\\":\\\"text\\\",\\\"text\\\":\\\"Cards\\\"}]},{\\\"type\\\":\\\"paragraph\\\",\\\"content\\\":[{\\\"type\\\":\\\"text\\\",\\\"text\\\":\\\"Editing \\\"},{\\\"type\\\":\\\"text\\\",\\\"marks\\\":[{\\\"type\\\":\\\"em\\\"}],\\\"text\\\":\\\"existing\\\"},{\\\"type\\\":\\\"text\\\",\\\"text\\\":\\\" cards is unwieldy. Need to improve on the current unnamed array access.\\\"}]},{\\\"type\\\":\\\"paragraph\\\",\\\"content\\\":[{\\\"type\\\":\\\"text\\\",\\\"text\\\":\\\"Expand the card types capabilities.\\\"}]},{\\\"type\\\":\\\"paragraph\\\"}]}\"},{\"top\":12,\"left\":148,\"width\":100,\"height\":24,\"type\":\"button\",\"content\":\"Workshop\"},{\"top\":12,\"left\":48,\"width\":100,\"height\":24,\"type\":\"button\",\"content\":\"boot\"}]},\"Workshop\":{\"cards\":[{\"top\":12,\"left\":48,\"width\":1824,\"height\":24,\"type\":\"tabs\",\"content\":\"I guess some tabs\"},{\"top\":12,\"left\":148,\"width\":100,\"height\":24,\"type\":\"button\",\"content\":\"Workshop\"},{\"top\":12,\"left\":48,\"width\":100,\"height\":24,\"type\":\"button\",\"content\":\"boot\"},{\"top\":48,\"left\":48,\"width\":700,\"height\":600,\"type\":\"codemirror\",\"content\":\"if (!window.canvas) {\\n\\n  window.canvas = document.createElement(\\\"canvas\\\");\\n  canvas.style.position = \\\"absolute\\\";\\n  canvas.style.top = \\\"48px\\\";\\n  canvas.style.left = \\\"760px\\\";\\n  canvas.style.width = \\\"800px\\\";\\n  canvas.style.height = \\\"800px\\\";\\n  canvas.style.border = \\\"1px dashed black\\\";\\n  canvas.width = 800;\\n  canvas.height = 800;\\n  main.appendChild(canvas);\\n\\n  window.ctx = canvas.getContext(\\\"2d\\\");\\n}\\nmain.appendChild(canvas); //catchall\\n\\n\\n// main\\nctx.clearRect(0, 0, 800, 800);\\n\\nctx.fillStyle = \\\"#282828\\\";\\nctx.fillRect(0, 0, 800, 800);\\nctx.fillStyle = \\\"#eeeeee\\\";\\n\\nlet margin = 12;\\nlet xstep = 12;\\nlet ystep = 0.4;\\n\\nfor (let x = margin; x < canvas.width - margin; x += xstep) {\\n  for (let y = margin; y < canvas.height - margin; y += ystep) {\\n    wpoint(x, y);\\n  }\\n}\\n\\ncircle(0.02, 95);\\ncircle(0.05, 90);\\n\\narc(0.05, 85, Math.PI, Math.PI * 2);\\narc(0.05, 80, Math.PI, Math.PI * 2);\\narc(0.05, 75, Math.PI, Math.PI * 2);\\n\\n\\nfunction circle (rstep, radius) {\\n  let x, y;\\n  for (let angle = 0; angle < Math.PI * 2; angle += rstep) {\\n    x = canvas.width / 2 + radius * Math.cos(angle);\\n    y = canvas.height / 2 + radius * Math.sin(angle);\\n\\n    point(x, y);\\n  }\\n}\\n\\nfunction arc(rstep, radius, startAngle, endAngle) {\\n  let x, y;\\n  for (let angle = startAngle; angle < endAngle; angle += rstep) {\\n    x = canvas.width / 2 + radius * Math.cos(angle);\\n    y = canvas.height / 2 + radius * Math.sin(angle);\\n\\n    point(x, y);\\n  }\\n}\\n\\n\\n// stack\\n\\nfunction wpoint(x, y) {\\n  x += Math.random() * xstep / 8;\\n  if (zone(x, y, 100)) return;\\n  point(x, y);\\n}\\n\\nfunction zone(x, y, radius) {\\n  return (x - canvas.width / 2) ** 2 + (y - canvas.height / 2) ** 2 < radius ** 2;\\n}\\n\\n\\n\\n// lib\\n\\nfunction line (x1, y1, x2, y2) {\\n  ctx.beginPath();\\n  ctx.moveTo(x1, y1);\\n  ctx.lineTo(x2, y2);\\n  ctx.stroke();\\n}\\n\\nfunction point (x, y) {\\n  ctx.fillRect(x, y, 1, 1);\\n}\\n\"},{\"top\":660,\"left\":48,\"width\":700,\"height\":400,\"type\":\"prosemirror\",\"content\":\"{\\\"type\\\":\\\"doc\\\",\\\"content\\\":[{\\\"type\\\":\\\"heading\\\",\\\"attrs\\\":{\\\"level\\\":1},\\\"content\\\":[{\\\"type\\\":\\\"text\\\",\\\"text\\\":\\\"Canvas\\\"}]},{\\\"type\\\":\\\"paragraph\\\"}]}\"}]}}"
