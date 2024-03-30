import { Flex, Menu, MenuProps } from 'antd'
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import logo from '~/assets/logo.svg'
import { cn } from '~/utils/helpers'
import { appRoutes } from '~/utils/route'
import SideIcon from './SideIcon'
import SideItem from './SideItem'

export interface Props extends React.HTMLAttributes<HTMLElement> {
  openDrawer: boolean
  setOpenDrawer: (enable: boolean) => void
}

type MenuItem = Required<MenuProps>['items'][number]

function getItem(label: React.ReactNode, key: React.Key, icon?: React.ReactNode, type?: 'group'): MenuItem {
  return {
    key,
    icon,
    label,
    type
  } as MenuItem
}

const SideNav: React.FC<Props> = ({ openDrawer, ...props }) => {
  const { pathname } = useLocation()
  const [selectedKey, setSelectedKey] = useState<string>(appRoutes[0].key)

  useEffect(() => {
    const keyFound = appRoutes.find((route) => route.path === lastPath(pathname))
    if (keyFound) {
      setSelectedKey(keyFound.key)
    }
  }, [pathname])

  const lastPath: (pathname: string) => string = function (pathname) {
    const arrPath = pathname.split('/')
    const path = arrPath[arrPath.length - 1]
    return path
  }

  const items: MenuProps['items'] = appRoutes.map((route) => {
    if (route.isGroup) {
      return getItem(SideItem(route, openDrawer), route.key, null, 'group')
    } else {
      return getItem(SideItem(route, openDrawer), route.key, SideIcon({ icon: route.icon, active: true }))
    }
  })

  const onClick: MenuProps['onClick'] = (e) => {
    setSelectedKey(e.key)
  }

  return (
    <Flex vertical gap={20} {...props} className={cn('my-5 bg-white', props.className)}>
      <Flex align='center' justify='center' gap={8}>
        <img src={logo} alt='logo' className='h-16 w-16 object-contain lg:h-10 lg:w-10' />
        {/* {openDrawer && (
          <Typography.Text className='font-roboto-condensed font-bold uppercase text-primary'>
            PHUNG NGUYEN GARMENT
          </Typography.Text>
        )} */}
      </Flex>
      <Menu
        onClick={onClick}
        selectedKeys={[selectedKey]}
        defaultSelectedKeys={[selectedKey]}
        mode='inline'
        items={items}
      />
    </Flex>
  )
}
export default SideNav
