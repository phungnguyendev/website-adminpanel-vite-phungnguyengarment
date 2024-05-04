import { Flex, Menu, MenuProps } from 'antd'
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import logo from '~/assets/logo.svg'
import { routeSide } from '~/types/routes'
import SideIcon from './SideIcon'
import SideItem from './SideItem'

export interface Props {
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

const SideNav: React.FC<Props> = ({ openDrawer, setOpenDrawer }) => {
  const { pathname } = useLocation()
  const [selectedKey, setSelectedKey] = useState<string>(routeSide[0].path)

  useEffect(() => {
    const keyFound = routeSide.find((route) => route.path === pathname)
    if (keyFound) {
      setSelectedKey(keyFound.path)
    }
  }, [pathname])

  const items: MenuProps['items'] = routeSide.map((route) => {
    return getItem(
      SideItem({ item: route, collapsed: openDrawer }),
      route.path,
      SideIcon({ item: route, collapsed: openDrawer })
    )
  })

  const onClick: MenuProps['onClick'] = (e) => {
    setSelectedKey(e.key)
    setOpenDrawer(false)
  }

  return (
    <Flex vertical gap={20} className='my-5 bg-white'>
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
