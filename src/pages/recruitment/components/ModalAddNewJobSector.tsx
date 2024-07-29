import { App, Form } from 'antd'
import React, { memo } from 'react'
import SkyModal, { SkyModalProps } from '~/components/sky-ui/SkyModal'
import EditableFormCell from '~/components/sky-ui/SkyTable/EditableFormCell'
import { JobSectorNewRecord } from '../type'

interface Props extends SkyModalProps {
  onCreate: (data: JobSectorNewRecord) => void
}

const ModalAddNewRecruitment: React.FC<Props> = ({ onCreate, ...props }) => {
  const { message } = App.useApp()
  const [form] = Form.useForm()

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
      <SkyModal {...props} title='Add new job sector' okText='Create' onOk={handleOk}>
        <Form form={form} labelCol={{ span: 4 }}>
          <EditableFormCell
            isEditing
            required
            dataIndex='title'
            title='Title'
            placeholder='Công nhân,..'
            inputType='text'
          />
        </Form>
      </SkyModal>
    </>
  )
}

export default memo(ModalAddNewRecruitment)
