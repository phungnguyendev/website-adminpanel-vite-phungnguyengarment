import type { FormProps } from 'antd'
import { Flex, Form } from 'antd'
import React, { memo } from 'react'
import SkyModal from '~/components/sky-ui/SkyModal'
import EditableFormCell from '~/components/sky-ui/SkyTable/EditableFormCell'

export interface CategoryAddNewProps {
  title?: string | null
  desc?: string | null
  icon?: string | null
}

interface Props {
  openModal: boolean
  formProps?: FormProps
  setOpenModal: (enable: boolean) => void
  onAddNew: (recordToAddNew: CategoryAddNewProps) => void
}

const ModalAddNewCategory: React.FC<Props> = ({ onAddNew, openModal, setOpenModal, formProps }) => {
  const [form] = Form.useForm()

  async function handleOk() {
    const row = await form.validateFields()
    onAddNew(row)
  }

  return (
    <>
      <SkyModal
        loading={false}
        open={openModal}
        onOk={handleOk}
        onCancel={() => setOpenModal(false)}
        title='Add new category'
      >
        <Form {...formProps} labelCol={{ span: 4 }} labelAlign='left' className='w-full' labelWrap form={form}>
          <Flex vertical gap={20} className='w-full'>
            <EditableFormCell
              isEditing={true}
              title='Title'
              placeholder='Title...'
              dataIndex='title'
              inputType='text'
              required
            />
            <EditableFormCell
              isEditing={true}
              title='Description'
              placeholder='Desc...'
              dataIndex='desc'
              inputType='text'
            />
            <EditableFormCell
              isEditing={true}
              title='Image'
              dataIndex='imageUrl'
              inputType='text'
              placeholder='Paste your image link..'
              required
            />
          </Flex>
        </Form>
      </SkyModal>
    </>
  )
}

export default memo(ModalAddNewCategory)
