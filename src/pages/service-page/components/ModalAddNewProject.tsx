import { App, Form } from 'antd'
import React, { memo, useState } from 'react'
import SkyModal, { SkyModalProps } from '~/components/sky-ui/SkyModal'
import EditableFormCell from '~/components/sky-ui/SkyTable/EditableFormCell'
import { Project } from '~/typing'
import { textValidatorChange } from '~/utils/helpers'
import { NewRecordProject } from '../type'

interface Props extends SkyModalProps {
  onCreate: (data: NewRecordProject) => void
}

const ModalAddNewProject: React.FC<Props> = ({ onCreate, ...props }) => {
  const { message } = App.useApp()
  const [form] = Form.useForm()
  const [newRecord, setNewRecord] = useState<Project>({})

  async function handleOk() {
    await form
      .validateFields()
      .then((values) => {
        onCreate(values)
      })
      .catch(() => {
        message.error('Error validate form!')
      })
  }

  return (
    <>
      <SkyModal {...props} title='Add new project' okText='Create' onOk={handleOk}>
        <Form form={form} labelCol={{ span: 4 }}>
          <EditableFormCell
            isEditing
            required
            dataIndex='title'
            title='Title'
            inputType='text'
            value={newRecord.title}
            onValueChange={(val: string) => setNewRecord({ ...newRecord, title: textValidatorChange(val) })}
          />
          <EditableFormCell
            isEditing
            required
            dataIndex='imageUrl'
            title='Image link:'
            inputType='text'
            value={newRecord.imageUrl}
            onValueChange={(value: string) => setNewRecord({ ...newRecord, imageUrl: textValidatorChange(value) })}
          />
          <EditableFormCell
            isEditing
            dataIndex='desc'
            title='Description:'
            inputType='text'
            value={newRecord.imageUrl}
            onValueChange={(value: string) => setNewRecord({ ...newRecord, desc: textValidatorChange(value) })}
          />
        </Form>
      </SkyModal>
    </>
  )
}

export default memo(ModalAddNewProject)
