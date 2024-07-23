import { Breadcrumb, Flex, Typography } from 'antd'
import { TitleProps } from 'antd/es/typography/Title'
import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import useBreadcrumbs from 'use-react-router-breadcrumbs'
import routes from '~/config/route.config'
import { cn } from '~/utils/helpers'

interface BaseLayoutProps extends React.HTMLAttributes<HTMLElement> {
  titleProps?: TitleProps
  breadcrumb?: boolean
  onLoading?: (enable: boolean) => void
}

const BaseLayout: React.FC<BaseLayoutProps> = ({ titleProps, breadcrumb, children, ...props }) => {
  const { pathname } = useLocation()
  const breadcrumbs = useBreadcrumbs(routes)

  return (
    <div {...props} className={cn('w-full', props.className)}>
      <Flex vertical gap={20} className='w-full'>
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
          <Typography.Title
            {...titleProps}
            level={titleProps?.level ?? 2}
            className={cn('ml-5 md:m-0', titleProps?.className)}
          >
            {props.title}
          </Typography.Title>
        )}
        <Flex vertical gap={20}>
          {children}
        </Flex>
      </Flex>
    </div>
  )
}

export default BaseLayout
