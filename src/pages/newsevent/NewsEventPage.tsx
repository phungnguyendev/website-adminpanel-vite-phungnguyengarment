import BaseLayout from '~/components/layout/BaseLayout'
import PostTable from './components/post/PostTable'

const NewsEventPage = () => {
  return (
    <>
      <BaseLayout title='News and  page'>
        <PostTable />

        {/* <ProductTable /> */}
      </BaseLayout>
    </>
  )
}

export default NewsEventPage
