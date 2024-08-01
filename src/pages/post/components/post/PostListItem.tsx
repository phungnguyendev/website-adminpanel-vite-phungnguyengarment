import { Avatar, Button, Card, Flex, Popconfirm, Typography } from 'antd'
import React from 'react'
import { dateTimeValidatorDisplay, textValidatorDisplay } from '~/utils/helpers'
import { PostTableDataType } from '../../type'

export interface PostListItemProps {
  record: PostTableDataType
  onViewClick?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
  onDelete?: (e?: React.MouseEvent<HTMLElement>) => void
}

const PostListItem: React.FC<PostListItemProps> = ({ record, onViewClick, onDelete, ...props }) => {
  return (
    <>
      <Card
        {...props}
        style={{ width: 300 }}
        className='relative'
        cover={
          <Avatar
            shape='square'
            draggable={false}
            className='h-[200px] object-cover'
            alt='example'
            src={textValidatorDisplay(record.imageUrl)}
          />
        }
      >
        <Typography.Text type='secondary' className='text-xs italic'>
          {dateTimeValidatorDisplay(record.publishedAt)}
        </Typography.Text>
        <Typography.Title level={5} className='line-clamp-2 min-h-[48px]'>
          {record.title}
        </Typography.Title>
        <Flex className='mt-5' justify='space-between' gap={16}>
          <Button type='primary' onClick={onViewClick}>
            View
          </Button>
          <Popconfirm title={`Sure to cancel?`} placement='topLeft' onConfirm={onDelete}>
            <Button type='dashed'>Delete</Button>
          </Popconfirm>
        </Flex>
      </Card>
    </>
  )
}

export default PostListItem
