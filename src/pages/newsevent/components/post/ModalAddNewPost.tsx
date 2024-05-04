import type { FormProps } from 'antd'
import { Flex, Form } from 'antd'
import React, { memo, useState } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import SkyModalWrapper from '~/components/sky-ui/SkyModalWrapper'
import EditableFormCell from '~/components/sky-ui/SkyTable/EditableFormCell'

export interface PostAddNewProps {
  title?: string | null
  content?: string | null
  publishedAt?: string | null
  imageUrl?: string | null
}

interface Props {
  openModal: boolean
  formProps?: FormProps
  setOpenModal: (enable: boolean) => void
  onAddNew: (recordToAddNew: PostAddNewProps) => void
}

const ModalAddNewPost: React.FC<Props> = ({ onAddNew, openModal, setOpenModal, formProps }) => {
  const [form] = Form.useForm()
  const [model, setModel] = useState<string>('')

  const handleOk = async () => {
    const row = await form.validateFields()
    onAddNew({ ...row, content: model })
  }

  return (
    <>
      <SkyModalWrapper
        loading={false}
        open={openModal}
        onOk={handleOk}
        onCancel={() => setOpenModal(false)}
        title='Add new post'
      >
        <Form {...formProps} labelCol={{ span: 4 }} labelAlign='left' className='w-full' labelWrap form={form}>
          <Flex vertical gap={20} className='w-full'>
            <EditableFormCell
              isEditing={true}
              title='Title'
              placeholder='Title..'
              dataIndex='title'
              inputType='text'
              required
            />
            <EditableFormCell
              isEditing={true}
              title='Published at'
              placeholder='Published at...'
              dataIndex='publishedAt'
              inputType='dateTimePicker'
              required
            />
            <EditableFormCell
              isEditing={true}
              title='Thumb image'
              dataIndex='imageUrl'
              placeholder='Paste your image link..'
              inputType='text'
              required
            />
            {/* <EditableFormCell
              isEditing={true}
              title='Content'
              placeholder='Content...'
              dataIndex='content'
              inputType='htmlEditor'
              required={model.length <= 0}
              htmlEditorProps={{
                model: model,
                onModelChange: setModel
              }}
            /> */}
            <ReactQuill
              modules={{
                toolbar: [
                  ['bold', 'italic', 'underline', 'strike'], // toggled buttons
                  ['blockquote', 'code-block'],
                  ['link', 'image', 'video', 'formula'],

                  [{ header: 1 }, { header: 2 }], // custom button values
                  [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
                  [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
                  [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
                  [{ direction: 'rtl' }], // text direction

                  [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
                  [{ header: [1, 2, 3, 4, 5, 6, false] }],

                  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
                  [{ font: [] }],
                  [{ align: [] }],

                  ['clean'] // remove formatting button
                ]
              }}
              theme='snow'
              value={model}
              onChange={setModel}
            />
          </Flex>
        </Form>
      </SkyModalWrapper>
    </>
  )
}

export default memo(ModalAddNewPost)
