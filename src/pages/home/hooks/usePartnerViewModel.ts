import { App as AntApp } from 'antd'
import { useEffect, useState } from 'react'
import PartnerAPI from '~/api/services/PartnerAPI'
import useTable from '~/components/hooks/useTable'
import define from '~/constants/define'
import useAPIService from '~/hooks/useAPIService'
import { Partner } from '~/typing'
import { NewRecordPartner, PartnerTableDataType } from '../type'

const usePartnerViewModel = () => {
  const { message } = AntApp.useApp()
  const table = useTable<PartnerTableDataType>([])

  const service = useAPIService<Partner>(PartnerAPI)

  const [openModalCreate, setOpenModalCreate] = useState<boolean>(false)
  const [recorded, setRecorded] = useState<Partner>({ id: 0 })
  const [newRecord, setNewRecord] = useState<NewRecordPartner | null>(null)
  const [branches, setPartners] = useState<Partner[]>([])

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
          const data = res.data as Partner[]
          setPartners(data)
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

  const handleCreate = async (itemNew: NewRecordPartner) => {
    try {
      await service.createItemSync({ ...itemNew } as Partner, table.setLoading, (res) => {
        if (!res.success) throw new Error(define('create_failed'))
        const newItem = res.data as Partner
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

  const handleUpdate = async (record: PartnerTableDataType) => {
    try {
      table.setLoading?.(true)
      await service.updateItemByPkSync(record.id!, { ...newRecord }, table.setLoading, (res) => {
        if (!res.success) throw new Error(define('update_failed'))
        const updatedItem = res.data as Partner
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

  const handleDelete = async (record: PartnerTableDataType) => {
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

  const handleDraggableEnd = async (newArr: PartnerTableDataType[]) => {
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

export default usePartnerViewModel
