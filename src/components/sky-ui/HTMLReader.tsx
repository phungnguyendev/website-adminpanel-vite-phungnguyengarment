import 'froala-editor/css/froala_editor.pkgd.min.css'
import 'froala-editor/css/froala_style.min.css'
import 'froala-editor/js/plugins.pkgd.min.js'
import React from 'react'
import FroalaEditorView from 'react-froala-wysiwyg/FroalaEditorView'
// Require Editor CSS files.

export interface HTMLReaderProps {
  htmlString: string
}

const HTMLReader: React.FC<HTMLReaderProps> = ({ htmlString }) => {
  return (
    <>
      <FroalaEditorView model={htmlString} />
    </>
  )
}

export default HTMLReader
