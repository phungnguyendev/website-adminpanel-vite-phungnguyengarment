import { App as AntApp } from 'antd'
import { useEffect, useState } from 'react'
import { ResponseDataType, defaultRequestBody } from '~/api/client'
import CategoryAPI from '~/api/services/CategoryAPI'
import { UseTableProps } from '~/components/hooks/useTable'
import useAPIService from '~/hooks/useAPIService'
import { Category } from '~/typing'
import { checkFieldToUpdate } from '~/utils/helpers'
import { CategoryTableDataType } from '../type'

export interface CategoryNewRecordProps {
  title?: string | null
  desc?: string | null
  imageUrl?: string | null
}

export default function useCategory(table: UseTableProps<CategoryTableDataType>) {
  const { showDeleted, setLoading, setDataSource, handleConfirmDeleting, handleConfirmCancelEditing } = table

  const categoryService = useAPIService<Category>(CategoryAPI)

  const { message } = AntApp.useApp()

  const [openModal, setOpenModal] = useState<boolean>(false)
  const [searchText, setSearchText] = useState<string>('')
  const [newRecord, setNewRecord] = useState<CategoryNewRecordProps>({})
  const [categories, setCategories] = useState<Category[]>([])

  const loadData = async () => {
    try {
      setLoading(true)
      try {
        await categoryService.getListItems(
          {
            ...defaultRequestBody,
            paginator: { page: categoryService.page, pageSize: -1 },
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
    selfConvertDataSource(categories)
  }, [categories])

  const selfConvertDataSource = (_categories: Category[]) => {
    const items = _categories
    setDataSource(
      items.map((item) => {
        return {
          key: `${item.id}`,
          ...item
        } as CategoryTableDataType
      })
    )
  }

  const handleSaveClick = async (record: CategoryTableDataType) => {
    // const row = (await form.validateFields()) as any
    try {
      setLoading(true)
      console.log(newRecord)
      if (
        checkFieldToUpdate(record.title, newRecord.title) ||
        checkFieldToUpdate(record.desc, newRecord.desc) ||
        checkFieldToUpdate(record.imageUrl, newRecord.imageUrl)
      ) {
        console.log('Category update progressing...')
        await categoryService.updateItemByPk(
          record.id!,
          { title: newRecord.title, desc: newRecord.desc, imageUrl: newRecord.imageUrl },
          setLoading,
          (meta) => {
            if (!meta?.success) {
              throw new Error('API update group failed')
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

  const handleAddNewItem = async (formAddNew: CategoryNewRecordProps) => {
    try {
      console.log(formAddNew)
      setLoading(true)
      await categoryService.createNewItem(formAddNew as Category, setLoading, (meta) => {
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
    item: CategoryTableDataType,
    onDataSuccess?: (meta: ResponseDataType | undefined) => void
  ) => {
    try {
      setLoading(true)
      await categoryService.deleteItemByPk(item.id!, setLoading, (meta) => {
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
      await categoryService.pageChange(
        _page,
        setLoading,
        (meta) => {
          if (meta?.success) {
            selfConvertDataSource(meta?.data as Category[])
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
      await categoryService.sortedListItems(
        checked ? 'asc' : 'desc',
        setLoading,
        (meta) => {
          if (meta?.success) {
            selfConvertDataSource(meta?.data as Category[])
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
        await categoryService.getListItems(
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
              selfConvertDataSource(meta?.data as Category[])
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
    categoryService,
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
