// https://prosemirror.net/examples/basic
import {EditorState} from "prosemirror-state"
import {EditorView} from "prosemirror-view"
import {Schema, DOMParser} from "prosemirror-model"
import {schema} from "./schema"
import {addListNodes} from "./schema-list"
// import {exampleSetup} from "prosemirror-example-setup"
import {pmSetup} from "./setup"

const pmSchema = new Schema({
  nodes: addListNodes(schema.spec.nodes, "paragraph block*", "block"),
  marks: schema.spec.marks
})

export {pmSchema}
export {EditorView, EditorState, DOMParser, pmSetup}
