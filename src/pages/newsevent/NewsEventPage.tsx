import BaseLayout from '~/components/layout/BaseLayout'
import PostTable from './components/post/PostTable'
import PostList from './components/post/PostList'

const NewsEventPage = () => {
  return (
    <>
      <BaseLayout title='News and  page'>
        <PostTable />
        <PostList />
      </BaseLayout>
    </>
  )
}

export default NewsEventPage
