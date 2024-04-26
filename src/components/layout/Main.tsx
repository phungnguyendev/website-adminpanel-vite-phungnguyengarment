import { Layout } from 'antd'
import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { cn } from '~/utils/helpers'
import Footer from './Footer'
import Header from './Header'
import SideNav from './sidenav/SideNav'

const { Sider, Content } = Layout

const Main: React.FC = () => {
  const [openDrawer, setOpenDrawer] = useState(false)

  return (
    <Layout className='w-full bg-background' hasSider>
      {/* <Drawer
        title={false}
        placement='left'
        closable={true}
        onClose={() => setOpenDrawer(false)}
        open={openDrawer}
        width={250}
        className='m-0'
      >
        <Layout>
          <Sider trigger={null}>
            <SideNav openDrawer={openDrawer} setOpenDrawer={setOpenDrawer} />
          </Sider>
        </Layout>
      </Drawer> */}
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
        <SideNav openDrawer={openDrawer} setOpenDrawer={setOpenDrawer} />
      </Sider>
      <Layout
        className={cn({
          '250px': openDrawer,
          '80px': !openDrawer
        })}
      >
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
        <Footer className=''>Ant Design ©2023 Created by Ant UED</Footer>
      </Layout>
    </Layout>
  )
}

export default Main
