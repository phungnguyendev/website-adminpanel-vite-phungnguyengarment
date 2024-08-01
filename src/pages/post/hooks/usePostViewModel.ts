import { App as AntApp } from 'antd'
import { useEffect, useState } from 'react'
import PostAPI from '~/api/services/PostAPI'
import useTable from '~/components/hooks/useTable'
import define from '~/constants/define'
import useAPIService from '~/hooks/useAPIService'
import { Post } from '~/typing'
import { NewRecordPost, PostTableDataType } from '../type'

const usePostViewModel = () => {
  const { message } = AntApp.useApp()
  const table = useTable<PostTableDataType>([])

  const service = useAPIService<Post>(PostAPI)

  const [openModalCreate, setOpenModalCreate] = useState<boolean>(false)
  const [openModalReview, setOpenModalReview] = useState<boolean>(false)
  const [newRecord, setNewRecord] = useState<PostTableDataType | null>(null)

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
          const data = res.data as Post[]
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

  const handleCreate = async (itemNew: NewRecordPost) => {
    try {
      await service.createItemSync({ ...itemNew } as Post, table.setLoading, (res) => {
        if (!res.success) throw new Error(define('create_failed'))
        const newItem = res.data as Post
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

  const handleUpdate = async (record: PostTableDataType) => {
    try {
      table.setLoading?.(true)
      await service.updateItemByPkSync(record.id!, { ...record }, table.setLoading, (res) => {
        if (!res.success) throw new Error(define('update_failed'))
        const updatedItem = res.data as Post
        table.handleUpdate(record.key, { ...updatedItem, key: record.key })
      })
      message.success(define('updated_success'))
    } catch (error) {
      message.error(`${error}`)
    } finally {
      table.setLoading?.(false)
      setNewRecord(null)
      setOpenModalReview(false)
    }
  }

  const handleDelete = async (record: PostTableDataType) => {
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

  const handleDraggableEnd = async (newArr: PostTableDataType[]) => {
    try {
      await service.updateItemsSync(
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
      openModalReview,
      setOpenModalReview,
      openModalCreate,
      setOpenModalCreate,
      newRecord,
      setNewRecord
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

export default usePostViewModel
