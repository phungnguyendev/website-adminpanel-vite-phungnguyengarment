import type { MenuProps } from 'antd'
import { Flex, Layout, Menu } from 'antd'
import React, { useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import logo from '~/assets/logo.svg'
import routes from '~/config/route.config'
import { cn } from '~/utils/helpers'
import Footer from './Footer'
import Header from './Header'

const { Sider, Content } = Layout

const Main: React.FC = () => {
  const [openDrawer, setOpenDrawer] = useState(false)
  const [selectedKey, setSelectedKey] = useState<string>(routes[0].key)

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
        breakpoint='lg'
        collapsedWidth={0}
        collapsible
        trigger={null}
        width={openDrawer ? 250 : 80}
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
          className={cn('min-h-screen bg-background p-5 transition-all duration-200', {
            'ml-[250px]': openDrawer,
            'ml-[80px]': !openDrawer
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
