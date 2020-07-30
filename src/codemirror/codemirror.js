//sources:
//
//https://github.com/codemirror/codemirror.next/blob/master/basic-setup/src/basic-setup.ts
//https://codemirror.net/6/docs/ref/#basic-setup
//https://codemirror.net/6/docs/guide/
//
import {keymap, highlightSpecialChars, multipleSelections} from "@codemirror/next/view"
// Extension is a type, ignoring for now.
//import {Extension} from "@codemirror/next/state"
import {history, historyKeymap} from "@codemirror/next/history"
import {foldGutter, foldKeymap} from "@codemirror/next/fold"
import {lineNumbers} from "@codemirror/next/gutter"
import {defaultKeymap} from "@codemirror/next/commands"
import {bracketMatching} from "@codemirror/next/matchbrackets"
import {closeBrackets} from "@codemirror/next/closebrackets"
import {searchKeymap} from "@codemirror/next/search"
import {autocomplete, autocompleteKeymap} from "@codemirror/next/autocomplete"
import {commentKeymap} from "@codemirror/next/comment"
import {rectangularSelection} from "@codemirror/next/rectangular-selection"
import {gotoLineKeymap} from "@codemirror/next/goto-line"
import {highlightActiveLine, highlightSelectionMatches} from "@codemirror/next/highlight-selection"
import {defaultHighlighter} from "@codemirror/next/highlight"
import {lintKeymap} from "@codemirror/next/lint"

import {javascript} from "@codemirror/next/lang-javascript"

export const basicSetup = [
  lineNumbers(),
  highlightSpecialChars(),
  history(),
  foldGutter(),
  multipleSelections(),
  defaultHighlighter,
  bracketMatching(),
  closeBrackets(),
  autocomplete(),
  rectangularSelection(),
  highlightActiveLine(),
  highlightSelectionMatches(),
  keymap([
    ...defaultKeymap,
    ...searchKeymap,
    ...historyKeymap,
    ...foldKeymap,
    ...commentKeymap,
    ...gotoLineKeymap,
    ...autocompleteKeymap,
    ...lintKeymap
  ]),
  javascript()
]

export {EditorView} from "@codemirror/next/view"
export {EditorState} from "@codemirror/next/state"
export const startupDoc = 
`// Hello CodeMirror next
let x = 5;
console.log(x)
// ctrl-enter runs this editor
// open console to see console.log
`
