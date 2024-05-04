import { App as AntApp } from 'antd'
import { useEffect, useState } from 'react'
import { ResponseDataType, defaultRequestBody } from '~/api/client'
import CategoryAPI from '~/api/services/CategoryAPI'
import GoogleDriveAPI from '~/api/services/GoogleDriveAPI'
import ProductAPI from '~/api/services/ProductAPI'
import ProductCategoryAPI from '~/api/services/ProductCategoryAPI'
import { UseTableProps } from '~/components/hooks/useTable'
import useAPIService from '~/hooks/useAPIService'
import { Category, Product, ProductCategory } from '~/typing'
import { checkFieldToUpdate } from '~/utils/helpers'
import { ProductTableDataType } from '../type'

export interface ProductNewRecordProps {
  categoryID?: number | null
  title?: string | null
  desc?: string | null
  imageUrl?: string | null
}

export default function useProduct(table: UseTableProps<ProductTableDataType>) {
  const { showDeleted, setLoading, setDataSource, handleConfirmDeleting, handleConfirmCancelEditing } = table

  const productService = useAPIService<Product>(ProductAPI)
  const categoryService = useAPIService<Category>(CategoryAPI)
  const productCategoryService = useAPIService<ProductCategory>(ProductCategoryAPI)

  const { message } = AntApp.useApp()

  const [openModal, setOpenModal] = useState<boolean>(false)
  const [searchText, setSearchText] = useState<string>('')
  const [newRecord, setNewRecord] = useState<ProductNewRecordProps>({})
  const [categories, setCategories] = useState<Category[]>([])
  const [productCategories, setProductCategories] = useState<ProductCategory[]>([])
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

      try {
        await categoryService.getListItems(
          {
            ...defaultRequestBody,
            paginator: { page: productService.page, pageSize: -1 },
            filter: { ...defaultRequestBody.filter },
            sorting: { ...defaultRequestBody.sorting, column: 'orderNumber', direction: 'asc' }
          },
          setLoading,
          (meta) => {
            if (meta?.success) {
              setCategories(meta.data as Category[])
            }
          }
        )
      } catch (error: any) {
        const resError: ResponseDataType = error
        throw resError
      }

      try {
        await productCategoryService.getListItems(
          {
            ...defaultRequestBody,
            paginator: { page: productService.page, pageSize: -1 },
            filter: { ...defaultRequestBody.filter },
            sorting: { ...defaultRequestBody.sorting, column: 'id', direction: 'asc' }
          },
          setLoading,
          (meta) => {
            if (meta?.success) {
              setProductCategories(meta.data as ProductCategory[])
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
    selfConvertDataSource(products, categories, productCategories)
  }, [products, categories, productCategories])

  const getCategory = (
    _product: Product,
    _categories: Category[],
    _productCategories: ProductCategory[]
  ): Category | undefined => {
    const productCategoryFound = _productCategories.find((productCategory) => productCategory.productID === _product.id)
    const categoryFound = _categories.find((category) => category.id === productCategoryFound?.categoryID)
    return productCategoryFound ? categoryFound : undefined
  }

  const selfConvertDataSource = (
    _products: Product[],
    _categories: Category[],
    _productCategories: ProductCategory[]
  ) => {
    const items = _products
    setDataSource(
      items.map((item) => {
        return {
          key: `${item.id}`,
          ...item,
          category: getCategory(item, _categories, _productCategories)
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
        checkFieldToUpdate(record.title, newRecord.title) ||
        checkFieldToUpdate(record.desc, newRecord.desc) ||
        checkFieldToUpdate(record.imageUrl, newRecord.imageUrl) ||
        checkFieldToUpdate(record.category?.id, newRecord.categoryID)
      ) {
        console.log('Product update progressing...')
        await productService.updateItemByPk(
          record.id!,
          { title: newRecord.title, desc: newRecord.desc, imageUrl: newRecord.imageUrl },
          setLoading,
          async (meta) => {
            if (!meta?.success) {
              throw new Error('API update group failed')
            }
            if (checkFieldToUpdate(record.category?.id, newRecord.categoryID)) {
              await productCategoryService.updateItemBy(
                { field: 'productID', key: Number(record.id) },
                { categoryID: newRecord.categoryID },
                setLoading,
                (meta) => {
                  if (!meta?.success) throw new Error(`Can not update category at now :: ${meta?.message}`)
                }
              )
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
        GoogleDriveAPI.deleteFile(record.imageUrl!).then((res) => {
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
            // selfConvertDataSource(meta?.data as Product[])
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
            // selfConvertDataSource(meta?.data as Product[])
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
              // selfConvertDataSource(meta?.data as Product[])
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
    categories,
    productCategories,
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
