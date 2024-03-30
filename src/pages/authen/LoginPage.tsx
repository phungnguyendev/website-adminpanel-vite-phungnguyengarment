import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons'
import { App as AntApp, Button, Checkbox, Flex, Form, Input, Typography } from 'antd'
import { LockKeyhole, Mail } from 'lucide-react'
import React, { HTMLAttributes, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ResponseDataType } from '~/api/client'
import AuthAPI from '~/api/services/AuthAPI'
import bg from '~/assets/a1.jpg'
import logo from '~/assets/logo.svg'
import useTitle from '~/components/hooks/useTitle'
import useLocalStorage from '~/hooks/useLocalStorage'
import { User } from '~/typing'

interface Props extends HTMLAttributes<HTMLElement> {}

type LayoutType = Parameters<typeof Form>[0]['layout']

const LoginPage: React.FC<Props> = ({ ...props }) => {
  const [form] = Form.useForm()
  const { message } = AntApp.useApp()
  const navigate = useNavigate()
  const [accessTokenStored, setAccessTokenStored] = useLocalStorage('accessToken', '')
  const [emailStored, setEmailStored] = useLocalStorage('email-stored', '')
  const [otpStored, setOtpStored] = useLocalStorage('otp-stored', '')
  const [loading, setLoading] = useState<boolean>(false)
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [formLayout, setFormLayout] = useState<LayoutType>('horizontal')
  useTitle('Đăng nhập')

  useEffect(() => {
    if (emailStored || otpStored) {
      setEmailStored(null)
      setOtpStored(null)
    }
  }, [emailStored, otpStored])

  useEffect(() => {
    if (accessTokenStored && accessTokenStored.length !== 0) {
      navigate('/')
    }
  }, [accessTokenStored])

  const onFormLayoutChange = ({ layout }: { layout: LayoutType }) => {
    setFormLayout(layout)
  }

  const onFinish = async (user: { email: string; password: string }) => {
    try {
      setLoading(true)
      // Create a new request to login user
      await AuthAPI.login(user).then((meta) => {
        if (!meta?.success) throw new Error(meta?.message)
        const userLogged = meta.data as User
        if (userLogged) {
          // Save to local storage
          setAccessTokenStored(userLogged.accessToken)
        }
        // Send message app
        message.success('Success!')
        // Navigation to '/' (Dashboard page) if login success
        navigate('/')
      })
    } catch (error: any) {
      const resError: ResponseDataType = error.data
      message.error(`${resError.message}`)
    } finally {
      setLoading(false)
    }
  }

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
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

  const forgerPasswordHandler = () => {
    navigate('/verify-email')
  }

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
              onFinish={onFinish}
              className='w-full'
              onFinishFailed={onFinishFailed}
              autoComplete='off'
            >
              <Flex className='w-full' align='end' vertical gap={20}>
                <Flex className='mb-14 w-full' gap={16} vertical>
                  <Flex className='w-full' vertical gap={8}>
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
                        prefix={<Mail className='mr-1' size={16} />}
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        allowClear
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
                        prefix={<LockKeyhole className='mr-1' size={16} />}
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        allowClear
                        iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                      />
                    </Form.Item>
                  </Flex>
                  <Flex className='w-full' justify='space-between' align='center'>
                    <Form.Item className='m-0 p-0' name='remember' valuePropName='checked' noStyle>
                      <Checkbox>Remember me</Checkbox>
                    </Form.Item>
                    <Button className='w-fit' onClick={forgerPasswordHandler} type='link' loading={loading}>
                      Forget password?
                    </Button>
                  </Flex>
                </Flex>

                <Flex className='w-full' justify='end'>
                  <Form.Item {...buttonItemLayout} className='m-0 w-fit'>
                    <Button htmlType='submit' className='button-medium h-fit' type='primary' loading={loading}>
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
