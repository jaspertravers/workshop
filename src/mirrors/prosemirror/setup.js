// https://github.com/ProseMirror/prosemirror-example-setup/blob/master/src/index.js
// omitting menu
import {keymap} from "prosemirror-keymap"
import {history} from "prosemirror-history"
import {baseKeymap} from "prosemirror-commands"
import {Plugin} from "prosemirror-state"
import {dropCursor} from "prosemirror-dropcursor"
import {gapCursor} from "prosemirror-gapcursor"

import {buildKeymap} from "./keymap"
import {buildInputRules} from "./inputrules"

//export {buildKeymap, buildInputRules}

export function pmSetup(options) {
  let plugins = [
    buildInputRules(options.schema),
    keymap(buildKeymap(options.schema, options.mapKeys)),
    keymap(baseKeymap),
    dropCursor(),
    gapCursor()
  ]

  if (options.history !== false)
    plugins.push(history())

  return plugins.concat(new Plugin({
    props: {
      attributes: {class: "ProseMirror-setup-style"}
    }
  }))
}
