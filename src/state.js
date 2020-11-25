export const defaultState = {
  type: "container",
  content: null,
  tags: [],
  source: "",
  autorun: false,
  id: 0,
  parent: null,
  children: [
    {
      type: "prosemirror",
      content: {
        type: "doc",
        content: [
          {
            type: "heading",
            attrs: { level: 1 },
            content: [{ type: "text", text: "Dynamic Behavior" }],
          },
          {
            type: "paragraph",
            content: [
              { type: "text", text: "This code builds the live label." },
            ],
          },
          { type: "horizontal_rule" },
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text:
                  "To redefine this behavior, edit the code to the right, and rerun the lower persistence and assignment code. ",
              },
            ],
          },
        ],
      },
      tags: ["hoverLabel", "hoverStatus"],
      source: "",
      autorun: false,
      id: 1,
      parent: null,
      children: [],
      node: null,
      view: null,
      spec: {
        position: "absolute",
        left: 132,
        top: 204,
        width: 456,
        height: 432,
      },
      display: "",
    },
    {
      type: "codemirror",
      content:
        "let hover = state.get(12);\nwindow.addEventListener('mousemove', hoverIndicator);\nfunction hoverIndicator(event) {\n  let card = getCardFromEvent(event);\n  if (!card) return;\n  hover.node.style.display = 'flex';\n  hover.node.style.alignItems = 'center';\n  hover.node.style.paddingLeft = '0.5rem';\n  hover.node.innerHTML = `${card.id}`;\n}\nfunction getCardFromEvent(event) {\n  let val;\n  try { //event.path includes two elements without classLists\n    val = event.path.find((e) => e.classList.contains('card'));\n  } catch (error) {\n    return false;\n  }\n  let card = root.allChildren().find(e => e.node === val) || root;\n  return card;\n}\n",
      tags: ["hoverLabel", "hoverStatus"],
      source: "",
      autorun: false,
      id: 2,
      parent: null,
      children: [],
      node: null,
      view: null,
      spec: {
        position: "absolute",
        left: 600,
        top: 204,
        width: 504,
        height: 432,
      },
      display: "",
    },
    {
      type: "custom",
      content: null,
      tags: ["viewport"],
      source:
        "let hover = state.get(12);\nwindow.addEventListener('mousemove', hoverIndicator);\nfunction hoverIndicator(event) {\n  let card = getCardFromEvent(event);\n  if (!card) return;\n  hover.node.style.display = 'flex';\n  hover.node.style.alignItems = 'center';\n  hover.node.style.paddingLeft = '0.5rem';\n  hover.node.innerHTML = `${card.id}`;\n}\nfunction getCardFromEvent(event) {\n  let val;\n  try { //event.path includes two elements without classLists\n    val = event.path.find((e) => e.classList.contains('card'));\n  } catch (error) {\n    return false;\n  }\n  let card = root.allChildren().find(e => e.node === val) || root;\n  return card;\n}\n",
      autorun: true,
      id: 12,
      parent: null,
      children: [],
      node: null,
      view: null,
      spec: {
        position: "absolute",
        left: 12,
        top: 12,
        width: 48,
        height: 24,
      },
    },
    {
      type: "codemirror",
      content:
        "let code = state.get(2); //above code\nlet target = state.get(12); //live label card\ntarget.source = code.content;\ntarget.autorun = true;",
      tags: ["hoverLabel", "hoverStatus"],
      source: "",
      autorun: false,
      id: 15,
      parent: null,
      children: [],
      node: null,
      view: null,
      spec: {
        position: "absolute",
        left: 600,
        top: 648,
        width: 504,
        height: 96,
      },
      display: "",
    },
    {
      type: "prosemirror",
      content: {
        type: "doc",
        content: [
          {
            type: "heading",
            attrs: { level: 1 },
            content: [{ type: "text", text: "Persistence" }],
          },
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text:
                  "This card grabs the above code and sets it as the label’s ",
              },
              {
                type: "text",
                marks: [{ type: "code" }],
                text: "source",
              },
              { type: "text", text: ". It also sets the card " },
              {
                type: "text",
                marks: [{ type: "code" }],
                text: "autorun",
              },
              {
                type: "text",
                text:
                  " field to enable this dynamic behavior to persist between sessions.",
              },
            ],
          },
          { type: "paragraph" },
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text:
                  "This demonstrates the behavior defining workflow: edit the first code, make it persistent by running the second code.",
              },
            ],
          },
        ],
      },
      tags: ["hoverLabel", "hoverStatus"],
      source: "",
      autorun: false,
      id: 16,
      parent: null,
      children: [],
      node: null,
      view: null,
      spec: {
        position: "absolute",
        left: 132,
        top: 648,
        width: 456,
        height: 228,
      },
      display: "",
    },
    {
      type: "prosemirror",
      content: {
        type: "doc",
        content: [
          {
            type: "heading",
            attrs: { level: 1 },
            content: [{ type: "text", text: "Association" }],
          },
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text:
                  "Top left is a live label which gives the id of whichever card is under the mouse. This enables accessing cards in code by using the ",
              },
              { type: "text", marks: [{ type: "code" }], text: "id" },
              { type: "text", text: " to key into a Map of all Cards." },
            ],
          },
        ],
      },
      tags: ["hoverLabel", "hoverStatus"],
      source: "",
      autorun: false,
      id: 17,
      parent: null,
      children: [],
      node: null,
      view: null,
      spec: {
        position: "absolute",
        left: 132,
        top: 12,
        width: 684,
        height: 180,
      },
      display: "",
    },
    {
      type: "prosemirror",
      content: {
        type: "doc",
        content: [
          {
            type: "heading",
            attrs: { level: 1 },
            content: [{ type: "text", text: "makeTab" }],
          },
        ],
      },
      tags: ["makeTab"],
      source: "",
      autorun: false,
      id: 58,
      parent: null,
      children: [],
      node: null,
      view: null,
      spec: {
        position: "absolute",
        left: 168,
        top: 12,
        width: 540,
        height: 72,
      },
      display: "",
    },
    {
      type: "codemirror",
      content:
        "// first\nlet id = 78;\nlet tag = 'explainer';\n\nlet button = state.get(id);\nbutton.node.style.display = 'flex';\nbutton.node.style.alignItems = 'center';\nbutton.node.style.paddingLeft = '1rem';\nbutton.node.innerHTML = tag;\nbutton.node.style.cursor = 'pointer';\nbutton.node.style.userSelect = 'none';\n\nbutton.node.onmouseover = (event) => {button.node.style.background = '#eee'}\nbutton.node.onmouseout = (event) => {button.node.style.background = '#fff'}\n\n{\n  let toggle = true;\n\n  button.node.onclick = (event) => {\n    event.preventDefault();\n    root.allChildren().forEach(c => {\n      if (c.tags.includes(tag)) {\n        if(toggle) {\n          c.display = c.node.style.display;\n          c.node.style.display = 'none';\n        }\n        else {\n          c.node.style.display = c.display;\n          delete c.display;\n          c.parent.node.appendChild(c.node);\n        }\n      }\n    })\n    toggle = !toggle;\n  }\n}\n\nbutton.node.onclick(new Event('click')) //hides tab contents on boot",
      tags: ["makeTab"],
      source: "",
      autorun: false,
      id: 60,
      parent: null,
      children: [],
      node: null,
      view: null,
      spec: {
        position: "absolute",
        left: 720,
        top: 96,
        width: 588,
        height: 684,
      },
      display: "",
    },
    {
      type: "codemirror",
      content:
        "// second\nlet ids = [79, 80, 81, 83, 85];\nlet tag = 'explainer';\n\nids.forEach(id => {\n  let card = state.get(id);\n  if(!card.tags.includes(tag)) card.tags.push(tag);\n})",
      tags: ["makeTab"],
      source: "",
      autorun: false,
      id: 61,
      parent: null,
      children: [],
      node: null,
      view: null,
      spec: {
        position: "absolute",
        left: 1320,
        top: 96,
        width: 408,
        height: 180,
      },
      display: "",
    },
    {
      type: "custom",
      content: null,
      tags: [],
      source:
        "let target = 63;\nlet tag = 'hoverStatus';\n\nlet button = state.get(target);\nbutton.node.style.display = 'flex';\nbutton.node.style.alignItems = 'center';\nbutton.node.style.paddingLeft = '1rem';\nbutton.node.innerHTML = tag;\nbutton.node.style.cursor = 'pointer';\nbutton.node.style.userSelect = 'none';\n\nbutton.node.onmouseover = (event) => {button.node.style.background = '#eee'}\nbutton.node.onmouseout = (event) => {button.node.style.background = '#fff'}\n\n{\n  let toggle = true;\n\n  button.node.onclick = (event) => {\n    event.preventDefault();\n    root.allChildren().forEach(c => {\n      if (c.tags.includes(tag)) {\n        if(toggle) {\n          c.display = c.node.style.display;\n          c.node.style.display = 'none';\n        }\n        else {\n          c.node.style.display = c.display;\n          delete c.display;\n          c.parent.node.appendChild(c.node);\n        }\n      }\n    })\n    toggle = !toggle;\n  }\n}\n\nbutton.node.onclick(new Event('click')) //hides tab contents on boot",
      autorun: true,
      id: 63,
      parent: null,
      children: [],
      node: null,
      view: null,
      spec: {
        position: "absolute",
        left: 12,
        top: 84,
        width: 96,
        height: 24,
      },
    },
    {
      type: "codemirror",
      content:
        "// third\nlet button = state.get(78);\nlet source = state.get(60).content;\nbutton.source = source;\nbutton.autorun = true;",
      tags: ["makeTab"],
      source: "",
      autorun: false,
      id: 64,
      parent: null,
      children: [],
      node: null,
      view: null,
      spec: {
        position: "absolute",
        left: 1320,
        top: 288,
        width: 312,
        height: 120,
      },
      display: "",
    },
    {
      type: "custom",
      content: null,
      tags: [],
      source:
        "let target = 67;\nlet tag = 'makeTab';\n\nlet button = state.get(target);\nbutton.node.style.display = 'flex';\nbutton.node.style.alignItems = 'center';\nbutton.node.style.paddingLeft = '1rem';\nbutton.node.innerHTML = tag;\nbutton.node.style.cursor = 'pointer';\nbutton.node.style.userSelect = 'none';\n\nbutton.node.onmouseover = (event) => {button.node.style.background = '#eee'}\nbutton.node.onmouseout = (event) => {button.node.style.background = '#fff'}\n\n{\n  let toggle = true;\n\n  button.node.onclick = (event) => {\n    event.preventDefault();\n    root.allChildren().forEach(c => {\n      if (c.tags.includes(tag)) {\n        if(toggle) {\n          c.display = c.node.style.display;\n          c.node.style.display = 'none';\n        }\n        else {\n          c.node.style.display = c.display;\n          delete c.display;\n          c.parent.node.appendChild(c.node);\n        }\n      }\n    })\n    toggle = !toggle;\n  }\n}\n\nbutton.node.onclick(new Event('click')) //hides tab contents on boot",
      autorun: true,
      id: 67,
      parent: null,
      children: [],
      node: null,
      view: null,
      spec: {
        position: "absolute",
        left: 12,
        top: 120,
        width: 96,
        height: 24,
      },
    },
    {
      type: "prosemirror",
      content: {
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "This is how we make the tabs on the left.",
              },
            ],
          },
          {
            type: "ordered_list",
            attrs: { order: 1 },
            content: [
              {
                type: "list_item",
                content: [
                  {
                    type: "paragraph",
                    content: [
                      {
                        type: "text",
                        text: "Make a small card to be a tab, set its type to ",
                      },
                      {
                        type: "text",
                        marks: [{ type: "code" }],
                        text: "custom",
                      },
                    ],
                  },
                ],
              },
              {
                type: "list_item",
                content: [
                  {
                    type: "paragraph",
                    content: [
                      {
                        type: "text",
                        text:
                          "put its id in the first code card as the id variable",
                      },
                    ],
                  },
                ],
              },
              {
                type: "list_item",
                content: [
                  {
                    type: "paragraph",
                    content: [
                      {
                        type: "text",
                        text:
                          "put the tabs name as the tag variable in the first and second code cards",
                      },
                    ],
                  },
                ],
              },
              {
                type: "list_item",
                content: [
                  {
                    type: "paragraph",
                    content: [
                      {
                        type: "text",
                        text:
                          "put an array of the card ids to make up the tab as the ",
                      },
                      {
                        type: "text",
                        marks: [{ type: "code" }],
                        text: "ids",
                      },
                      {
                        type: "text",
                        text: " variable in the second code card",
                      },
                    ],
                  },
                ],
              },
              {
                type: "list_item",
                content: [
                  {
                    type: "paragraph",
                    content: [
                      {
                        type: "text",
                        text:
                          "run the code cards in order: first, second, third",
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      tags: ["makeTab"],
      source: "",
      autorun: false,
      id: 70,
      parent: null,
      children: [],
      node: null,
      view: null,
      spec: {
        position: "absolute",
        left: 168,
        top: 96,
        width: 540,
        height: 276,
      },
      display: "",
    },
    {
      type: "custom",
      content: null,
      tags: [],
      source:
        "// first\nlet id = 72;\nlet tag = 'editor';\n\nlet button = state.get(id);\nbutton.node.style.display = 'flex';\nbutton.node.style.alignItems = 'center';\nbutton.node.style.paddingLeft = '1rem';\nbutton.node.innerHTML = tag;\nbutton.node.style.cursor = 'pointer';\nbutton.node.style.userSelect = 'none';\n\nbutton.node.onmouseover = (event) => {button.node.style.background = '#eee'}\nbutton.node.onmouseout = (event) => {button.node.style.background = '#fff'}\n\n{\n  let toggle = true;\n\n  button.node.onclick = (event) => {\n    event.preventDefault();\n    root.allChildren().forEach(c => {\n      if (c.tags.includes(tag)) {\n        if(toggle) {\n          c.display = c.node.style.display;\n          c.node.style.display = 'none';\n        }\n        else {\n          c.node.style.display = c.display;\n          delete c.display;\n          c.parent.node.appendChild(c.node);\n        }\n      }\n    })\n    toggle = !toggle;\n  }\n}\n\nbutton.node.onclick(new Event('click')) //hides tab contents on boot",
      autorun: true,
      id: 72,
      parent: null,
      children: [],
      node: null,
      view: null,
      spec: {
        position: "absolute",
        left: 12,
        top: 156,
        width: 96,
        height: 24,
      },
    },
    {
      type: "prosemirror",
      content: {
        type: "doc",
        content: [
          {
            type: "heading",
            attrs: { level: 1 },
            content: [{ type: "text", text: "Editor" }],
          },
        ],
      },
      tags: ["editor"],
      source: "",
      autorun: false,
      id: 73,
      parent: null,
      children: [],
      node: null,
      view: null,
      spec: {
        position: "absolute",
        left: 228,
        top: 12,
        width: 408,
        height: 72,
      },
      display: "",
    },
    {
      type: "codemirror",
      content: "",
      tags: ["editor"],
      source: "",
      autorun: false,
      id: 74,
      parent: null,
      children: [],
      node: null,
      view: null,
      spec: {
        position: "absolute",
        left: 228,
        top: 96,
        width: 408,
        height: 492,
      },
      display: "",
    },
    {
      type: "inspector",
      content: null,
      tags: ["editor"],
      source: "",
      autorun: false,
      id: 76,
      parent: null,
      children: [],
      node: null,
      view: null,
      spec: {
        position: "absolute",
        left: 228,
        top: 600,
        width: 408,
        height: 288,
      },
      display: "",
    },
    {
      type: "custom",
      content: null,
      tags: [],
      source:
        "// first\nlet id = 77;\nlet tag = 'next';\n\nlet button = state.get(id);\nbutton.node.style.display = 'flex';\nbutton.node.style.alignItems = 'center';\nbutton.node.style.paddingLeft = '1rem';\nbutton.node.innerHTML = tag;\nbutton.node.style.cursor = 'pointer';\nbutton.node.style.userSelect = 'none';\n\nbutton.node.onmouseover = (event) => {button.node.style.background = '#eee'}\nbutton.node.onmouseout = (event) => {button.node.style.background = '#fff'}\n\n{\n  let toggle = true;\n\n  button.node.onclick = (event) => {\n    event.preventDefault();\n    root.allChildren().forEach(c => {\n      if (c.tags.includes(tag)) {\n        if(toggle) {\n          c.display = c.node.style.display;\n          c.node.style.display = 'none';\n        }\n        else {\n          c.node.style.display = c.display;\n          delete c.display;\n          c.parent.node.appendChild(c.node);\n        }\n      }\n    })\n    toggle = !toggle;\n  }\n}\n\nbutton.node.onclick(new Event('click')) //hides tab contents on boot",
      autorun: true,
      id: 77,
      parent: null,
      children: [],
      node: null,
      view: null,
      spec: {
        position: "absolute",
        left: 12,
        top: 192,
        width: 96,
        height: 24,
      },
    },
    {
      type: "custom",
      content: null,
      tags: [],
      source:
        "// first\nlet id = 78;\nlet tag = 'explainer';\n\nlet button = state.get(id);\nbutton.node.style.display = 'flex';\nbutton.node.style.alignItems = 'center';\nbutton.node.style.paddingLeft = '1rem';\nbutton.node.innerHTML = tag;\nbutton.node.style.cursor = 'pointer';\nbutton.node.style.userSelect = 'none';\n\nbutton.node.onmouseover = (event) => {button.node.style.background = '#eee'}\nbutton.node.onmouseout = (event) => {button.node.style.background = '#fff'}\n\n{\n  let toggle = true;\n\n  button.node.onclick = (event) => {\n    event.preventDefault();\n    root.allChildren().forEach(c => {\n      if (c.tags.includes(tag)) {\n        if(toggle) {\n          c.display = c.node.style.display;\n          c.node.style.display = 'none';\n        }\n        else {\n          c.node.style.display = c.display;\n          delete c.display;\n          c.parent.node.appendChild(c.node);\n        }\n      }\n    })\n    toggle = !toggle;\n  }\n}\n\nbutton.node.onclick(new Event('click')) //hides tab contents on boot",
      autorun: true,
      id: 78,
      parent: null,
      children: [],
      node: null,
      view: null,
      spec: {
        position: "absolute",
        left: 12,
        top: 48,
        width: 96,
        height: 24,
      },
    },
    {
      type: "prosemirror",
      content: {
        type: "doc",
        content: [
          {
            type: "heading",
            attrs: { level: 1 },
            content: [{ type: "text", text: "Workshop" }],
          },
        ],
      },
      tags: ["explainer"],
      source: "",
      autorun: false,
      id: 79,
      parent: null,
      children: [],
      node: null,
      view: null,
      spec: {
        position: "absolute",
        left: 132,
        top: 12,
        width: 204,
        height: 72,
      },
    },
    {
      type: "prosemirror",
      content: {
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "A canvas based programming environment",
              },
            ],
          },
        ],
      },
      tags: ["explainer"],
      source: "",
      autorun: false,
      id: 80,
      parent: null,
      children: [],
      node: null,
      view: null,
      spec: {
        position: "absolute",
        left: 348,
        top: 36,
        width: 336,
        height: 48,
      },
    },
    {
      type: "prosemirror",
      content: {
        type: "doc",
        content: [
          {
            type: "heading",
            attrs: { level: 1 },
            content: [{ type: "text", text: "Controls" }],
          },
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text:
                  "Control+click+drag on the grid background: makes a new Card.",
              },
            ],
          },
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text:
                  "Right click + drag a card: moves or resizes that card depending if you grab the middle or near an edge.",
              },
            ],
          },
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text:
                  "Right click a card: opens an Assign menu to set the card type or remove.",
              },
            ],
          },
          { type: "horizontal_rule" },
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "All cards have an ID and are accessible through ",
              },
              {
                type: "text",
                marks: [{ type: "code" }],
                text: "state.get(ID)",
              },
              {
                type: "text",
                text:
                  ". The ID of a Card can be read by hovering over a card and reading the number on the top left label. The label was coded in this workspace, and it’s source is under the “hoverStatus” tab Card on the left. The tabs were also coded in this workspace and can be read in the “makeTab” card.",
              },
            ],
          },
          {
            type: "paragraph",
            content: [
              { type: "text", text: "The tabs toggle their content. " },
            ],
          },
          {
            type: "paragraph",
            content: [
              { type: "text", text: "The three Card types are " },
              {
                type: "text",
                marks: [{ type: "code" }],
                text: "codemirror",
              },
              { type: "text", text: ", " },
              {
                type: "text",
                marks: [{ type: "code" }],
                text: "prosemirror",
              },
              { type: "text", text: " and " },
              {
                type: "text",
                marks: [{ type: "code" }],
                text: "custom",
              },
              {
                type: "text",
                text:
                  ". Codemirror is your code editor, you can right click on it and run its contents. Prosemirror is this content editor and it is a live markdown editor with ",
              },
              {
                type: "text",
                marks: [{ type: "strong" }],
                text: "bold",
              },
              { type: "text", text: ", " },
              {
                type: "text",
                marks: [{ type: "em" }],
                text: "italics",
              },
              { type: "text", text: " and " },
              { type: "text", marks: [{ type: "code" }], text: "code" },
              {
                type: "text",
                text:
                  " along with headers and more. The Custom card is meant to be assigned behavior by programming it in this workspace, as exampled by hoverStatus and makeTab.",
              },
            ],
          },
          { type: "paragraph" },
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text:
                  "Content is saved per-editor on keyup in localStorage. Dynamic behavior can also persist between sessions by assigning code to the ",
              },
              {
                type: "text",
                marks: [{ type: "code" }],
                text: ".source",
              },
              {
                type: "text",
                text: " field of a Card and setting that Card’s ",
              },
              {
                type: "text",
                marks: [{ type: "code" }],
                text: ".autorun",
              },
              { type: "text", text: " field to " },
              { type: "text", marks: [{ type: "code" }], text: "true" },
              {
                type: "text",
                text: ". This can be seen in both hoverStatus and makeTab. ",
              },
            ],
          },
          { type: "paragraph" },
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text:
                  "Many, many features are in the works and this is more of an experiment than a useable workspace, though I have used it for many writing sessions and find that writing in stackable Prosemirror Cards is an enjoyable experience. ",
              },
            ],
          },
          { type: "paragraph" },
          { type: "horizontal_rule" },
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text:
                  "You may need to double click each tab to get it to fully toggle on refresh, this is a bug to be worked out :P",
              },
            ],
          },
          { type: "paragraph" },
        ],
      },
      tags: ["explainer"],
      source: "",
      autorun: false,
      id: 81,
      parent: null,
      children: [],
      node: null,
      view: null,
      spec: {
        position: "absolute",
        left: 132,
        top: 96,
        width: 792,
        height: 756,
      },
    },
    {
      type: "prosemirror",
      content: {
        type: "doc",
        content: [
          {
            type: "heading",
            attrs: { level: 1 },
            content: [{ type: "text", text: "The Card Interface" }],
          },
          {
            type: "paragraph",
            content: [
              { type: "text", text: "Cards are " },
              {
                type: "text",
                marks: [{ type: "code" }],
                text: "absolute",
              },
              { type: "text", text: " positioned " },
              {
                type: "text",
                marks: [{ type: "code" }],
                text: "divs.",
              },
              { type: "text", text: " " },
            ],
          },
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text:
                  "They are organized by the fields to the right and can be nested to create component units.",
              },
            ],
          },
          { type: "paragraph" },
        ],
      },
      tags: ["explainer"],
      source: "",
      autorun: false,
      id: 83,
      parent: null,
      children: [],
      node: null,
      view: null,
      spec: {
        position: "absolute",
        left: 948,
        top: 120,
        width: 528,
        height: 492,
      },
    },
    {
      type: "codemirror",
      content:
        "Card {\n  type : string\n  content : string\n  tags : [string]\n  source : string\n  autorun : boolean\n  id : number\n  parent : Card\n  children : [Card]\n  node : HTMLElement\n  view : EditorView\n}",
      tags: ["explainer"],
      source: "",
      autorun: false,
      id: 85,
      parent: null,
      children: [],
      node: null,
      view: null,
      spec: {
        position: "absolute",
        left: 1488,
        top: 120,
        width: 396,
        height: 492,
      },
    },
  ],
  node: null,
  view: null,
  spec: {
    position: "absolute",
    left: 0,
    top: 0,
    width: 1920,
    height: 1059,
  },
  counter: 86,
};
