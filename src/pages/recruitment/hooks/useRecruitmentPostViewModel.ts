import { App as AntApp } from 'antd'
import { useEffect, useState } from 'react'
import JobSectorAPI from '~/api/services/JobSectorAPI'
import RecruitmentPostAPI from '~/api/services/RecruitmentPostAPI'
import useTable from '~/components/hooks/useTable'
import define from '~/constants/define'
import useAPIService from '~/hooks/useAPIService'
import { JobSector, RecruitmentPost } from '~/typing'
import { RecruitmentPostNewRecord, RecruitmentPostTableDataType } from '../type'

export default function useRecruitmentPostViewModel() {
  const { message } = AntApp.useApp()
  const table = useTable<RecruitmentPostTableDataType>([])

  const recruitmentService = useAPIService<RecruitmentPost>(RecruitmentPostAPI)
  const jobSectorService = useAPIService<JobSector>(JobSectorAPI)

  const [openModalCreate, setOpenModalCreate] = useState<boolean>(false)
  const [recorded, setRecorded] = useState<RecruitmentPost | null>(null)
  const [newRecord, setNewRecord] = useState<RecruitmentPostNewRecord | null>(null)

  const [jobSectors, setJobSectors] = useState<JobSector[]>([])

  useEffect(() => {
    initialize()
  }, [])

  const initialize = async () => {
    try {
      // Request RecruitmentAPI
      await recruitmentService.getItemsSync(
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
          const data = res.data as RecruitmentPost[]
          const newDataSource = data.map((item) => {
            return { ...item, key: `${item.id}` }
          })
          table.setDataSource(newDataSource)
        }
      )
      // Request JobSectorAPI
      await jobSectorService.getItemsSync(
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
          const data = res.data as JobSector[]
          setJobSectors(data)
        }
      )
    } catch (error) {
      message.error(`${error}`)
    } finally {
      table.setLoading(false)
    }
  }

  const handleCreate = async (itemNew: RecruitmentPostNewRecord) => {
    try {
      await recruitmentService.createItemSync({ ...itemNew } as RecruitmentPost, table.setLoading, (res) => {
        if (!res.success) throw new Error(define('create_failed'))
        const newItem = res.data as RecruitmentPost
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

  const handleUpdate = async (record: RecruitmentPostTableDataType) => {
    try {
      table.setLoading?.(true)
      await recruitmentService.updateItemByPkSync(record.id!, { ...newRecord }, table.setLoading, (res) => {
        if (!res.success) throw new Error(define('update_failed'))
        const updatedItem = res.data as RecruitmentPost
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

  const handleDelete = async (record: RecruitmentPostTableDataType) => {
    try {
      table.setLoading?.(true)
      await recruitmentService.deleteItemSync(record.id!, table.setLoading, (res) => {
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

  const handleDraggableEnd = async (newArr: RecruitmentPostTableDataType[]) => {
    try {
      await recruitmentService.updateItemsSync(
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
      jobSectors
    },
    recruitmentService,
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
