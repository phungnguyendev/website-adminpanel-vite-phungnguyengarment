import { RequestBodyType, ResponseDataType, defaultRequestBody } from '~/api/client'
import useLocalStorage from './useLocalStorage'

export interface ItemWithId2 {
  id?: number
}

export type SortedDirection = 'asc' | 'desc'

export interface APIService2<T extends ItemWithId2> {
  createItem: (itemNew: T, accessToken: string) => Promise<ResponseDataType | undefined>
  getItem: (id: number, accessToken: string) => Promise<ResponseDataType | undefined>
  getItems: (params: RequestBodyType, accessToken: string) => Promise<ResponseDataType | undefined>
  updateItem: (id: number, itemToUpdate: T, accessToken: string) => Promise<ResponseDataType | undefined>
  updateItems: (itemsToUpdate: T[], accessToken: string) => Promise<ResponseDataType | undefined>
  deleteItem: (id: number, accessToken: string) => Promise<ResponseDataType | undefined>
}

export default function useAPIService2<T extends ItemWithId2>(apiService: APIService2<T>) {
  const [accessTokenStored] = useLocalStorage<string>('accessToken', '')

  const createItem = async (
    itemNew: T,
    setLoading?: (enable: boolean) => void
  ): Promise<ResponseDataType | undefined> => {
    try {
      setLoading?.(true)
      return await apiService.createItem(itemNew, accessTokenStored ?? '')
    } catch (err) {
      console.error(err)
    } finally {
      setLoading?.(false)
    }
  }

  const createItemSync = async (
    itemNew: T,
    setLoading?: (enable: boolean) => void,
    onDataSuccess?: (res: ResponseDataType) => void
  ) => {
    try {
      setLoading?.(true)
      await apiService
        .createItem(itemNew, accessTokenStored ?? '')
        .then((res) => {
          if (!res?.success) throw new Error(`${res?.message}`)
          onDataSuccess?.(res)
        })
        .catch((err) => {
          throw new Error(err)
        })
    } catch (err) {
      console.error(err)
    } finally {
      setLoading?.(false)
    }
  }

  const getItem = async (id: number, setLoading?: (enable: boolean) => void): Promise<ResponseDataType | undefined> => {
    try {
      setLoading?.(true)
      return await apiService.getItem(id, accessTokenStored ?? '')
    } catch (err) {
      console.error(err)
    } finally {
      setLoading?.(false)
    }
  }

  const getItemSync = async (
    id: number,
    setLoading?: (enable: boolean) => void,
    onDataSuccess?: (res: ResponseDataType) => void
  ) => {
    try {
      setLoading?.(true)
      const res = await apiService.getItem(id, accessTokenStored ?? '')
      if (!res?.success) throw new Error(`${res?.message}`)
      onDataSuccess?.(res)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading?.(false)
    }
  }

  const getItems = async (
    params: RequestBodyType,
    setLoading?: (enable: boolean) => void
  ): Promise<ResponseDataType | undefined> => {
    try {
      setLoading?.(true)
      const res = await apiService.getItems({ ...defaultRequestBody, ...params }, accessTokenStored ?? '')
      return res
    } catch (err) {
      console.error(err)
    } finally {
      setLoading?.(false)
    }
  }

  const getItemsSync = async (
    params: RequestBodyType,
    setLoading?: (enable: boolean) => void,
    onDataSuccess?: (res: ResponseDataType) => void
  ) => {
    try {
      setLoading?.(true)
      const res = await apiService.getItems({ ...defaultRequestBody, ...params }, accessTokenStored ?? '')
      if (!res?.message) throw new Error(`${res}`)
      onDataSuccess?.(res)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading?.(false)
    }
  }

  const updateItem = async (
    id: number,
    itemToUpdate: T,
    setLoading?: (enable: boolean) => void
  ): Promise<ResponseDataType | undefined> => {
    try {
      setLoading?.(true)
      const meta = await apiService.updateItem(id, itemToUpdate, accessTokenStored ?? '')
      return meta
    } catch (err) {
      console.error(err)
    } finally {
      setLoading?.(false)
    }
  }

  const updateItemSync = async (
    id: number,
    itemToUpdate: T,
    setLoading?: (enable: boolean) => void,
    onDataSuccess?: (data: ResponseDataType) => void
  ) => {
    try {
      setLoading?.(true)
      const res = await apiService.updateItem(id, itemToUpdate, accessTokenStored ?? '')
      if (!res?.success) throw new Error(`${res?.message}`)
      onDataSuccess?.(res)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading?.(false)
    }
  }

  const updateItems = async (
    itemsToUpdate: T[],
    setLoading?: (enable: boolean) => void
  ): Promise<ResponseDataType | undefined> => {
    try {
      setLoading?.(true)
      const meta = await apiService.updateItems(itemsToUpdate, accessTokenStored ?? '')
      return meta
    } catch (err) {
      console.error(err)
    } finally {
      setLoading?.(false)
    }
  }

  const updateItemsSync = async (
    itemsToUpdate: T[],
    setLoading?: (enable: boolean) => void,
    onDataSuccess?: (data: ResponseDataType) => void
  ) => {
    try {
      setLoading?.(true)
      const res = await apiService.updateItems(itemsToUpdate, accessTokenStored ?? '')
      if (!res?.success) throw new Error(`${res?.message}`)
      onDataSuccess?.(res)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading?.(false)
    }
  }

  const deleteItem = async (
    id: number,
    setLoading?: (enable: boolean) => void
  ): Promise<ResponseDataType | undefined> => {
    try {
      setLoading?.(true)
      const res = await apiService.deleteItem(id, accessTokenStored ?? '')
      return res
    } catch (err) {
      console.error(err)
    } finally {
      setLoading?.(false)
    }
  }

  const deleteItemSync = async (
    id: number,
    setLoading?: (enable: boolean) => void,
    onDataSuccess?: (data: ResponseDataType) => void
  ) => {
    try {
      setLoading?.(true)
      const res = await apiService.deleteItem(id, accessTokenStored ?? '')
      if (!res?.success) throw new Error(`${res?.message}`)
      onDataSuccess?.(res)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading?.(false)
    }
  }

  return {
    createItem,
    createItemSync,
    getItem,
    getItemSync,
    getItems,
    getItemsSync,
    updateItem,
    updateItemSync,
    updateItems,
    updateItemsSync,
    deleteItem,
    deleteItemSync
  }
}
