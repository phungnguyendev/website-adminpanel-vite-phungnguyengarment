import { App as AntApp } from 'antd'
import { useEffect, useState } from 'react'
import { ResponseDataType, defaultRequestBody } from '~/api/client'
import IndustrySectorAPI from '~/api/services/IndustrySectorAPI'
import RecruitmentAPI from '~/api/services/RecruitmentAPI'
import { UseTableProps } from '~/components/hooks/useTable'
import useAPIService from '~/hooks/useAPIService'
import { IndustrySector, Product, RecruitmentPost } from '~/typing'
import { RecruitmentPostTableDataType } from '../type'

export interface RecruitmentPostNewRecordProps extends RecruitmentPost {}

export default function useRecruitment(table: UseTableProps<RecruitmentPostTableDataType>) {
  const { showDeleted, setLoading, setDataSource, handleConfirmDeleting, handleConfirmCancelEditing } = table

  const recruitmentService = useAPIService<RecruitmentPost>(RecruitmentAPI)
  const industrySectorService = useAPIService<IndustrySector>(IndustrySectorAPI)

  const { message } = AntApp.useApp()

  const [openModal, setOpenModal] = useState<boolean>(false)
  const [searchText, setSearchText] = useState<string>('')
  const [newRecord, setNewRecord] = useState<RecruitmentPostNewRecordProps>({})
  const [recruitmentPosts, setRecruitmentPosts] = useState<RecruitmentPost[]>([])
  const [industrySectors, setIndustrySectors] = useState<IndustrySector[]>([])

  const loadData = async () => {
    try {
      setLoading(true)
      try {
        await recruitmentService.getListItems(
          {
            ...defaultRequestBody,
            paginator: { page: recruitmentService.page, pageSize: defaultRequestBody.paginator?.pageSize },
            filter: { ...defaultRequestBody.filter },
            sorting: { ...defaultRequestBody.sorting, column: 'orderNumber', direction: 'asc' }
          },
          setLoading,
          (meta) => {
            if (meta?.success) {
              setRecruitmentPosts(meta.data as RecruitmentPost[])
            }
          }
        )
      } catch (error: any) {
        const resError: ResponseDataType = error
        throw resError
      }
      try {
        await industrySectorService.getListItems(
          {
            ...defaultRequestBody,
            paginator: { page: recruitmentService.page, pageSize: defaultRequestBody.paginator?.pageSize },
            filter: { ...defaultRequestBody.filter },
            sorting: { ...defaultRequestBody.sorting, column: 'orderNumber', direction: 'asc' }
          },
          setLoading,
          (meta) => {
            if (meta?.success) {
              setIndustrySectors(meta.data as IndustrySector[])
            }
          }
        )
      } catch (error: any) {
        const resError: ResponseDataType = error
        throw resError
      }
    } catch (error: any) {
      const resError: ResponseDataType = error.data
      message.error(`${resError.message}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [showDeleted])

  useEffect(() => {
    selfConvertDataSource(recruitmentPosts)
  }, [recruitmentPosts])

  const selfConvertDataSource = (_recruitmentPosts: RecruitmentPost[]) => {
    setDataSource(
      _recruitmentPosts.map((item) => {
        return {
          key: `${item.id}`,
          ...item
        } as RecruitmentPostTableDataType
      })
    )
  }

  const handleSaveClick = async (record: RecruitmentPostTableDataType) => {
    // const row = (await form.validateFields()) as any
    try {
      setLoading(true)
      console.log(newRecord)
      // if (newRecord.title && (newRecord.title !== record.title || newRecord.imageUrl !== record.imageUrl)) {
      //   console.log('RecruitmentPost update progressing...')
      //   await recruitmentPost.updateItem(
      //     record.id!,
      //     { title: newRecord.title, imageUrl: newRecord.imageUrl },
      //     setLoading,
      //     (meta) => {
      //       if (!meta?.success) throw new Error('API update group failed')
      //       if (newRecord.imageUrl !== record.imageUrl) {
      //         GoogleDriveAPI.deleteFile(record.imageUrl!).then((res) => {
      //           if (!res?.success) throw new Error('Remove old image failed!')
      //         })
      //       }
      //       message.success(meta.message)
      //     }
      //   )
      // }
    } catch (error: any) {
      const resError: ResponseDataType = error.data
      message.error(`${resError.message}`)
    } finally {
      handleConfirmCancelEditing()
      loadData()
      setLoading(false)
    }
  }

  const handleAddNewItem = async (formAddNew: RecruitmentPostNewRecordProps) => {
    try {
      console.log(formAddNew)
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

  const handleConfirmDelete = async (
    item: RecruitmentPostTableDataType,
    onDataSuccess?: (meta: ResponseDataType | undefined) => void
  ) => {
    try {
      setLoading(true)
      await recruitmentService.deleteItemByPk(item.id!, setLoading, (meta) => {
        if (!meta?.success) throw new Error('Delete item failed!')
        handleConfirmDeleting(`${item.id}`)
        message.success('Deleted!')
        onDataSuccess?.(meta)
      })
    } catch (error: any) {
      const resError: ResponseDataType = error.data
      message.error(`${resError.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = async (_page: number) => {
    try {
      setLoading(true)
      await recruitmentService.pageChange(
        _page,
        setLoading,
        (meta) => {
          if (meta?.success) {
            selfConvertDataSource(meta?.data as Product[])
          }
        },
        { field: 'id', term: searchText }
      )
    } catch (error: any) {
      const resError: ResponseDataType = error.data
      message.error(`${resError.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleResetClick = async () => {
    setSearchText('')
    loadData()
  }

  const handleSortChange = async (checked: boolean) => {
    try {
      setLoading(true)
      await recruitmentService.sortedListItems(
        checked ? 'asc' : 'desc',
        setLoading,
        (meta) => {
          if (meta?.success) {
            selfConvertDataSource(meta?.data as Product[])
          }
        },
        { field: 'id', term: searchText }
      )
    } catch (error: any) {
      const resError: ResponseDataType = error.data
      message.error(`${resError.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (value: string) => {
    try {
      setLoading(true)
      if (value.length > 0) {
        await recruitmentService.getListItems(
          {
            ...defaultRequestBody,
            search: {
              field: 'id',
              term: value
            }
          },
          setLoading,
          (meta) => {
            if (meta?.success) {
              selfConvertDataSource(meta?.data as Product[])
            }
          }
        )
      }
    } catch (error: any) {
      const resError: ResponseDataType = error.data
      message.error(`${resError.message}`)
    } finally {
      setLoading(false)
    }
  }

  return {
    searchText,
    setSearchText,
    openModal,
    loadData,
    newRecord,
    setNewRecord,
    setLoading,
    setOpenModal,
    setDataSource,
    industrySectors,
    recruitmentService,
    industrySectorService,
    handleSaveClick,
    handleResetClick,
    handleSortChange,
    handleSearch,
    handleAddNewItem,
    handlePageChange,
    handleConfirmDelete,
    selfConvertDataSource,
    handleConfirmCancelEditing
  }
}
