import { useState } from 'react'
import { ResponseDataType } from '~/api/client'
import { RequiredDataType } from '../sky-ui/SkyTable/SkyTable2'

export interface UseTableProps<T extends RequiredDataType> {
  loading: boolean
  setLoading: (state: boolean) => void
  scrollIndex: number
  setScrollIndex: (index: number) => void
  editingKey: string
  setEditingKey: (key: string) => void
  setDeletingKey: (key: string) => void
  deletingKey: string
  showDeleted: boolean
  setDeletedRecordState: (enable: boolean) => void
  dataSource: T[]
  setDataSource: (newDataSource: T[]) => void
  isEditing: (key: string) => boolean
  isDelete: (key: string) => boolean
  handleStartEditing: (key: string) => void
  handleStartDeleting: (key: string) => void
  handleStartRestore: (key: string) => void
  handleStartSaveEditing: (key: string, itemToUpdate: T, onDataSuccess?: (updatedItem: T) => void) => void
  handleStartAddNew: (item: T) => void
  handleConfirmDeleting: (key: string, onDataSuccess?: (deletedItem: T) => void) => void
  handleConfirmRestore: (key: string, onDataSuccess?: (deletedItem: T) => void) => void
  handleConfirmCancelEditing: () => void
  handleConfirmCancelDeleting: () => void
  handleConfirmCancelRestore: () => void
  handleConvertDataSource: (meta: ResponseDataType) => void
}

export default function useTable<T extends RequiredDataType>(initValue: T[]): UseTableProps<T> {
  const [scrollIndex, setScrollIndex] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)
  const [dataSource, setDataSource] = useState<T[]>(initValue)
  const [editingKey, setEditingKey] = useState<string>('')
  const [deletingKey, setDeletingKey] = useState<string>('')
  const [showDeleted, setDeletedRecordState] = useState<boolean>(false)
  const isEditing = (key: string) => key === editingKey
  const isDelete = (key: string) => key === deletingKey

  const handleConvertDataSource = (meta: ResponseDataType) => {
    setLoading(true)
    const items = meta.data as T[]
    setDataSource(
      items.map((item: T) => {
        return {
          ...item,
          key: `${item.id}`
        } as T
      })
    )
    setLoading(false)
  }

  const handleStartEditing = (key: string) => {
    setEditingKey(key)
  }

  const handleStartDeleting = (key: string) => {
    setDeletingKey(key)
  }

  const handleStartRestore = (key: string) => {
    setDeletingKey(key)
  }

  const handleConfirmDeleting = (key: string, onDataSuccess?: (deletedItem: T) => void) => {
    setLoading(true)
    const itemFound = dataSource.find((item) => item.key === key)
    if (itemFound) {
      const dataSourceRemovedItem = dataSource.filter((item) => item.key !== key)
      setDataSource(dataSourceRemovedItem)
      onDataSuccess?.(itemFound)
    }
    setLoading(false)
  }

  const handleConfirmRestore = (key: string, onDataSuccess?: (deletedItem: T) => void) => {
    setLoading(true)
    const itemFound = dataSource.find((item) => item.key === key)
    if (itemFound) {
      const dataSourceRemovedItem = dataSource.filter((item) => item.key !== key)
      setDataSource(dataSourceRemovedItem)
      onDataSuccess?.(itemFound)
    }
    setLoading(false)
  }

  const handleConfirmCancelEditing = () => {
    setEditingKey('')
  }

  const handleConfirmCancelDeleting = () => {
    setDeletingKey('')
  }

  const handleConfirmCancelRestore = () => {
    setDeletingKey('')
  }

  const handleStartSaveEditing = async (key: string, itemToUpdate: T, onDataSuccess?: (updatedItem: T) => void) => {
    try {
      setLoading(true)
      const newData = [...dataSource]
      const index = newData.findIndex((item) => key === item.key)
      if (index > -1) {
        const item = newData[index]
        newData.splice(index, 1, {
          ...item,
          ...itemToUpdate
        })
        setDataSource(newData)
        setEditingKey('')
        onDataSuccess?.(itemToUpdate)
        // After updated local data
        // We need to update on database
      } else {
        newData.push(itemToUpdate)
        setDataSource(newData)
        setEditingKey('')
        onDataSuccess?.(itemToUpdate)
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo)
    } finally {
      setLoading(false)
    }
  }

  const handleStartAddNew = (item: T) => {
    const newDataSource = [...dataSource]
    newDataSource.unshift({
      ...item,
      key: item.key
    } as T)
    setDataSource(newDataSource)
  }

  return {
    loading,
    setLoading,
    showDeleted,
    setDeletedRecordState,
    isDelete,
    isEditing,
    editingKey,
    deletingKey,
    setEditingKey,
    setDeletingKey,
    scrollIndex,
    setScrollIndex,
    dataSource,
    setDataSource,
    handleStartAddNew,
    handleStartEditing,
    handleStartDeleting,
    handleStartRestore,
    handleStartSaveEditing,
    handleConfirmCancelEditing,
    handleConfirmCancelDeleting,
    handleConfirmCancelRestore,
    handleConfirmDeleting,
    handleConfirmRestore,
    handleConvertDataSource
  }
}
