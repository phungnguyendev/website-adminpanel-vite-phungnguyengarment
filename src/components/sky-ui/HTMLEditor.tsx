import { Editor } from '@tinymce/tinymce-react'
import React from 'react'
import appConfig from '~/config/app.config'

export interface HTMLEditorProps {
  defaultValue?: string
  value: string
  onChange: (data: string) => void
}

const HTMLEditor: React.FC<HTMLEditorProps> = ({ ...props }) => {
  return (
    <>
      <Editor
        apiKey={appConfig.tinyMCEApiKey}
        initialValue={props.defaultValue}
        value={props.value}
        onEditorChange={props.onChange}
        init={{
          placeholder: 'Type something..',
          height: 500,
          menubar: true,
          entity_encoding: 'raw',
          mode: 'readonly',
          plugins: [
            'importcss',
            'advlist',
            'autolink',
            'lists',
            'link',
            'image',
            'charmap',
            'preview',
            'anchor',
            'searchreplace',
            'visualblocks',
            'code',
            'fullscreen',
            'insertdatetime',
            'media',
            'table',
            'code',
            'help',
            'wordcount'
          ],
          toolbar:
            'undo redo | accordion accordionremove | blocks fontfamily fontsize | bold italic underline strikethrough | align numlist bullist | link image | table media | lineheight outdent indent| forecolor backcolor removeformat | charmap emoticons | code fullscreen preview | save print | pagebreak anchor codesample | ltr rtl',
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:12pt }'
        }}
      />
    </>
  )
}

export default HTMLEditor
