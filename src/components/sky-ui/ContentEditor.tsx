// Require Editor CSS files.
import 'froala-editor/css/froala_editor.pkgd.min.css'
import 'froala-editor/css/froala_style.min.css'

// Import all Froala Editor plugins
// Note: you can import single plugin if needed
import 'froala-editor/js/plugins.pkgd.min.js'

//import Froala component
import React from 'react'
import FroalaEditor, { MyComponentProps } from 'react-froala-wysiwyg'

export interface ContentEditorProps extends MyComponentProps {}

const ContentEditor: React.FC<ContentEditorProps> = ({ ...props }) => {
  return (
    <>
      <FroalaEditor
        {...props}
        tag='div'
        config={{
          Key: '***', //Editor Key
          minHeight: 200,
          pluginsEnabled: [
            'lists',
            'link',
            'image',
            'imageManager',
            'charCounter',
            'fullscreen',
            'lineBreaker',

            'codeBeautifier',
            'codeView',
            'colors',
            'draggable',
            'video',
            'table',
            'emoticons',
            'wordPaste'
          ],

          toolbarButtons: {
            moreText: {
              buttons: ['bold', 'italic', 'underline', 'strikeThrough', 'clearFormatting']
            },

            moreParagraph: {
              buttons: [
                'alignLeft',
                'alignCenter',
                'formatOLSimple',
                'alignRight',
                'alignJustify',
                'formatOL',
                'formatUL',
                'paragraphFormat',
                'paragraphStyle',
                'lineHeight',
                'outdent',
                'indent',
                'quote'
              ]
            },

            moreRich: {
              buttons: ['insertLink', 'insertImage', 'insertVideo', 'insertTable', 'emoticons', 'insertHR']
            },

            moreMisc: {
              buttons: ['undo', 'redo', 'fullscreen', 'selectAll', 'html', 'help'],

              align: 'right',

              buttonsVisible: 2
            }
          }
        }}
      />
    </>
  )
}

export default ContentEditor
