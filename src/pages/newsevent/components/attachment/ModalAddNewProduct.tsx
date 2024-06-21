import type { FormProps, UploadFile } from 'antd'
import { App as AntApp, Flex, Form } from 'antd'
import React, { memo, useEffect, useState } from 'react'
import { ResponseDataType, defaultRequestBody } from '~/api/client'
import CategoryAPI from '~/api/services/CategoryAPI'
import GoogleDriveAPI from '~/api/services/GoogleDriveAPI'
import SkyModal from '~/components/sky-ui/SkyModal'
import EditableFormCell from '~/components/sky-ui/SkyTable/EditableFormCell'
import useAPIService from '~/hooks/useAPIService'
import { Category } from '~/typing'

export interface ProductAddNewProps {
  categoryID?: number | null
  title?: string | null
  desc?: string | null
  imageUrl?: string | null
}

interface Props {
  openModal: boolean
  formProps?: FormProps
  setOpenModal: (enable: boolean) => void
  onAddNew: (recordToAddNew: ProductAddNewProps) => void
}

const ModalAddNewProduct: React.FC<Props> = ({ onAddNew, openModal, setOpenModal, formProps }) => {
  const { message } = AntApp.useApp()
  const [form] = Form.useForm()
  const categoryService = useAPIService<Category>(CategoryAPI)
  const [file, setFile] = useState<UploadFile>()
  const [loading, setLoading] = useState<boolean>(false)
  const [categories, setCategories] = useState<Category[]>([])

  async function handleOk() {
    const row = await form.validateFields()
    onAddNew({
      categoryID: row.categoryID,
      title: row.title,
      desc: row.desc,
      imageUrl: file?.response.data.id
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

  useEffect(() => {
    const loadData = async () => {
      await categoryService.getListItems(
        { ...defaultRequestBody, paginator: { pageSize: -1, page: 1 } },
        setLoading,
        (meta) => {
          if (meta?.success) {
            setCategories(meta.data as Category[])
          }
        }
      )
    }
    loadData()
  }, [])

  return (
    <>
      <SkyModal loading={loading} open={openModal} onOk={handleOk} onCancel={handleCancel} title='Add new product'>
        <Form {...formProps} labelCol={{ span: 4 }} labelAlign='left' className='w-full' labelWrap form={form}>
          <Flex vertical gap={20} className='w-full'>
            <EditableFormCell
              isEditing={true}
              title='Category:'
              dataIndex='categoryID'
              inputType='select'
              selectProps={{
                options: categories.map((item) => {
                  return {
                    label: item.title,
                    value: item.id,
                    key: item.id
                  }
                })
              }}
            />
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
              title='Description'
              placeholder='Desc...'
              dataIndex='desc'
              inputType='textarea'
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
      </SkyModal>
    </>
  )
}

export default memo(ModalAddNewProduct)
