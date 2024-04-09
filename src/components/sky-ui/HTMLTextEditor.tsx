import React from 'react'
import ReactQuill, { ReactQuillProps } from 'react-quill'
import 'react-quill/dist/quill.snow.css'

export interface HTMLTextEditorProps extends ReactQuillProps {}

const HTMLTextEditor: React.FC<HTMLTextEditorProps> = ({ ...props }) => {
  const modules: { [key: string]: any } = {
    toolbar: [
      [
        {
          header: [1, 2, 3, 4, 5, 6, false]
        }
      ],
      [
        {
          font: []
        }
      ],
      [
        {
          size: []
        }
      ],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
      ['link', 'image', 'video']
    ]
  }

  return (
    <>
      <ReactQuill {...props} theme='snow' modules={modules} />
    </>
  )
}

export default HTMLTextEditor
