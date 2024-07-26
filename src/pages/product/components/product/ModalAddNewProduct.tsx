import { App, Form, Spin } from 'antd'
import React, { memo, useEffect, useState } from 'react'
import CategoryAPI from '~/api/services/CategoryAPI'
import SkyModal, { SkyModalProps } from '~/components/sky-ui/SkyModal'
import EditableFormCell from '~/components/sky-ui/SkyTable/EditableFormCell'
import define from '~/constants/define'
import useAPIService from '~/hooks/useAPIService'
import { Category, Product } from '~/typing'
import { textValidatorChange } from '~/utils/helpers'
import { ProductNewRecord } from '../../type'

interface Props extends SkyModalProps {
  onCreate: (data: ProductNewRecord) => void
}

const ModalAddNewProduct: React.FC<Props> = ({ onCreate, ...props }) => {
  const { message } = App.useApp()
  const [form] = Form.useForm()

  const categoryService = useAPIService<Category>(CategoryAPI)

  const [loading, setLoading] = useState<boolean>(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [newRecord, setNewRecord] = useState<Product>({})

  useEffect(() => {
    initialize()
  }, [])

  const initialize = async () => {
    try {
      await categoryService.getItemsSync({ paginator: { page: 1, pageSize: -1 } }, setLoading, (res) => {
        if (!res.success) throw new Error(define('dataLoad_failed'))
        setCategories(res.data as Category[])
      })
    } catch (error: any) {
      message.error(`${error.message}`)
    }
  }

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
      <SkyModal {...props} title='Add new product' okText='Create' onOk={handleOk}>
        <Form form={form} labelCol={{ span: 4 }}>
          {loading ? (
            <Spin />
          ) : (
            <EditableFormCell
              isEditing
              required
              dataIndex='categoryID'
              title='Category'
              inputType='select'
              selectProps={{
                options: categories.map((item) => {
                  return {
                    key: `${item.id}`,
                    label: item.title,
                    value: item.id
                  }
                })
              }}
            />
          )}
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
        </Form>
      </SkyModal>
    </>
  )
}

export default memo(ModalAddNewProduct)
