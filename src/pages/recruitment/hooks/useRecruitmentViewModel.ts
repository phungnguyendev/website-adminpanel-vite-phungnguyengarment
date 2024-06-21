import { App as AntApp } from 'antd'
import { useEffect, useState } from 'react'
import { ResponseDataType, defaultRequestBody } from '~/api/client'
import BranchAPI from '~/api/services/BranchAPI'
import IndustrySectorAPI from '~/api/services/IndustrySectorAPI'
import RecruitmentAPI from '~/api/services/RecruitmentAPI'
import useTable from '~/components/hooks/useTable'
import useAPIService from '~/hooks/useAPIService'
import { Branch, IndustrySector, RecruitmentPost } from '~/typing'
import { RecruitmentTableDataType } from '../type'

interface NewRecord {
  industrySectorID?: number | null
  vacancies?: string | null
  quantity?: string | null
  wage?: string | null
  workingTime?: string | null
  workingPlace?: string | null
  expirationDate?: string | null
}

const useRecruitmentViewModel = () => {
  // Init
  const table = useTable<RecruitmentTableDataType>([])
  const { setLoading } = table

  // App
  const { message } = AntApp.useApp()

  // Service APIs
  const recruitmentService = useAPIService<RecruitmentPost>(RecruitmentAPI)
  const industrySectorService = useAPIService<IndustrySector>(IndustrySectorAPI)
  const branchService = useAPIService<Branch>(BranchAPI)

  // State
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [searchText, setSearchText] = useState<string>('')
  const [newRecord, setNewRecord] = useState<NewRecord>({})
  const [recruitmentPosts, setRecruitmentPosts] = useState<RecruitmentPost[]>([])
  const [industrySectors, setIndustrySectors] = useState<IndustrySector[]>([])
  const [branches, setBranches] = useState<Branch[]>([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      await recruitmentService.getListItems(
        {
          ...defaultRequestBody,
          paginator: { page: recruitmentService.page, pageSize: defaultRequestBody.paginator?.pageSize },
          filter: { ...defaultRequestBody.filter },
          sorting: { ...defaultRequestBody.sorting, column: 'orderNumber', direction: 'asc' }
        },
        setLoading,
        (meta) => {
          if (!meta?.success) throw new Error(`${meta?.message}`)
          setRecruitmentPosts(meta.data as RecruitmentPost[])
        }
      )
      await industrySectorService.getListItems(
        {
          ...defaultRequestBody,
          paginator: { page: recruitmentService.page, pageSize: defaultRequestBody.paginator?.pageSize },
          filter: { ...defaultRequestBody.filter },
          sorting: { ...defaultRequestBody.sorting, column: 'orderNumber', direction: 'asc' }
        },
        setLoading,
        (meta) => {
          if (!meta?.success) throw new Error(`${meta?.message}`)
          setIndustrySectors(meta.data as IndustrySector[])
        }
      )
      await branchService.getListItems(
        {
          ...defaultRequestBody,
          paginator: { page: recruitmentService.page, pageSize: defaultRequestBody.paginator?.pageSize },
          filter: { ...defaultRequestBody.filter },
          sorting: { ...defaultRequestBody.sorting, column: 'orderNumber', direction: 'asc' }
        },
        setLoading,
        (meta) => {
          if (!meta?.success) throw new Error(`${meta?.message}`)
          setBranches(meta.data as Branch[])
        }
      )
    } catch (error) {
      message.error(`${error}`)
    } finally {
      setLoading(false)
    }
  }

  const onCreate = async (itemNew: RecruitmentPost) => {
    try {
      console.log(itemNew)
      // setLoading(true)
      // await recruitmentService.createItem(formAddNew as RecruitmentPost, setLoading, (meta) => {
      //   if (!meta?.success) throw new Error('Create failed!')
      //   message.success('Success')
      // })
    } catch (error: any) {
      const resError: ResponseDataType = error.data
      message.error(`${resError.message}`)
    } finally {
      setOpenModal(false)
      loadData()
      setLoading(false)
    }
  }

  const onUpdate = (itemUpdate: RecruitmentPost) => {}

  const onDelete = (itemDelete: RecruitmentPost) => {}

  const onSearch = () => {}

  const onSort = () => {}

  const onPage = (page: number, pageSize: number) => {}

  return {
    state: { searchText, setSearchText, openModal, newRecord, setNewRecord, setOpenModal, industrySectors, branches },
    service: {
      recruitmentService,
      industrySectorService,
      branchService
    },
    action: { loadData, onCreate, onUpdate, onDelete, onSearch, onSort, onPage },
    table
  }
}

export default useRecruitmentViewModel
