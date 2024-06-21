import { App as AntApp } from 'antd'
import { useEffect, useState } from 'react'
import { ResponseDataType, defaultRequestBody } from '~/api/client'
import PostAPI from '~/api/services/PostAPI'
import { UseTableProps } from '~/components/hooks/useTable'
import useAPIService from '~/hooks/useAPIService'
import { Post } from '~/typing'
import { checkFieldToUpdate } from '~/utils/helpers'
import { PostTableDataType } from '../type'

export interface PostNewRecordProps {
  title?: string | null
  publishedAt?: string | null
  content?: string | null
  imageUrl?: string | null
}

export default function usePost(table: UseTableProps<PostTableDataType>) {
  const { setLoading, setDataSource, handleConfirmDeleting, handleConfirmCancelEditing } = table

  const postService = useAPIService<Post>(PostAPI)

  const { message } = AntApp.useApp()

  const [openModal, setOpenModal] = useState<boolean>(false)
  const [searchText, setSearchText] = useState<string>('')
  const [newRecord, setNewRecord] = useState<PostNewRecordProps>({})
  const [posts, setPosts] = useState<Post[]>([])

  const loadData = async () => {
    try {
      setLoading(true)
      try {
        await postService.getListItems(
          {
            ...defaultRequestBody,
            paginator: { page: postService.page, pageSize: -1 },
            filter: { ...defaultRequestBody.filter },
            sorting: { ...defaultRequestBody.sorting, column: 'orderNumber', direction: 'asc' }
          },
          setLoading,
          (meta) => {
            if (meta?.success) {
              const _posts = meta.data as Post[]
              setPosts(_posts)
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
    selfConvertDataSource(posts)
  }, [posts])

  const selfConvertDataSource = (_posts: Post[]) => {
    const items = _posts
    setDataSource(
      items.map((item) => {
        return {
          key: `${item.id}`,
          ...item
        } as PostTableDataType
      })
    )
  }

  const handleSaveClick = async (record: PostTableDataType) => {
    // const row = (await form.validateFields()) as any
    try {
      setLoading(true)
      console.log(newRecord)
      if (
        checkFieldToUpdate(record.imageUrl, newRecord.imageUrl) ||
        checkFieldToUpdate(record.title, newRecord.title) ||
        checkFieldToUpdate(record.publishedAt, newRecord.publishedAt) ||
        checkFieldToUpdate(record.content, newRecord.content)
      ) {
        console.log('Product update progressing...')
        await postService.updateItem(record.id!, { ...newRecord }, setLoading, async (meta) => {
          if (!meta?.success) {
            throw new Error('API update group failed')
          }
          message.success(meta.message)
        })
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

  const handleAddNewItem = async (formAddNew: PostNewRecordProps) => {
    try {
      console.log(formAddNew)
      setLoading(true)
      await postService.createItem({ ...formAddNew }, setLoading, async (meta) => {
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
    record: PostTableDataType,
    onDataSuccess?: (meta: ResponseDataType | undefined) => void
  ) => {
    try {
      setLoading(true)
      await postService.deleteItemByPk(record.id!, setLoading, (meta) => {
        if (!meta?.success) throw new Error('Delete record failed!')
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
      await postService.pageChange(
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
      await postService.sortedListItems(
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

  return {
    posts,
    searchText,
    setSearchText,
    openModal,
    loadData,
    newRecord,
    setNewRecord,
    setLoading,
    setOpenModal,
    setDataSource,
    postService,
    handleSaveClick,
    handleResetClick,
    handleSortChange,
    handleAddNewItem,
    handlePageChange,
    handleConfirmDelete,
    selfConvertDataSource,
    handleConfirmCancelEditing
  }
}
