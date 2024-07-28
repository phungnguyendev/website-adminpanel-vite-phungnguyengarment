import { lazy } from 'react'
import BaseLayout from '~/components/layout/BaseLayout'

const PostTable = lazy(() => import('./components/post/PostTable'))
const PostList = lazy(() => import('./components/post/PostList'))

const NewsEventPage = () => {
  return (
    <>
      <BaseLayout title='News'>
        {/* <PostTable /> */}
        <PostList />
        {/* <Outlet /> */}
      </BaseLayout>
    </>
  )
}

export default NewsEventPage
