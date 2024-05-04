import { Breadcrumb, Button, Flex, Input, Switch, Typography } from 'antd'
import { SwitchChangeEventHandler } from 'antd/es/switch'
import { TitleProps } from 'antd/es/typography/Title'
import { Plus } from 'lucide-react'
import React, { useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import useBreadcrumbs from 'use-react-router-breadcrumbs'
import useLocalStorage from '~/hooks/useLocalStorage'
import { routes } from '~/types/routes'
import { cn } from '~/utils/helpers'

interface ActionProps {
  onClick?: (e?: React.MouseEvent<HTMLElement, MouseEvent>) => void
  isShow?: boolean
  disabled?: boolean
}

interface Props extends React.HTMLAttributes<HTMLElement> {
  titleProps?: TitleProps
  searchPlaceHolder?: string
  defaultSearchValue?: string | number | readonly string[] | undefined
  searchValue?: string | undefined
  onSearch?: (
    value: string,
    event?:
      | React.ChangeEvent<HTMLInputElement>
      | React.MouseEvent<HTMLElement, MouseEvent>
      | React.KeyboardEvent<HTMLInputElement>
      | undefined,
    info?: {
      source?: 'clear' | 'input'
    }
  ) => void
  breadcrumb?: boolean
  onLoading?: (enable: boolean) => void
  onSearchChange?: React.ChangeEventHandler<HTMLInputElement> | undefined
  showDeleted?: boolean
  onSortChange?: SwitchChangeEventHandler
  onDeletedRecordStateChange?: SwitchChangeEventHandler
  onResetClick?: ActionProps
  onAddNewClick?: ActionProps
}

const { Search } = Input

const BaseLayout: React.FC<Props> = ({
  searchPlaceHolder,
  onSearchChange,
  searchValue,
  defaultSearchValue,
  onSearch,
  onSortChange,
  showDeleted,
  onDeletedRecordStateChange,
  onResetClick,
  onAddNewClick,
  children,
  onLoading,
  titleProps,
  breadcrumb,
  ...props
}) => {
  const [accessTokenStored] = useLocalStorage<string>('accessToken', '')
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const breadcrumbs = useBreadcrumbs(routes)

  useEffect(() => {
    const callApi = async () => {
      try {
        onLoading?.(true)
        if (!accessTokenStored) navigate('/login')
      } catch (error) {
        console.error(error)
      } finally {
        onLoading?.(false)
      }
    }
    callApi()
  }, [])

  return (
    <div {...props} className={cn('w-full', props.className)}>
      {breadcrumb && (
        <Breadcrumb
          items={breadcrumbs.map((breadcrumb) => {
            return {
              title:
                pathname === breadcrumb.match.pathname ? (
                  breadcrumb.breadcrumb
                ) : (
                  <Link to={breadcrumb.match.pathname}>{breadcrumb.breadcrumb}</Link>
                )
            }
          })}
        />
      )}
      {props.title && (
        <Typography.Title className='w-fit' {...titleProps} level={titleProps?.level ? titleProps.level : 2}>
          {props.title}
        </Typography.Title>
      )}
      <Flex vertical gap={20} className='w-full'>
        <Flex vertical gap={20} className='w-full'>
          {onSearch && (
            <Search
              placeholder={searchPlaceHolder ? searchPlaceHolder : 'Search...'}
              size='middle'
              enterButton
              className='w-full lg:hidden'
              name='search'
              allowClear
              value={searchValue}
              defaultValue={defaultSearchValue}
              onSearch={onSearch}
              onChange={onSearchChange}
            />
          )}
          <Flex justify='space-between' className='w-full' align='center'>
            <Flex gap={10} align='center' wrap='wrap'>
              {/* <Switch
                checkedChildren='Admin'
                unCheckedChildren='Admin'
                defaultChecked={false}
                checked={user.isAdmin}
                onChange={(val) => {
                  dispatch(setAdminAction(val))
                }}
              /> */}
              {onSortChange && (
                <Switch
                  checkedChildren='Sorted'
                  unCheckedChildren='Sorted'
                  defaultChecked={false}
                  onChange={onSortChange}
                />
              )}
              {onDeletedRecordStateChange && (
                <Switch
                  checkedChildren='Deleted'
                  unCheckedChildren='Deleted'
                  defaultChecked={showDeleted}
                  onChange={onDeletedRecordStateChange}
                />
              )}
              {onSearch && (
                <Search
                  placeholder={searchPlaceHolder ? searchPlaceHolder : 'Search...'}
                  size='middle'
                  enterButton
                  className='hidden w-[450px] lg:block'
                  name='search'
                  allowClear
                  value={searchValue}
                  defaultValue={defaultSearchValue}
                  onSearch={onSearch}
                  onChange={onSearchChange}
                />
              )}
            </Flex>
            <Flex gap={10} align='center' wrap='wrap' justify='flex-end' className='w-full'>
              {onResetClick?.isShow && (
                <Button onClick={onResetClick.onClick} className='flex items-center' type='default'>
                  Reset
                </Button>
              )}
              {onAddNewClick?.isShow && (
                <Button
                  onClick={onAddNewClick.onClick}
                  className='flex items-center'
                  type='primary'
                  icon={<Plus size={20} />}
                >
                  New
                </Button>
              )}
            </Flex>
          </Flex>
        </Flex>
        {children}
      </Flex>
    </div>
  )
}

export default BaseLayout
