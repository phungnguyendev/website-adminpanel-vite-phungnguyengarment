import BaseLayout from '~/components/layout/BaseLayout'
import PostList from './components/post/PostList'

const NewsEventPage = () => {
  return (
    <>
      <BaseLayout title='News and page'>
        {/* <PostTable /> */}
        <PostList />
        {/* <Outlet /> */}
      </BaseLayout>
    </>
  )
}

export default NewsEventPage
