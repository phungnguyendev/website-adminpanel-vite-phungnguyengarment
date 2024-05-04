import { App as AntApp } from 'antd'
import { useEffect, useState } from 'react'
import { ResponseDataType, defaultRequestBody } from '~/api/client'
import GoogleDriveAPI from '~/api/services/GoogleDriveAPI'
import HomeProductAPI from '~/api/services/HomeProductAPI'
import { UseTableProps } from '~/components/hooks/useTable'
import useAPIService from '~/hooks/useAPIService'
import { HomeProduct, Product } from '~/typing'
import { HomeProductTableDataType } from '../type'

export interface HomeProductNewRecordProps {
  title?: string | null
  imageUrl?: string | null
}

export default function useHomeProduct(table: UseTableProps<HomeProductTableDataType>) {
  const { showDeleted, setLoading, setDataSource, handleConfirmDeleting, handleConfirmCancelEditing } = table

  const homeProductService = useAPIService<HomeProduct>(HomeProductAPI)

  const { message } = AntApp.useApp()

  const [openModal, setOpenModal] = useState<boolean>(false)
  const [searchText, setSearchText] = useState<string>('')
  const [newRecord, setNewRecord] = useState<HomeProductNewRecordProps>({})
  const [heroBanners, setHomeProducts] = useState<HomeProduct[]>([])

  const loadData = async () => {
    try {
      setLoading(true)
      try {
        await homeProductService.getListItems(
          {
            ...defaultRequestBody,
            paginator: { page: homeProductService.page, pageSize: defaultRequestBody.paginator?.pageSize },
            filter: { ...defaultRequestBody.filter },
            sorting: { ...defaultRequestBody.sorting, column: 'orderNumber', direction: 'asc' }
          },
          setLoading,
          (meta) => {
            if (meta?.success) {
              setHomeProducts(meta.data as HomeProduct[])
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
    selfConvertDataSource(heroBanners)
  }, [heroBanners])

  const selfConvertDataSource = (_heroBanners: HomeProduct[]) => {
    const items = _heroBanners
    setDataSource(
      items.map((item) => {
        return {
          key: `${item.id}`,
          ...item
        } as HomeProductTableDataType
      })
    )
  }

  const handleSaveClick = async (record: HomeProductTableDataType) => {
    // const row = (await form.validateFields()) as any
    try {
      setLoading(true)
      console.log(newRecord)
      if (newRecord.title && (newRecord.title !== record.title || newRecord.imageUrl !== record.imageUrl)) {
        console.log('HomeProduct update progressing...')
        await homeProductService.updateItemByPk(
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

  const handleAddNewItem = async (formAddNew: HomeProductNewRecordProps) => {
    try {
      console.log(formAddNew)
      setLoading(true)
      await homeProductService.createNewItem(formAddNew as HomeProduct, setLoading, (meta) => {
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
    item: HomeProductTableDataType,
    onDataSuccess?: (meta: ResponseDataType | undefined) => void
  ) => {
    try {
      setLoading(true)
      await homeProductService.deleteItemByPk(item.id!, setLoading, (meta) => {
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
      await homeProductService.pageChange(
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
      await homeProductService.sortedListItems(
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
        await homeProductService.getListItems(
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
    homeProductService,
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
