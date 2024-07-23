import { App as AntApp } from 'antd'
import { useEffect, useState } from 'react'
import HeroBannerAPI from '~/api/services/HeroBannerAPI'
import useTable from '~/components/hooks/useTable'
import define from '~/constants/define'
import useAPIService from '~/hooks/useAPIService'
import { HeroBanner } from '~/typing'
import { BannerTableDataType, NewRecordHeroBanner } from '../type'

const useBannerViewModel = () => {
  const { message } = AntApp.useApp()
  const table = useTable<BannerTableDataType>([])

  const service = useAPIService<HeroBanner>(HeroBannerAPI)

  const [openModalCreate, setOpenModalCreate] = useState<boolean>(false)
  const [openModalUpdate, setOpenModalUpdate] = useState<boolean>(false)
  const [recorded, setRecorded] = useState<HeroBanner>({ id: 0 })
  const [newRecord, setNewRecord] = useState<NewRecordHeroBanner | null>(null)
  const [branches, setHeroBanners] = useState<HeroBanner[]>([])

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
            direction: 'asc'
          }
        },
        table.setLoading,
        (res) => {
          if (!res?.success) throw new Error(`${res?.message}`)
          const data = res.data as HeroBanner[]
          setHeroBanners(data)
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

  const handleCreate = async (itemNew: NewRecordHeroBanner) => {
    try {
      await service.createItemSync({ ...itemNew } as HeroBanner, table.setLoading, (res) => {
        if (!res.success) throw new Error(define('create_failed'))
        const newItem = res.data as HeroBanner
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

  const handleUpdate = async (record: BannerTableDataType) => {
    try {
      table.setLoading?.(true)
      await service.updateItemByPkSync(record.id!, { ...newRecord }, table.setLoading, (res) => {
        if (!res.success) throw new Error(define('update_failed'))
        const updatedItem = res.data as HeroBanner
        table.handleUpdate(record.key, { ...updatedItem, key: record.key })
      })
      message.success(define('updated_success'))
    } catch (error) {
      message.error(`${error}`)
    } finally {
      table.setLoading?.(false)
      setOpenModalUpdate(false)
    }
  }

  const handleDelete = async (record: BannerTableDataType) => {
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
      setOpenModalUpdate(false)
    }
  }

  /**
   * Function query paginator (page and pageSize)
   */
  const handlePageChange = async (page: number, pageSize: number) => {
    table.setPaginator({ page, pageSize })
  }

  const handleDraggableEnd = async (newArr: BannerTableDataType[]) => {
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
      openModalCreate,
      setOpenModalCreate,
      newRecord,
      setNewRecord,
      recorded,
      setRecorded,
      openModalUpdate,
      setOpenModalUpdate,
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

export default useBannerViewModel
