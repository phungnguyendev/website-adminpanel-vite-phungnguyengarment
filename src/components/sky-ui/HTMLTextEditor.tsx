import React from 'react'
import ReactQuill, { ReactQuillProps } from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { cn } from '~/utils/helpers'

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
          size: ['small', false, 'large', 'huge']
        }
      ],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
      ['link', 'image', 'video', 'formula']
    ]
  }

  return (
    <>
      <ReactQuill
        {...props}
        placeholder='Compose an epic...'
        theme='snow'
        modules={modules}
        className={cn('', props.className)}
      />
    </>
  )
}

export default HTMLTextEditor
