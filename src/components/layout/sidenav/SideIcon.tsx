import * as React from 'react'
import { Link } from 'react-router-dom'
import { SideType } from '~/utils/route'

export interface SideIconProps extends React.HTMLAttributes<HTMLElement> {
  item: SideType
  collapsed: boolean
}

const SideIcon: React.FC<SideIconProps> = ({ item, collapsed }) => {
  return (
    <>
      {collapsed ? (
        <item.icon size={20} className='transition-colors duration-300' />
      ) : (
        <Link to={item.path} className='align-center flex transition-none'>
          <item.icon size={20} className='transition-colors duration-300' />
        </Link>
      )}
    </>
  )
}

export default SideIcon
