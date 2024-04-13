import type { ListProps } from 'antd'
import { List } from 'antd'

export interface SkyListProps<T extends any> extends ListProps<T> {}

const SkyList = <T extends any>({ ...props }: SkyListProps<T>) => {
  return (
    <>
      <List {...props} />
    </>
  )
}

export default SkyList
