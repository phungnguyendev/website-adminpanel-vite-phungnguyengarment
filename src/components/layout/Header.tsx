import { CaretDownOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { Button, Divider, Dropdown, Flex, Layout, Space, Typography } from 'antd'
import { Menu } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import useLocalStorage from '~/hooks/useLocalStorage'
import { User } from '~/typing'
import { cn, extractEmailName } from '~/utils/helpers'
import useWindow from '../hooks/useWindow'

const { Header: AntHeader } = Layout

interface Props extends React.HTMLAttributes<HTMLElement> {
  onMenuClick: (event: React.MouseEvent<HTMLElement, globalThis.MouseEvent>) => void
  collapsed: boolean
  setCollapsed: (enable: boolean) => void
}

const Header: React.FC<Props> = ({ onMenuClick, collapsed, setCollapsed, ...props }) => {
  const { hidden, offsetY } = useWindow()
  const [userStorage, setUserStorage] = useLocalStorage<User>('user', {})
  const navigate = useNavigate()

  const items: MenuProps['items'] = [
    {
      type: 'divider'
    },
    {
      label: 'Log out',
      key: '3',
      onClick: () => {
        setUserStorage(null)
        localStorage.removeItem('user')
        navigate('/login')
      }
    }
  ]

  return (
    <AntHeader>
      <Flex
        {...props}
        className={cn(
          'fixed right-0 top-0 z-[999] min-h-[52px] bg-white px-5 transition-all duration-200',
          {
            'left-[250px]': collapsed,
            'left-0 lg:left-[80px]': !collapsed
          },
          {
            'shadow-sm': offsetY > 1,
            '-translate-y-full': hidden && offsetY > 52,
            'top-0': !hidden
          }
        )}
        justify='space-between'
        align='center'
      >
        <Button
          type='link'
          className='text-foreground hover:text-primary'
          onClick={(e) => {
            onMenuClick(e)
            setCollapsed(!collapsed)
          }}
        >
          <Menu size={20} />
        </Button>
        <Space split={<Divider type='vertical' />} className='h-[70px]'>
          <Flex vertical>
            <Dropdown menu={{ items }}>
              <Flex align='center' justify='center' gap={8} className='h-full'>
                <Flex className='h-full'>
                  <Button type='link' className='' onClick={(e) => e.preventDefault()}>
                    <Flex gap={4} justify='center' className='h-full text-foreground'>
                      <Typography.Text className='m-0'>{extractEmailName(userStorage?.email ?? '')}</Typography.Text>
                      <CaretDownOutlined />
                    </Flex>
                  </Button>
                </Flex>
              </Flex>
            </Dropdown>
          </Flex>
        </Space>
      </Flex>
    </AntHeader>
  )
}

export default Header
