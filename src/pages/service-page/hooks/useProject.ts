import { App as AntApp } from 'antd'
import { useEffect, useState } from 'react'
import { ResponseDataType, defaultRequestBody } from '~/api/client'
import GoogleDriveAPI from '~/api/services/GoogleDriveAPI'
import ProjectAPI from '~/api/services/ProjectAPI'
import { UseTableProps } from '~/components/hooks/useTable'
import useAPIService from '~/hooks/useAPIService'
import { Product, Project } from '~/typing'
import { ProjectTableDataType } from '../type'

export interface ProjectNewRecordProps {
  title?: string | null
  desc?: string | null
  imageUrl?: string | null
}

export default function useProject(table: UseTableProps<ProjectTableDataType>) {
  const { showDeleted, setLoading, setDataSource, handleConfirmDeleting, handleConfirmCancelEditing } = table

  const projectService = useAPIService<Project>(ProjectAPI)

  const { message } = AntApp.useApp()

  const [openModal, setOpenModal] = useState<boolean>(false)
  const [searchText, setSearchText] = useState<string>('')
  const [newRecord, setNewRecord] = useState<ProjectNewRecordProps>({})
  const [prizes, setProjects] = useState<Project[]>([])

  const loadData = async () => {
    try {
      setLoading(true)
      try {
        await projectService.getListItems(
          {
            ...defaultRequestBody,
            paginator: { page: projectService.page, pageSize: -1 },
            filter: { ...defaultRequestBody.filter },
            sorting: { ...defaultRequestBody.sorting, column: 'orderNumber', direction: 'asc' }
          },
          setLoading,
          (meta) => {
            if (meta?.success) {
              setProjects(meta.data as Project[])
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
    selfConvertDataSource(prizes)
  }, [prizes])

  const selfConvertDataSource = (_prizes: Project[]) => {
    const items = _prizes
    setDataSource(
      items.map((item) => {
        return {
          key: `${item.id}`,
          ...item
        } as ProjectTableDataType
      })
    )
  }

  const handleSaveClick = async (record: ProjectTableDataType) => {
    // const row = (await form.validateFields()) as any
    try {
      setLoading(true)
      console.log(newRecord)
      if (
        newRecord.title &&
        (newRecord.title !== record.title || newRecord.desc !== record.desc || newRecord.imageUrl !== record.imageUrl)
      ) {
        console.log('Project update progressing...')
        await projectService.updateItem(
          record.id!,
          { title: newRecord.title, desc: newRecord.desc, imageUrl: newRecord.imageUrl },
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

  const handleAddNewItem = async (formAddNew: ProjectNewRecordProps) => {
    try {
      console.log(formAddNew)
      setLoading(true)
      await projectService.createItem(formAddNew as Project, setLoading, (meta) => {
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
    item: ProjectTableDataType,
    onDataSuccess?: (meta: ResponseDataType | undefined) => void
  ) => {
    try {
      setLoading(true)
      await projectService.deleteItemByPk(item.id!, setLoading, (meta) => {
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
      await projectService.pageChange(
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
      await projectService.sortedListItems(
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
        await projectService.getListItems(
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
    projectService,
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
