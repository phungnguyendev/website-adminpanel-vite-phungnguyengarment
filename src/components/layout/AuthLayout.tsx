import { Flex, Typography } from 'antd'
import React from 'react'
import bg from '~/assets/a1.jpg'
import logo from '~/assets/logo.svg'
import useTitle from '~/components/hooks/useTitle'

interface Props {
  title?: string
  subTitle?: string
  children: React.ReactNode
}

const AuthLayout: React.FC<Props> = ({ title, subTitle, children }) => {
  useTitle(title ?? 'Phung Nguyen Garment')

  return (
    <Flex className='relative bg-background' align='center' justify='center'>
      <Flex
        gap={30}
        align='center'
        className='h-fit w-full rounded-lg bg-white p-10 shadow-lg sm:fixed sm:top-1/2 sm:w-[900px] sm:-translate-y-1/2'
      >
        <Flex className='h-[450px] w-[672px]'>
          <img src={bg} className='h-full w-full object-cover' />
        </Flex>
        <Flex vertical gap={20} justify='center' align='center' className='w-full'>
          <Flex align='center' className='relative h-fit w-full' justify='start' gap={20}>
            <img src={logo} alt='logo' className='h-16 w-16 object-contain' />
            <Flex vertical align='start' justify='center'>
              <Typography.Title className='text-center' level={3}>
                {title}
              </Typography.Title>
              <Typography.Text type='secondary'>{subTitle}</Typography.Text>
              {/* Please fill in your account information! */}
            </Flex>
          </Flex>
          {children}
        </Flex>
      </Flex>
    </Flex>
  )
}

export default AuthLayout
