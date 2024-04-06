import { App as AntApp } from 'antd'
import { useEffect, useState } from 'react'
import { ResponseDataType, defaultRequestBody } from '~/api/client'
import HeroBannerAPI from '~/api/services/HeroBannerAPI'
import { TableItemWithKey, UseTableProps } from '~/components/hooks/useTable'
import useAPIService from '~/hooks/useAPIService'
import { HeroBannerTableDataType } from '~/pages/home/type'
import { HeroBanner, Product } from '~/typing'
import { ProductAddNewProps } from '../components/herobanner/ModalAddNewHeroBanner'

export interface ProductNewRecordProps {
  colorID?: number | null
  quantityPO?: number | null
  productCode?: string | null
  dateInputNPL?: string | null
  dateOutputFCR?: string | null
  groupID?: number | null
  printID?: number | null
}

export default function useProduct(table: UseTableProps<ProductTableDataType>) {
  const { showDeleted, setLoading, setDataSource, handleConfirmCancelEditing, handleConfirmDeleting } = table

  const heroBannerService = useAPIService<HeroBanner>(HeroBannerAPI)

  const { message } = AntApp.useApp()

  const [openModal, setOpenModal] = useState<boolean>(false)
  const [searchText, setSearchText] = useState<string>('')
  const [newRecord, setNewRecord] = useState<ProductNewRecordProps>({})

  const [heroBanners, setHeroBanners] = useState<HeroBanner[]>([])

  const loadData = async () => {
    try {
      setLoading(true)
      try {
        await heroBannerService.getListItems(
          {
            ...defaultRequestBody,
            paginator: { page: heroBannerService.page, pageSize: defaultRequestBody.paginator?.pageSize },
            filter: { ...defaultRequestBody.filter }
          },
          setLoading,
          (meta) => {
            if (meta?.success) {
              setHeroBanners(meta.data as HeroBanner[])
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

  const selfConvertDataSource = (_heroBanners: HeroBanner[]) => {
    const items = _heroBanners
    setDataSource(
      items.map((item) => {
        return {
          key: item.id,
          ...item
        } as HeroBannerTableDataType
      })
    )
  }

  const handleSaveClick = async (record: TableItemWithKey<ProductTableDataType>) => {
    // const row = (await form.validateFields()) as any
    try {
      setLoading(true)
    } catch (error: any) {
      const resError: ResponseDataType = error.data
      message.error(`${resError.message}`)
    } finally {
      handleConfirmCancelEditing()
      loadData()
      setLoading(false)
    }
  }

  const handleAddNewItem = async (formAddNew: ProductAddNewProps) => {
    try {
      console.log(formAddNew)
      setLoading(true)

      message.success('Success')
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
    item: TableItemWithKey<ProductTableDataType>,
    onDataSuccess?: (meta: ResponseDataType | undefined) => void
  ) => {
    try {
      setLoading(true)
    } catch (error: any) {
      const resError: ResponseDataType = error.data
      message.error(`${resError.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleConfirmRestore = async (
    item: TableItemWithKey<ProductTableDataType>,
    onDataSuccess?: (meta: ResponseDataType | undefined) => void
  ) => {
    try {
      setLoading(true)
    } catch (error: any) {
      const resError: ResponseDataType = error.data
      message.error(`${resError.message}`)
    } finally {
      loadData()
      setLoading(false)
    }
  }

  const handlePageChange = async (_page: number) => {
    try {
      setLoading(true)
      await heroBannerService.pageChange(
        _page,
        setLoading,
        (meta) => {
          if (meta?.success) {
            selfConvertDataSource(meta?.data as Product[])
          }
        },
        { field: 'productCode', term: searchText }
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
      await heroBannerService.sortedListItems(
        checked ? 'asc' : 'desc',
        setLoading,
        (meta) => {
          if (meta?.success) {
            selfConvertDataSource(meta?.data as Product[])
          }
        },
        { field: 'productCode', term: searchText }
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
        await heroBannerService.getListItems(
          {
            ...defaultRequestBody,
            search: {
              field: 'productCode',
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
    handleSaveClick,
    handleResetClick,
    handleSortChange,
    handleSearch,
    handleAddNewItem,
    handlePageChange,
    handleConfirmDelete,
    handleConfirmRestore,
    selfConvertDataSource,
    handleConfirmCancelEditing
  }
}
