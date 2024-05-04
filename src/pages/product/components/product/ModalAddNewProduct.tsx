import type { FormProps } from 'antd'
import { Flex, Form } from 'antd'
import React, { memo, useEffect, useState } from 'react'
import { defaultRequestBody } from '~/api/client'
import CategoryAPI from '~/api/services/CategoryAPI'
import SkyModalWrapper from '~/components/sky-ui/SkyModalWrapper'
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
  const [form] = Form.useForm()
  const categoryService = useAPIService<Category>(CategoryAPI)
  const [loading, setLoading] = useState<boolean>(false)
  const [categories, setCategories] = useState<Category[]>([])

  async function handleOk() {
    const row = await form.validateFields()
    onAddNew(row)
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
      <SkyModalWrapper
        loading={loading}
        open={openModal}
        onOk={handleOk}
        onCancel={() => setOpenModal(false)}
        title='Add new product'
      >
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
              placeholder='Title..'
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
              placeholder='Paste your image link..'
              title='Image'
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

export default memo(ModalAddNewProduct)
