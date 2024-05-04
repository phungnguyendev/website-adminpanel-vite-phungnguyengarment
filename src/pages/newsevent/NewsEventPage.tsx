import { lazy } from 'react'
import BaseLayout from '~/components/layout/BaseLayout'

const PostList = lazy(() => import('./components/post/PostList'))

const NewsEventPage = () => {
  return (
    <>
      <BaseLayout title='News and page' breadcrumb>
        {/* <PostTable /> */}
        <PostList />
        {/* <Outlet /> */}
      </BaseLayout>
    </>
  )
}

export default NewsEventPage
