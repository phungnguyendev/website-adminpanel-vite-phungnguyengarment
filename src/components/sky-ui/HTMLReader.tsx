import React from 'react'
// Require Editor CSS files.
import 'froala-editor/css/froala_editor.pkgd.min.css'
import 'froala-editor/css/froala_style.min.css'
import FroalaEditorView from 'react-froala-wysiwyg/FroalaEditorView'

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
