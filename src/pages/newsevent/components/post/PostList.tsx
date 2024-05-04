import { Avatar, Button, Card, Flex, Popconfirm, Typography } from 'antd'
import { useEffect, useState } from 'react'
import useTable from '~/components/hooks/useTable'
import BaseLayout from '~/components/layout/BaseLayout'
import SkyList from '~/components/sky-ui/SkyList/SkyList'
import SkyListItem from '~/components/sky-ui/SkyList/SkyListItem'
import { Post } from '~/typing'
import { textValidatorDisplay } from '~/utils/helpers'
import usePost from '../../hooks/usePost'
import { PostTableDataType } from '../../type'
import ModalAddNewPost from './ModalAddNewPost'
import PostDetails from './PostDetails'

const PostList = () => {
  const table = useTable<PostTableDataType>([])
  const { posts, handleAddNewItem, handleConfirmDelete, loadData } = usePost(table)
  const [openAddNewModal, setOpenAddNewModal] = useState(false)
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [post, setPost] = useState<Post>({})

  useEffect(() => {
    if (!openModal) loadData()
  }, [openModal])

  return (
    <>
      <BaseLayout
        onAddNewClick={{
          onClick: () => setOpenAddNewModal(!openAddNewModal),
          isShow: true
        }}
      >
        <SkyList
          grid={{ gutter: 0, column: 4 }}
          dataSource={posts}
          renderItem={(item) => (
            <SkyListItem key={item.id}>
              <Card
                style={{ width: 300 }}
                className='relative'
                cover={
                  <Avatar
                    shape='square'
                    draggable={false}
                    className='h-[200px] object-cover'
                    alt='example'
                    src={textValidatorDisplay(item.imageUrl)}
                  />
                }
              >
                <Typography.Text type='secondary' className='text-xs italic'>
                  {item.publishedAt}
                </Typography.Text>
                <Typography.Title level={5} className='line-clamp-2 min-h-[48px]'>
                  {item.title}
                </Typography.Title>
                <Flex className='mt-5' justify='space-between' gap={16}>
                  <Button
                    type='primary'
                    onClick={() => {
                      setPost(item)
                      setOpenModal(true)
                    }}
                  >
                    View
                  </Button>
                  <Popconfirm
                    title={`Sure to cancel?`}
                    okButtonProps={{
                      size: 'middle'
                    }}
                    cancelButtonProps={{
                      size: 'middle'
                    }}
                    placement='topLeft'
                    onConfirm={() => {
                      handleConfirmDelete({ ...item } as PostTableDataType, (meta) => {
                        if (meta?.success) {
                          table.handleConfirmDeleting(`${item.id}`)
                          loadData()
                        }
                      })
                    }}
                  >
                    <Button type='dashed'>Delete</Button>
                  </Popconfirm>
                </Flex>
              </Card>
            </SkyListItem>
          )}
        />
      </BaseLayout>
      <ModalAddNewPost
        onAddNew={(record) => {
          handleAddNewItem({ ...record })
        }}
        openModal={openAddNewModal}
        setOpenModal={setOpenAddNewModal}
      />
      <PostDetails openModal={openModal} setOpenModal={setOpenModal} post={post} />
    </>
  )
}

export default PostList
