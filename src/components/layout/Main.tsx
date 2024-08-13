import type { MenuProps } from 'antd'
import { Flex, Layout, Menu } from 'antd'
import React, { useEffect, useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import logo from '~/assets/logo.svg'
import routes from '~/config/route.config'
import useLocalStorage from '~/hooks/useLocalStorage'
import { User } from '~/typing'
import { breakpoint, cn, isValidString } from '~/utils/helpers'
import useWindow from '../hooks/useWindow'
import Footer from './Footer'
import Header from './Header'

const { Sider, Content } = Layout

const Main: React.FC = () => {
  const { pathname } = useLocation()
  const [openDrawer, setOpenDrawer] = useState(false)
  const [selectedKey, setSelectedKey] = useState<string>(routes[0].key)
  const [userStorage] = useLocalStorage<User>('user', {})
  const { width } = useWindow()
  const navigate = useNavigate()

  useEffect(() => {
    if (!userStorage || !isValidString(userStorage.email) || !isValidString(userStorage.password)) navigate('/login')
  }, [])

  useEffect(() => {
    const keyFound = routes.find((route) => route.path === pathname)
    if (keyFound) {
      setSelectedKey(keyFound.key)
    }
  }, [pathname])

  const items: MenuProps['items'] = routes.map((route) => {
    return {
      key: route.key,
      label: <Link to={route.path}>{openDrawer ? route.name : undefined}</Link>,
      icon: <route.icon size={24} />
    }
  })

  const handleClick: MenuProps['onClick'] = (e) => {
    setSelectedKey(e.key)
    if (openDrawer) setOpenDrawer(false)
  }

  return (
    <Layout className='w-full bg-background' hasSider>
      <Sider
        breakpoint='xs'
        collapsedWidth={0}
        collapsible
        trigger={null}
        width={openDrawer ? 250 : width >= breakpoint.lg ? 80 : 0}
        style={{
          position: 'fixed',
          left: '0px',
          top: '0px',
          bottom: '0px',
          overflow: 'auto',
          height: '100vh',
          zIndex: 10
        }}
      >
        <Flex vertical gap={20} className='my-5 bg-white'>
          <Flex align='center' justify='center' gap={8}>
            <img src={logo} alt='logo' className='h-16 w-16 object-contain lg:h-10 lg:w-10' />
          </Flex>
          <Menu
            onClick={handleClick}
            selectedKeys={[selectedKey]}
            defaultSelectedKeys={[selectedKey]}
            mode='inline'
            items={items}
          />
        </Flex>
      </Sider>
      <Layout>
        <Header
          collapsed={openDrawer}
          setCollapsed={setOpenDrawer}
          onMenuClick={() => {
            setOpenDrawer(!openDrawer)
          }}
        />
        <Content
          className={cn('min-h-screen bg-white p-5 transition-all duration-200', {
            'ml-[250px]': openDrawer,
            'ml-[0px] lg:ml-[80px]': !openDrawer
          })}
        >
          <Outlet />
        </Content>
        <Footer className='bg-white'>Ant Design ©2023 Created by Ant UED</Footer>
      </Layout>
    </Layout>
  )
}

export default Main
