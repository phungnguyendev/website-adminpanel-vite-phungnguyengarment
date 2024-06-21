import { DragEndEvent } from '@dnd-kit/core'
import { App as AntApp, UploadFile } from 'antd'
import { useCallback, useEffect, useState } from 'react'
import HomeProductAPI from '~/api/services/HomeProductAPI'
import useTable from '~/components/hooks/useTable'
import useAPIService2 from '~/hooks/useAPIService2'
import { HomeProduct } from '~/typing'
import { textValidator } from '~/utils/helpers'
import { HomeProductTableDataType } from '../type'

interface NewRecord {
  title?: string | null
  images?: UploadFile[] | null
}

const useHomeProductViewModel = () => {
  const { message } = AntApp.useApp()
  const table = useTable<HomeProductTableDataType>([])
  const { setLoading, setDataSource, handleAddNew, handleDeleting, handleEditing, handleDraggableEnd } = table
  const service = useAPIService2<HomeProduct>(HomeProductAPI)
  const [openModalCreate, setOpenModalCreate] = useState<boolean>(false)
  const [openModalUpdate, setOpenModalUpdate] = useState<boolean>(false)
  const [searchText, setSearchText] = useState<string>('')
  const [recorded, setRecorded] = useState<HomeProduct>({ id: 0 })
  const [newRecord, setNewRecord] = useState<NewRecord>({})
  const [branches, setHomeProducts] = useState<HomeProduct[]>([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      await service.getItemsSync(
        {
          paginator: { page: 1, pageSize: -1 },
          sorting: {
            column: 'orderNumber',
            direction: 'asc'
          }
        },
        setLoading,
        (meta) => {
          if (!meta?.success) throw new Error(`${meta?.message}`)
          const data = meta.data as HomeProduct[]
          setHomeProducts(data)
          const newDataSource = data.map((item) => {
            return { ...item, key: `${item.id}` }
          })
          setDataSource(newDataSource)
        }
      )
    } catch (error) {
      message.error(`${error}`)
    } finally {
      setLoading(false)
    }
  }, [])

  const handleCreate = async (itemNew: HomeProduct, setLoading?: (enable: boolean) => void) => {
    try {
      console.log(itemNew)
      setLoading?.(true)
      if (textValidator(itemNew.title) && textValidator(itemNew.imageName)) {
        await service.createItemSync(itemNew, setLoading, (res) => {
          if (!res?.success) throw new Error(res?.message)
          const newItem = res.data as HomeProduct
          handleAddNew({ ...newItem, key: `${newItem.id}` })
          message.success('Success')
        })
      }
    } catch (error) {
      message.error(`${error}`)
    } finally {
      setLoading?.(false)
      setOpenModalCreate(false)
    }
  }

  const handleUpdate = async (id: number, itemUpdate: HomeProduct, setLoading?: (enable: boolean) => void) => {
    try {
      setLoading?.(true)
      service.updateItemSync(id, itemUpdate, setLoading, (res) => {
        if (!res.success) throw new Error(`${res.message}`)
        handleEditing(`${id}`, { ...itemUpdate, key: `${id}` })
        message.success(`${res.message}`)
      })
    } catch (error) {
      message.error(`${error}`)
    } finally {
      setLoading?.(false)
      setOpenModalUpdate(false)
    }
  }

  const handleDelete = (itemDelete: HomeProduct, setLoading?: (enable: boolean) => void) => {
    try {
      setLoading?.(true)
      service.deleteItemSync(itemDelete.id ?? -1, setLoading, (res) => {
        if (!res.success) throw new Error(`${res.message}`)
        handleDeleting(`${itemDelete.id}`)
        message.success(`${res.message}`)
      })
    } catch (error) {
      message.error(`${error}`)
    } finally {
      setLoading?.(false)
      setOpenModalUpdate(false)
    }
  }

  const handleSearch = () => {}

  const handleSortChange = () => {}

  const handlePageChange = () => {}

  const handleDraggableChange = async (e: DragEndEvent) => {
    try {
      setLoading(true)
      handleDraggableEnd(e, (newData) => {
        service.updateItemsSync(
          newData.map((item, index) => {
            return { ...item, orderNumber: index }
          }),
          setLoading,
          (res) => {
            if (!res.success) throw new Error(`${res.message}`)
            message.success(`${res.message}`)
          }
        )
      })
    } catch (error) {
      message.error(`${error}`)
    } finally {
      setLoading(false)
    }
  }

  return {
    state: {
      searchText,
      setSearchText,
      openModalCreate,
      setOpenModalCreate,
      newRecord,
      setNewRecord,
      recorded,
      setRecorded,
      openModalUpdate,
      setOpenModalUpdate,
      branches
    },
    service,
    action: {
      loadData,
      handleCreate,
      handleUpdate,
      handleDelete,
      handleSearch,
      handleSortChange,
      handlePageChange,
      handleDraggableChange
    },
    table
  }
}

export default useHomeProductViewModel
