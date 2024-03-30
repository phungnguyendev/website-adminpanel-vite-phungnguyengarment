import { Divider, Flex, Typography } from 'antd'
import { Link } from 'react-router-dom'
import { SideType } from '~/utils/route'

const SideItem = (item: SideType, collapsed: boolean) => {
  return (
    <>
      {item.isGroup ? (
        <Flex vertical>
          <Divider />
          <Typography.Text type='secondary'>{item.name}</Typography.Text>
        </Flex>
      ) : (
        <>
          {collapsed && (
            <Link to={item.path} className='mx-2 transition-none'>
              <span>{item.name}</span>
            </Link>
          )}
        </>
      )}
    </>
  )
}

export default SideItem
