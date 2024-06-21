import { useCallback, useState } from 'react'

type RequiredModelType = {
  id?: number
}

interface UseArrayProps<T extends RequiredModelType> {
  array: T[]
  isEmpty: boolean
  setArray: (newArr: T[]) => void
  push: (newItem: T) => void
  update: (index: number, itemToUpdate: T) => void
  remove: (index: number) => void
  clear: () => void
  filter: (predicate: (value: T, index: number, array: T[]) => value is T, thisArg?: any) => void
  find: (itemFind: T) => T | undefined
}

export default function useArrayModel<T extends RequiredModelType>(arr: T[]): UseArrayProps<T> {
  const [array, setArray] = useState<T[]>(arr)

  const isEmpty = array.length === 0

  const push = useCallback((newItem: T) => {
    setArray((oldArr) => [...oldArr, newItem])
  }, [])

  const update = useCallback(
    (index: number, itemToUpdate: T) => {
      const newData = array
      const currentItem = array[index]
      newData.splice(index, 1, { ...currentItem, ...itemToUpdate })
      setArray(newData)
    },
    [array]
  )

  const filter = useCallback((predicate: (value: T, index: number, array: T[]) => value is T, thisArg?: any) => {
    setArray((a) => a.filter(predicate, thisArg))
  }, [])

  const remove = useCallback((index: number) => {
    setArray((oldArr) => oldArr.filter((_, i) => i !== index))
  }, [])

  const clear = useCallback(() => {
    setArray([])
  }, [])

  const find = useCallback(
    (itemFind: T) => {
      return array.find((self) => self === itemFind)
    },
    [array]
  )

  return { array, setArray, push, update, remove, clear, filter, find, isEmpty }
}
