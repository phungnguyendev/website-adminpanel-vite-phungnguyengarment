import { App, Form } from 'antd'
import { memo } from 'react'
import SkyModal, { SkyModalProps } from '~/components/sky-ui/SkyModal'
import EditableFormCell from '~/components/sky-ui/SkyTable/EditableFormCell'
import { HeroBanner } from '~/typing'
import { textValidatorInit } from '~/utils/helpers'

interface SkyModalUpdateProps extends SkyModalProps {
  record: HeroBanner
  onUpdate: (data: any) => void
}

const ModalUpdateHeroBanner: React.FC<SkyModalUpdateProps> = ({ record, onUpdate, ...props }) => {
  const { message } = App.useApp()
  const [form] = Form.useForm()

  async function handleOk() {
    await form
      .validateFields()
      .then((values) => {
        onUpdate(values)
      })
      .catch(() => {
        message.error('Error validate form!')
      })
  }

  return (
    <>
      <SkyModal {...props} okText='Save' title={`Update #${record.id}`} onOk={handleOk}>
        <EditableFormCell
          isEditing
          title='Title'
          dataIndex='title'
          inputType='text'
          defaultValue={textValidatorInit(record.title)}
        />
        <EditableFormCell
          isEditing
          title='Images'
          dataIndex='imageUrl'
          inputType='text'
          defaultValue={textValidatorInit(record.imageUrl)}
        />
      </SkyModal>
    </>
  )
}

export default memo(ModalUpdateHeroBanner)
