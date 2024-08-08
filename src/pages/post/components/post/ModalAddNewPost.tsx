import { App, Form } from 'antd'
import React, { memo, useState } from 'react'
import HTMLEditor from '~/components/sky-ui/HTMLEditor'
import SkyModal, { SkyModalProps } from '~/components/sky-ui/SkyModal'
import EditableFormCell from '~/components/sky-ui/SkyTable/EditableFormCell'
import { NewRecordPost } from '../../type'

interface Props extends SkyModalProps {
  onCreate: (data: NewRecordPost) => void
}

const ModalAddNewPost: React.FC<Props> = ({ onCreate, ...props }) => {
  const { message } = App.useApp()
  const [form] = Form.useForm()
  const [newRecord, setNewRecord] = useState<NewRecordPost>({})

  async function handleOk() {
    await form
      .validateFields()
      .then((values) => {
        onCreate({ ...values, content: newRecord.content })
      })
      .catch(() => {
        message.error('Error validate form!')
      })
  }

  return (
    <>
      <SkyModal {...props} title='Add new post' okText='Create' onOk={handleOk}>
        <Form form={form} labelCol={{ span: 4 }}>
          <EditableFormCell isEditing required dataIndex='title' title='Title' inputType='text' />
          <EditableFormCell isEditing required dataIndex='imageUrl' title='Image link:' inputType='text' />
          <EditableFormCell isEditing dataIndex='publishedAt' title='Published at:' inputType='dateTimePicker' />
          <HTMLEditor value={newRecord.content ?? ''} onChange={(data) => setNewRecord({ content: data })} />
        </Form>
      </SkyModal>
    </>
  )
}

export default memo(ModalAddNewPost)
