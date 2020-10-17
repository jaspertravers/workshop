import {EditorState as cmEditorState,
        EditorView as cmEditorView,
        cmSetup} from './codemirror/codemirror.js'
import {EditorState as pmEditorState,
        EditorView as pmEditorView,
        DOMParser, pmSetup, pmSchema} from './prosemirror/prosemirror.js'
import {emptyprose, emptycode} from './emptymirrors.js'


function putCodeMirror(parent, doc=emptycode) {
  let view = new cmEditorView({
    state: cmEditorState.create({
      doc,
      extensions: [cmSetup, cmEditorView.lineWrapping]
    }),
    parent
  })

  // put it in parent's box
  view.dom.style.height = '100%';
  return view;
}

function putProseMirror(parent, docObj=emptyprose) {
  if (docObj === null) docObj = emptyprose; //TODO this is bad code
  let doc = pmSchema.nodeFromJSON(typeof docObj === 'string' ? JSON.parse(docObj) : docObj);

  let view = new pmEditorView(parent, {
    state: pmEditorState.create({
      doc: doc,
      plugins: pmSetup({schema: pmSchema})
    })
  })

  view.dom.style.paddingLeft = '1rem';
  view.dom.style.paddingRight = '0.5rem';

  // put it in parent's box
  view.dom.style.height = '100%';
  view.dom.style.overflow = 'auto';
  return view;
}

export {putProseMirror}
export {putCodeMirror}
