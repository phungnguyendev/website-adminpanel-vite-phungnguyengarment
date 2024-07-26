import { App as AntApp } from 'antd'
import { useEffect, useState } from 'react'
import CategoryAPI from '~/api/services/CategoryAPI'
import ProductAPI from '~/api/services/ProductAPI'
import useTable from '~/components/hooks/useTable'
import define from '~/constants/define'
import useAPIService from '~/hooks/useAPIService'
import { Category, Product } from '~/typing'
import { ProductNewRecord, ProductTableDataType } from '../type'

export default function useProductViewModel() {
  const { message } = AntApp.useApp()
  const table = useTable<ProductTableDataType>([])

  const productService = useAPIService<Product>(ProductAPI)
  const categoryService = useAPIService<Category>(CategoryAPI)

  const [openModalCreate, setOpenModalCreate] = useState<boolean>(false)
  const [recorded, setRecorded] = useState<Product>({ id: 0 })
  const [newRecord, setNewRecord] = useState<ProductNewRecord | null>(null)

  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    initialize()
  }, [])

  const initialize = async () => {
    try {
      await productService.getItemsSync(
        {
          paginator: { page: 1, pageSize: -1 },
          sorting: {
            column: 'orderNumber',
            direction: 'desc'
          }
        },
        table.setLoading,
        (res) => {
          if (!res?.success) throw new Error(`${res?.message}`)
          const data = res.data as Product[]
          table.setDataSource(
            data.map((item) => {
              return { ...item, key: `${item.id}` }
            })
          )
        }
      )
      await categoryService.getItemsSync(
        {
          paginator: { page: 1, pageSize: -1 },
          sorting: {
            column: 'orderNumber',
            direction: 'desc'
          }
        },
        table.setLoading,
        (res) => {
          if (!res?.success) throw new Error(`${res?.message}`)
          const data = res.data as Category[]
          setCategories(data)
        }
      )
    } catch (error) {
      message.error(`${error}`)
    } finally {
      table.setLoading(false)
    }
  }

  const handleCreate = async (itemNew: ProductNewRecord) => {
    try {
      await productService.createItemSync({ ...itemNew }, table.setLoading, (res) => {
        if (!res.success) throw new Error(define('create_failed'))
        const newItem = res.data as Product
        table.handleAddNew({ key: `${newItem.id}`, ...newItem })
      })
      message.success(define('created_success'))
    } catch (error: any) {
      message.error(`${error.message}`)
    } finally {
      table.setLoading?.(false)
      setOpenModalCreate(false)
    }
  }

  const handleUpdate = async (record: ProductTableDataType) => {
    try {
      table.setLoading?.(true)
      await productService.updateItemByPkSync(record.id!, { ...newRecord }, table.setLoading, (res) => {
        if (!res.success) throw new Error(define('update_failed'))
        const updatedItem = res.data as Product
        table.handleUpdate(record.key, { ...updatedItem, key: record.key })
      })
      message.success(define('updated_success'))
    } catch (error) {
      message.error(`${error}`)
    } finally {
      table.setLoading?.(false)
      setNewRecord(null)
    }
  }

  const handleDelete = async (record: ProductTableDataType) => {
    try {
      table.setLoading?.(true)
      await productService.deleteItemSync(record.id!, table.setLoading, (res) => {
        if (!res.success) throw new Error(define('delete_failed'))
        table.handleDeleting(record.key)
      })
      message.success(define('deleted_success'))
    } catch (error) {
      message.error(`${error}`)
    } finally {
      table.setLoading?.(false)
    }
  }

  /**
   * Function query paginator (page and pageSize)
   */
  const handlePageChange = async (page: number, pageSize: number) => {
    table.setPaginator({ page, pageSize })
  }

  const handleDraggableEnd = async (newArr: ProductTableDataType[]) => {
    try {
      await productService.updateItemsSync(
        newArr.map((item, index) => {
          return { id: item.id, orderNumber: index + 1 }
        }),
        table.setLoading,
        (res) => {
          if (!res.success) throw new Error(`${res.message}`)
          message.success(`${res.message}`)
        }
      )
    } catch (error) {
      message.error(`${error}`)
    } finally {
      table.setLoading(false)
    }
  }

  return {
    state: {
      categories,
      openModalCreate,
      setOpenModalCreate,
      newRecord,
      setNewRecord,
      recorded,
      setRecorded
    },
    action: {
      handleCreate,
      handleUpdate,
      handleDelete,
      handlePageChange,
      handleDraggableEnd
    },
    table
  }
}
