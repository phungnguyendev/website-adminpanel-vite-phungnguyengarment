import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons'
import { App as AntApp, Button, Flex, Form, Input, Typography } from 'antd'
import { LockKeyhole, Mail } from 'lucide-react'
import React, { HTMLAttributes, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import bg from '~/assets/a1.jpg'
import logo from '~/assets/logo.svg'
import useTitle from '~/components/hooks/useTitle'
import appConfig from '~/config/app.config'
import useLocalStorage from '~/hooks/useLocalStorage'
import { setUser } from '~/store/actions-creator'
import { User } from '~/typing'
import { isValidString } from '~/utils/helpers'

interface Props extends HTMLAttributes<HTMLElement> {}

type LayoutType = Parameters<typeof Form>[0]['layout']

const LoginPage: React.FC<Props> = ({ ...props }) => {
  useTitle('Đăng nhập')
  const [form] = Form.useForm()
  const { message } = AntApp.useApp()
  const navigate = useNavigate()
  const [loading, setLoading] = useState<boolean>(false)
  const [formLayout, setFormLayout] = useState<LayoutType>('horizontal')
  const [userStorage, setUserStorage] = useLocalStorage<User>('user', {})
  const dispatch = useDispatch()

  useEffect(() => {
    initialize()
  }, [])

  const initialize = () => {
    if (isValidString(userStorage?.email) || isValidString(userStorage?.password)) localStorage.removeItem('user')
  }

  const onFormLayoutChange = ({ layout }: { layout: LayoutType }) => {
    setFormLayout(layout)
  }

  const handleFinish = async (user: { email: string; password: string }) => {
    try {
      setLoading(true)
      if (user.email.length <= 0) throw new Error('Please enter email address!')
      if (user.password.length <= 0) throw new Error('Please enter password!')
      if (user.email.trim() !== appConfig.admin.email.trim()) throw new Error('Invalid email address')
      if (user.password.trim() !== appConfig.admin.password.trim()) throw new Error('Invalid password')
      // Save user to local storage
      setUserStorage(user)
      // Set user to redux
      dispatch(setUser(user))
      message.success('Login success')
      navigate('/')
    } catch (error: any) {
      message.error(`${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const formItemLayout =
    formLayout === 'vertical'
      ? {
          labelCol: { span: 4 },
          wrapperCol: { span: 14 }
        }
      : null

  const buttonItemLayout =
    formLayout === 'vertical'
      ? {
          wrapperCol: { span: 14, offset: 4 }
        }
      : null

  return (
    <Flex {...props} className='relative' align='center' justify='center'>
      <Flex
        align='center'
        justify='center'
        className='fixed bottom-0 left-0 right-0 top-0 h-full w-full bg-white md:bg-background'
      >
        <Flex
          gap={20}
          align='center'
          justify='center'
          className='h-[450px] w-[900px] rounded-lg bg-white p-10 md:mx-10 md:shadow-lg'
        >
          <Flex className='hidden h-full w-1/2 overflow-hidden md:flex'>
            <img src={bg} alt='bg' className='h-full w-full object-cover' />
          </Flex>
          <Flex vertical justify='space-between' className='h-full w-full md:w-1/2'>
            <Flex vertical align='start' gap={10} className='relative h-fit w-full' justify='center'>
              <Flex vertical align='start' gap={10} className=''>
                <Flex className='h-12 w-12'>
                  <img src={logo} alt='logo' className='h-full w-full object-contain' />
                </Flex>
                <Typography.Title className='m-0 p-0' level={3}>
                  Welcome to <span className='text-primary'>PHUNG NGUYEN</span>
                </Typography.Title>
              </Flex>
              <Typography.Text type='secondary'>Welcome back, please login to your account.</Typography.Text>
            </Flex>

            <Form
              form={form}
              {...formItemLayout}
              layout={formLayout}
              name='basic'
              labelCol={{ flex: '100px' }}
              labelAlign='left'
              initialValues={{ layout: formLayout }}
              onValuesChange={onFormLayoutChange}
              onFinish={handleFinish}
              className='w-full'
              autoComplete='off'
            >
              <Flex className='w-full' align='end' vertical gap={20}>
                <Flex className='mb-14 w-full' gap={16} vertical>
                  <Flex className='w-full' vertical gap={20}>
                    <Form.Item
                      name='email'
                      className='m-0 w-full p-0'
                      rules={[
                        {
                          required: true,
                          message: 'Please input your email!',
                          validateTrigger: 'onBlur',
                          type: 'email'
                        }
                      ]}
                    >
                      <Input
                        placeholder='Email'
                        className='w-full'
                        type='email'
                        size='large'
                        prefix={<Mail className='mr-1' size={16} />}
                        allowClear
                        autoComplete='email'
                      />
                    </Form.Item>

                    <Form.Item
                      name='password'
                      className='m-0 w-full p-0'
                      rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                      <Input.Password
                        placeholder='Password'
                        className='w-full'
                        type='password'
                        size='large'
                        prefix={<LockKeyhole className='mr-1' size={16} />}
                        allowClear
                        iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                        autoComplete='current-password'
                      />
                    </Form.Item>
                  </Flex>
                </Flex>

                <Flex className='w-full' justify='end'>
                  <Form.Item {...buttonItemLayout} className='m-0 w-fit'>
                    <Button htmlType='submit' className='h-fit' size='large' type='primary' loading={loading}>
                      Login
                    </Button>
                  </Form.Item>
                </Flex>
              </Flex>
            </Form>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default LoginPage
