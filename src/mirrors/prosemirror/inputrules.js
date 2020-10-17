// https://github.com/ProseMirror/prosemirror-example-setup/blob/master/src/inputrules.js
import {InputRule, inputRules, wrappingInputRule, textblockTypeInputRule,
        smartQuotes, emDash, ellipsis} from "prosemirror-inputrules"

// https://discuss.prosemirror.net/t/input-rules-for-wrapping-marks/537/10
function markInputRule(regexp, markType, getAttrs) {
  return new InputRule(regexp, (state, match, start, end) => {
    let attrs = getAttrs instanceof Function ? getAttrs(match) : getAttrs
    let tr = state.tr
    if (match[1]) {
      let textStart = start + match[0].indexOf(match[1])
      let textEnd = textStart + match[1].length
      if (textEnd < end) tr.delete(textEnd, end)
      if (textStart > start) tr.delete(start, textStart)
      end = start + match[1].length
    }
    tr.addMark(start, end, markType.create(attrs))
    tr.removeStoredMark(markType) // Do not continue with mark.
    return tr
  })
}

// : (NodeType, number) → InputRule
// Given a blockquote node type, returns an input rule that turns `"> "`
// at the start of a textblock into a blockquote.
export function blockQuoteRule(nodeType) {
  return wrappingInputRule(/^\s*>\s$/, nodeType)
}

// Given a list node type, returns an input rule that turns a number
// followed by a dot at the start of a textblock into an ordered list.
export function orderedListRule(nodeType) {
  return wrappingInputRule(/^(\d+)\.\s$/, nodeType, match => ({order: +match[1]}),
                           (match, node) => node.childCount + node.attrs.order == +match[1])
}

// Given a list node type, returns an input rule that turns a bullet
// (dash, plush, or asterisk) at the start of a textblock into a
// bullet list.
export function bulletListRule(nodeType) {
  return wrappingInputRule(/^\s*([-+*])\s$/, nodeType)
}

// Given a code block node type, returns an input rule that turns a
// textblock starting with three backticks into a code block.
export function codeBlockRule(nodeType) {
  return textblockTypeInputRule(/^```$/, nodeType)
}

// Given a node type and a maximum level, creates an input rule that
// turns up to that number of `#` characters followed by a space at
// the start of a textblock into a heading whose level corresponds to
// the number of `#` signs.
export function headingRule(nodeType, maxLevel) {
  return textblockTypeInputRule(new RegExp("^(#{1," + maxLevel + "})\\s$"),
                                nodeType, match => ({level: match[1].length}))
}

export function emphasisRule(nodeType) {
  return markInputRule(/\/(\S(?:|.*?\S))\/$/, nodeType)
}

export function strongRule(nodeType) {
  return markInputRule(/\*(\S(?:|.*?\S))\*$/, nodeType)
}

export function underlineRule(nodeType) {
  return markInputRule(/_(\S(?:|.*?\S))_$/, nodeType)
}

export function codeRule(nodeType) {
  return markInputRule(/\`(\S(?:|.*?\S))\`$/, nodeType)
}

// : (Schema) → Plugin
// A set of input rules for creating the basic block quotes, lists,
// code blocks, and heading.
export function buildInputRules(schema) {
  let rules = smartQuotes.concat(ellipsis, emDash), type
  if (type = schema.nodes.blockquote) rules.push(blockQuoteRule(type))
  if (type = schema.nodes.ordered_list) rules.push(orderedListRule(type))
  if (type = schema.nodes.bullet_list) rules.push(bulletListRule(type))
  if (type = schema.nodes.code_block) rules.push(codeBlockRule(type))
  if (type = schema.nodes.heading) rules.push(headingRule(type, 6))

  if (type = schema.marks.strong) rules.push(strongRule(type))
  if (type = schema.marks.em) rules.push(emphasisRule(type))
  //if (type = schema.marks.underline) rules.push(underlineRule(type))
  if (type = schema.marks.code) rules.push(codeRule(type))
  return inputRules({rules})
}
