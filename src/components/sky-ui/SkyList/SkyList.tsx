import type { ListProps } from 'antd'
import { List } from 'antd'

export interface SkyListRequiredDataType {
  key: string
}

export interface SkyListProps<T extends SkyListRequiredDataType> extends ListProps<T> {}

const SkyList = <T extends SkyListRequiredDataType>({ ...props }: SkyListProps<T>) => {
  return (
    <>
      <List {...props} />
    </>
  )
}

export default SkyList
