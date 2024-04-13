import { List } from 'antd'
import { ListItemProps } from 'antd/es/list'

export interface SkyListItemProps extends ListItemProps {}

const SkyListItem = ({ ...props }: SkyListItemProps) => {
  return (
    <>
      <List.Item {...props}>{props.children}</List.Item>
    </>
  )
}

export default SkyListItem
