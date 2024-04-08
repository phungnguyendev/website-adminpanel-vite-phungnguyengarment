import { App as AntApp } from 'antd'
import { useEffect, useState } from 'react'
import { ResponseDataType, defaultRequestBody } from '~/api/client'
import GoogleDriveAPI from '~/api/services/GoogleDriveAPI'
import ProductAPI from '~/api/services/ProductAPI'
import ProductCategoryAPI from '~/api/services/ProductCategoryAPI'
import { UseTableProps } from '~/components/hooks/useTable'
import useAPIService from '~/hooks/useAPIService'
import { Product, ProductCategory } from '~/typing'
import { ProductTableDataType } from '../type'

export interface ProductNewRecordProps {
  categoryID?: number | null
  title?: string | null
  desc?: string | null
  imageId?: string | null
}

export default function useProduct(table: UseTableProps<ProductTableDataType>) {
  const { showDeleted, setLoading, setDataSource, handleConfirmDeleting, handleConfirmCancelEditing } = table

  const productService = useAPIService<Product>(ProductAPI)
  const productCategoryService = useAPIService<ProductCategory>(ProductCategoryAPI)

  const { message } = AntApp.useApp()

  const [openModal, setOpenModal] = useState<boolean>(false)
  const [searchText, setSearchText] = useState<string>('')
  const [newRecord, setNewRecord] = useState<ProductNewRecordProps>({})
  const [products, setProducts] = useState<Product[]>([])

  const loadData = async () => {
    try {
      setLoading(true)
      try {
        await productService.getListItems(
          {
            ...defaultRequestBody,
            paginator: { page: productService.page, pageSize: -1 },
            filter: { ...defaultRequestBody.filter },
            sorting: { ...defaultRequestBody.sorting, column: 'orderNumber', direction: 'asc' }
          },
          setLoading,
          (meta) => {
            if (meta?.success) {
              setProducts(meta.data as Product[])
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
    selfConvertDataSource(products)
  }, [products])

  const selfConvertDataSource = (_products: Product[]) => {
    const items = _products
    setDataSource(
      items.map((item) => {
        return {
          key: `${item.id}`,
          ...item
        } as ProductTableDataType
      })
    )
  }

  const handleSaveClick = async (record: ProductTableDataType) => {
    // const row = (await form.validateFields()) as any
    try {
      setLoading(true)
      console.log(newRecord)
      if (
        newRecord.title &&
        (newRecord.title !== record.title || newRecord.desc !== record.desc || newRecord.imageId !== record.imageId)
      ) {
        console.log('Product update progressing...')
        await productService.updateItemByPk(
          record.id!,
          { title: newRecord.title, desc: newRecord.desc, imageId: newRecord.imageId },
          setLoading,
          (meta) => {
            if (!meta?.success) throw new Error('API update group failed')
            if (newRecord.imageId !== record.imageId) {
              GoogleDriveAPI.deleteFile(record.imageId!).then((res) => {
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

  const handleAddNewItem = async (formAddNew: ProductNewRecordProps) => {
    try {
      console.log(formAddNew)
      setLoading(true)
      await productService.createNewItem({ ...formAddNew } as Product, setLoading, async (meta) => {
        if (!meta?.success) throw new Error('Create failed!')
        const productNew = meta.data as Product
        await productCategoryService.createNewItem(
          { categoryID: formAddNew.categoryID, productID: productNew.id },
          setLoading,
          (meta2) => {
            if (!meta2?.success) throw new Error('Create ProductCategory failed!')
            console.log(meta2)
          }
        )
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
    record: ProductTableDataType,
    onDataSuccess?: (meta: ResponseDataType | undefined) => void
  ) => {
    try {
      setLoading(true)
      await productService.deleteItemByPk(record.id!, setLoading, (meta) => {
        if (!meta?.success) throw new Error('Delete record failed!')
        GoogleDriveAPI.deleteFile(record.imageId!).then((res) => {
          if (!res?.success) throw new Error('Remove old image failed!')
        })
        handleConfirmDeleting(`${record.id}`)
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
      await productService.pageChange(
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
      await productService.sortedListItems(
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
        await productService.getListItems(
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
    productService,
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
