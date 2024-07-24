import { App as AntApp } from 'antd'
import { useEffect, useState } from 'react'
import HomeProductAPI from '~/api/services/HomeProductAPI'
import useTable from '~/components/hooks/useTable'
import define from '~/constants/define'
import useAPIService from '~/hooks/useAPIService'
import { HomeProduct } from '~/typing'
import { HomeProductTableDataType, NewRecordHomeProduct } from '../type'

const useHomeProductViewModel = () => {
  const { message } = AntApp.useApp()
  const table = useTable<HomeProductTableDataType>([])

  const service = useAPIService<HomeProduct>(HomeProductAPI)

  const [openModalCreate, setOpenModalCreate] = useState<boolean>(false)
  const [newRecord, setNewRecord] = useState<NewRecordHomeProduct | null>(null)
  const [branches, setHomeProducts] = useState<HomeProduct[]>([])

  useEffect(() => {
    initialize()
  }, [])

  const initialize = async () => {
    try {
      await service.getItemsSync(
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
          const data = res.data as HomeProduct[]
          setHomeProducts(data)
          const newDataSource = data.map((item) => {
            return { ...item, key: `${item.id}` }
          })
          table.setDataSource(newDataSource)
        }
      )
    } catch (error) {
      message.error(`${error}`)
    } finally {
      table.setLoading(false)
    }
  }

  const handleCreate = async (itemNew: NewRecordHomeProduct) => {
    try {
      await service.createItemSync({ ...itemNew } as HomeProduct, table.setLoading, (res) => {
        if (!res.success) throw new Error(define('create_failed'))
        const newItem = res.data as HomeProduct
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

  const handleUpdate = async (record: HomeProductTableDataType) => {
    try {
      table.setLoading?.(true)
      await service.updateItemByPkSync(record.id!, { ...newRecord }, table.setLoading, (res) => {
        if (!res.success) throw new Error(define('update_failed'))
        const updatedItem = res.data as HomeProduct
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

  const handleDelete = async (record: HomeProductTableDataType) => {
    try {
      table.setLoading?.(true)
      await service.deleteItemSync(record.id!, table.setLoading, (res) => {
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

  const handleDraggableEnd = async (newArr: HomeProductTableDataType[]) => {
    try {
      await service.updateItemsSync(
        newArr.map((item, index) => {
          return { id: item.id, orderNumber: index + 1 }
        }),
        table.setLoading,
        (res) => {
          if (!res.success) throw new Error(`${res.message}`)
          console.log(res.data)
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
      openModalCreate,
      setOpenModalCreate,
      newRecord,
      setNewRecord,
      branches
    },
    service,
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

export default useHomeProductViewModel
