import { App as AntApp } from 'antd'
import { useEffect, useState } from 'react'
import { defaultRequestBody } from '~/api/client'
import BranchAPI from '~/api/services/BranchAPI'
import useTable from '~/components/hooks/useTable'
import useAPIService from '~/hooks/useAPIService'
import { Branch } from '~/typing'
import { BranchTableDataType } from '../type'

interface NewRecord {
  title?: string | null
}

const useBranchViewModel = () => {
  // Init
  const table = useTable<BranchTableDataType>([])
  const { setLoading, dataSource, setDataSource } = table

  // App
  const { message } = AntApp.useApp()

  // Service APIs
  const branchService = useAPIService<Branch>(BranchAPI)

  // State
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [searchText, setSearchText] = useState<string>('')
  const [newRecord, setNewRecord] = useState<NewRecord>({})
  const [branches, setBranches] = useState<Branch[]>([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      await branchService.getListItems(
        {
          ...defaultRequestBody,
          paginator: { page: branchService.page, pageSize: defaultRequestBody.paginator?.pageSize },
          filter: { ...defaultRequestBody.filter },
          sorting: { ...defaultRequestBody.sorting, column: 'orderNumber', direction: 'asc' }
        },
        setLoading,
        (meta) => {
          if (!meta?.success) throw new Error(`${meta?.message}`)
          const data = meta.data as Branch[]
          setBranches(data)
          setDataSource(
            data.map((item, index) => {
              return { ...item, key: `${index}` }
            })
          )
        }
      )
    } catch (error) {
      message.error(`${error}`)
    } finally {
      setLoading(false)
    }
  }

  const onCreate = async (itemNew: Branch) => {
    try {
      console.log(itemNew)
      setLoading(true)
      await branchService.createNewItem(itemNew, setLoading, (meta) => {
        if (!meta?.success) throw new Error(meta?.message)
        message.success('Success')
      })
    } catch (error) {
      message.error(`${error}`)
    } finally {
      setOpenModal(false)
      loadData()
      setLoading(false)
    }
  }

  const onUpdate = (itemUpdate: Branch) => {}

  const onDelete = (itemDelete: Branch) => {}

  const onSearch = () => {}

  const onSort = () => {}

  const onPage = (page: number, pageSize: number) => {}

  return {
    state: { searchText, setSearchText, openModal, newRecord, setNewRecord, setOpenModal, branches },
    service: {
      branchService
    },
    action: { loadData, onCreate, onUpdate, onDelete, onSearch, onSort, onPage },
    table
  }
}

export default useBranchViewModel
