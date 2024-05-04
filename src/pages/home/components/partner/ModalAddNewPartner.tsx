import type { FormProps } from 'antd'
import { Flex, Form } from 'antd'
import React, { memo } from 'react'
import SkyModalWrapper from '~/components/sky-ui/SkyModalWrapper'
import EditableFormCell from '~/components/sky-ui/SkyTable/EditableFormCell'

export interface HomeProductAddNewProps {
  title?: string | null
  imageUrl?: string | null
}

interface Props {
  openModal: boolean
  loading?: boolean
  formProps?: FormProps
  setOpenModal: (enable: boolean) => void
  onAddNew: (recordToAddNew: HomeProductAddNewProps) => void
}

const ModalAddNewHomeProduct: React.FC<Props> = ({ loading, openModal, onAddNew, setOpenModal, formProps }) => {
  const [form] = Form.useForm()

  async function handleOk() {
    const row = await form.validateFields()
    onAddNew(row)
  }

  return (
    <>
      <SkyModalWrapper
        loading={loading}
        open={openModal}
        onOk={handleOk}
        onCancel={() => setOpenModal(false)}
        title='Add new partner'
      >
        <Form {...formProps} labelCol={{ span: 4 }} labelAlign='left' className='w-full' labelWrap form={form}>
          <Flex vertical gap={20} className='w-full'>
            <EditableFormCell
              isEditing={true}
              title='Title'
              placeholder='title...'
              dataIndex='title'
              inputType='text'
              required
            />
            <EditableFormCell
              isEditing={true}
              title='Image'
              placeholder='Paste your image link..'
              dataIndex='imageUrl'
              inputType='text'
              required
            />
          </Flex>
        </Form>
      </SkyModalWrapper>
    </>
  )
}

export default memo(ModalAddNewHomeProduct)
