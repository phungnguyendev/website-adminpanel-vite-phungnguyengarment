import { App as AntApp } from 'antd'
import { useEffect, useState } from 'react'
import { ResponseDataType, defaultRequestBody } from '~/api/client'
import GoogleDriveAPI from '~/api/services/GoogleDriveAPI'
import PartnerAPI from '~/api/services/PartnerAPI'
import { UseTableProps } from '~/components/hooks/useTable'
import useAPIService from '~/hooks/useAPIService'
import { Partner, Product } from '~/typing'
import { PartnerTableDataType } from '../type'

export interface PartnerNewRecordProps {
  title?: string | null
  imageUrl?: string | null
}

export default function usePartner(table: UseTableProps<PartnerTableDataType>) {
  const { showDeleted, setLoading, setDataSource, handleConfirmDeleting, handleConfirmCancelEditing } = table

  const partnerService = useAPIService<Partner>(PartnerAPI)

  const { message } = AntApp.useApp()

  const [openModal, setOpenModal] = useState<boolean>(false)
  const [searchText, setSearchText] = useState<string>('')
  const [newRecord, setNewRecord] = useState<PartnerNewRecordProps>({})
  const [partners, setPartners] = useState<Partner[]>([])

  const loadData = async () => {
    try {
      setLoading(true)
      try {
        await partnerService.getListItems(
          {
            ...defaultRequestBody,
            paginator: { page: partnerService.page, pageSize: defaultRequestBody.paginator?.pageSize },
            filter: { ...defaultRequestBody.filter },
            sorting: { ...defaultRequestBody.sorting, column: 'orderNumber', direction: 'asc' }
          },
          setLoading,
          (meta) => {
            if (meta?.success) {
              setPartners(meta.data as Partner[])
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
    selfConvertDataSource(partners)
  }, [partners])

  const selfConvertDataSource = (_partners: Partner[]) => {
    const items = _partners
    setDataSource(
      items.map((item) => {
        return {
          key: `${item.id}`,
          ...item
        } as PartnerTableDataType
      })
    )
  }

  const handleSaveClick = async (record: PartnerTableDataType) => {
    // const row = (await form.validateFields()) as any
    try {
      setLoading(true)
      console.log(newRecord)
      if (newRecord.title && (newRecord.title !== record.title || newRecord.imageUrl !== record.imageUrl)) {
        console.log('Partner update progressing...')
        await partnerService.updateItemByPk(
          record.id!,
          { title: newRecord.title, imageUrl: newRecord.imageUrl },
          setLoading,
          (meta) => {
            if (!meta?.success) throw new Error('API update group failed')
            if (newRecord.imageUrl !== record.imageUrl) {
              GoogleDriveAPI.deleteFile(record.imageUrl!).then((res) => {
                if (!res?.success) throw new Error('Remove old image failed!')
              })
            }
            message.success(meta.message)
          }
        )
      }
    } catch (error: any) {
      const resError: ResponseDataType = error.data
      message.error(`${resError.message}`)
    } finally {
      handleConfirmCancelEditing()
      loadData()
      setLoading(false)
    }
  }

  const handleAddNewItem = async (formAddNew: PartnerNewRecordProps) => {
    try {
      console.log(formAddNew)
      setLoading(true)
      await partnerService.createNewItem(formAddNew as Partner, setLoading, (meta) => {
        if (!meta?.success) throw new Error('Create failed!')
        message.success('Success')
      })
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
    item: PartnerTableDataType,
    onDataSuccess?: (meta: ResponseDataType | undefined) => void
  ) => {
    try {
      setLoading(true)
      await partnerService.deleteItemByPk(item.id!, setLoading, (meta) => {
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
      await partnerService.pageChange(
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
      await partnerService.sortedListItems(
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
        await partnerService.getListItems(
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
    partnerService,
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
