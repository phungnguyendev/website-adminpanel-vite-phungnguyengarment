import { Avatar, Button, Card, Flex, Typography } from 'antd'
import { Link } from 'react-router-dom'
import useTable from '~/components/hooks/useTable'
import SkyList from '~/components/sky-ui/SkyList/SkyList'
import SkyListItem from '~/components/sky-ui/SkyList/SkyListItem'
import { getPublicUrlGoogleDrive } from '~/utils/helpers'
import usePost from '../../hooks/usePost'
import { PostTableDataType } from '../../type'

const PostList = () => {
  const table = useTable<PostTableDataType>([])
  const { posts } = usePost(table)

  return (
    <>
      <SkyList
        grid={{ gutter: 0, column: 4 }}
        dataSource={posts}
        renderItem={(item) => (
          <SkyListItem key={item.id}>
            <Card
              style={{ width: 300 }}
              cover={
                <Avatar
                  shape='square'
                  draggable={false}
                  className='h-[200px] object-cover'
                  alt='example'
                  src={getPublicUrlGoogleDrive(item.thumbID ?? '')}
                />
              }
            >
              <Typography.Text type='secondary' className='text-xs italic'>
                {item.publishedAt}
              </Typography.Text>
              <Typography.Title level={5} className='line-clamp-2'>
                {item.title}
              </Typography.Title>
              <Flex className='mt-5' justify='space-between' gap={16}>
                <Button type='primary'>
                  <Link to={`${item.id}`}>View</Link>
                </Button>
                <Button type='dashed'>Delete</Button>
              </Flex>
            </Card>
          </SkyListItem>
        )}
      />
    </>
  )
}

export default PostList
