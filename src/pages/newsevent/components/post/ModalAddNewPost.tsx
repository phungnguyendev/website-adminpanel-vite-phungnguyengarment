import type { FormProps, UploadFile } from 'antd'
import { App as AntApp, Flex, Form } from 'antd'
import React, { memo, useState } from 'react'
import { ResponseDataType } from '~/api/client'
import GoogleDriveAPI from '~/api/services/GoogleDriveAPI'
import SkyModalWrapper from '~/components/sky-ui/SkyModalWrapper'
import EditableFormCell from '~/components/sky-ui/SkyTable/EditableFormCell'

export interface PostAddNewProps {
  title?: string | null
  desc?: string | null
  icon?: string | null
}

interface Props {
  openModal: boolean
  formProps?: FormProps
  setOpenModal: (enable: boolean) => void
  onAddNew: (recordToAddNew: PostAddNewProps) => void
}

const ModalAddNewPost: React.FC<Props> = ({ onAddNew, openModal, setOpenModal, formProps }) => {
  const { message } = AntApp.useApp()
  const [form] = Form.useForm()
  const [file, setFile] = useState<UploadFile>()

  async function handleOk() {
    const row = await form.validateFields()
    console.log(row)
    // onAddNew({
    //   title: row.title,
    //   desc: row.desc,
    //   icon: file?.response.data.id
    // })
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
        width={1200}
        loading={false}
        open={openModal}
        onOk={handleOk}
        onCancel={handleCancel}
        title='Add new post'
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
              isEditing={true}
              title='Published at'
              placeholder='Published at...'
              dataIndex='publishedAt'
              inputType='dateTimePicker'
              required
            />
            <EditableFormCell
              uploadProps={{
                onFinish: (info) => setFile(info)
              }}
              isEditing={true}
              title='Thumb image'
              dataIndex='file'
              inputType='uploadFile'
              required
            />
            <EditableFormCell
              isEditing={true}
              title='Content'
              placeholder='Content...'
              dataIndex='content'
              inputType='htmlEditor'
              required
            />
          </Flex>
        </Form>
      </SkyModalWrapper>
    </>
  )
}

export default memo(ModalAddNewPost)
