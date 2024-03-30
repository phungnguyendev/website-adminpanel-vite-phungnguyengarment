import * as React from 'react'

export interface SideIconProps extends React.HTMLAttributes<HTMLElement> {
  icon: React.LazyExoticComponent<() => JSX.Element> | React.ReactNode | any
  active: boolean
}

const SideIcon: React.FC<SideIconProps> = ({ icon: Icon }) => {
  return <Icon size={20} className='transition-colors duration-300' />
}

export default SideIcon
