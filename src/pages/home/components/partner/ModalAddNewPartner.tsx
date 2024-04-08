import type { FormProps, UploadFile } from 'antd'
import { App as AntApp, Flex, Form } from 'antd'
import React, { memo, useState } from 'react'
import { ResponseDataType } from '~/api/client'
import GoogleDriveAPI from '~/api/services/GoogleDriveAPI'
import SkyModalWrapper from '~/components/sky-ui/SkyModalWrapper'
import EditableFormCell from '~/components/sky-ui/SkyTable/EditableFormCell'

export interface HomeProductAddNewProps {
  title?: string | null
  imageId?: string | null
}

interface Props {
  openModal: boolean
  loading?: boolean
  formProps?: FormProps
  setOpenModal: (enable: boolean) => void
  onAddNew: (recordToAddNew: HomeProductAddNewProps) => void
}

const ModalAddNewHomeProduct: React.FC<Props> = ({ loading, openModal, onAddNew, setOpenModal, formProps }) => {
  const { message } = AntApp.useApp()
  const [form] = Form.useForm()
  const [file, setFile] = useState<UploadFile>()

  async function handleOk() {
    const row = await form.validateFields()
    onAddNew({
      title: row.title,
      imageId: file?.response.data.id
    })
  }

  async function handleCancel() {
    setOpenModal(false)
    const res = file?.response as ResponseDataType
    if (res.data) {
      await GoogleDriveAPI.deleteFile(res.data.id).then((resDataType) => {
        if (!resDataType?.success) message.error(`${resDataType?.message}`)
      })
    }
  }

  return (
    <>
      <SkyModalWrapper
        loading={loading}
        open={openModal}
        onOk={handleOk}
        onCancel={handleCancel}
        title='Add new partner'
      >
        <Form {...formProps} labelCol={{ span: 4 }} labelAlign='left' className='w-full' labelWrap form={form}>
          <Flex vertical gap={20} className='w-full'>
            <EditableFormCell
              isEditing={true}
              title='Title'
              placeholder='title...'
              dataIndex='title'
              inputType='textarea'
              required
            />
            <EditableFormCell
              uploadProps={{
                onFinish: (info) => setFile(info)
              }}
              isEditing={true}
              title='Image'
              dataIndex='file'
              inputType='uploadFile'
            />
          </Flex>
        </Form>
      </SkyModalWrapper>
    </>
  )
}

export default memo(ModalAddNewHomeProduct)
