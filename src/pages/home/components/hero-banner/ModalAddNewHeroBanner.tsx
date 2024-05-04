import type { FormProps } from 'antd'
import { Flex, Form } from 'antd'
import React, { memo } from 'react'
import SkyModalWrapper from '~/components/sky-ui/SkyModalWrapper'
import EditableFormCell from '~/components/sky-ui/SkyTable/EditableFormCell'

export interface HeroBannerAddNewProps {
  title?: string | null
  imageUrl?: string | null
}

interface Props {
  openModal: boolean
  loading?: boolean
  formProps?: FormProps
  setOpenModal: (enable: boolean) => void
  onAddNew: (recordToAddNew: HeroBannerAddNewProps) => void
}

const ModalAddNewHeroBanner: React.FC<Props> = ({ loading, onAddNew, openModal, setOpenModal, formProps }) => {
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
        title='Add new banner'
        onCancel={() => setOpenModal(false)}
      >
        <Form {...formProps} labelCol={{ span: 4 }} labelAlign='left' className='w-full' labelWrap form={form}>
          <Flex vertical gap={20} className='w-full'>
            <EditableFormCell
              isEditing={true}
              title='Title'
              placeholder='Type here..'
              dataIndex='title'
              inputType='text'
              required
            />
            <EditableFormCell
              isEditing={true}
              title='Image'
              placeholder='Paste your link image..'
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

export default memo(ModalAddNewHeroBanner)
