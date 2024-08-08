import { Flex, Typography } from 'antd'
import BaseLayout from '~/components/layout/BaseLayout'
import SkyList from '~/components/sky-ui/SkyList/SkyList'
import SkyListItem from '~/components/sky-ui/SkyList/SkyListItem'
import SkyListWrapperLayout from '~/components/sky-ui/SkyList/SkyListWrapperLayout'
import usePostViewModel from '../../hooks/usePostViewModel'
import ModalAddNewPost from './ModalAddNewPost'
import ModalReviewPostDetails from './ModalReviewPostDetails'
import PostListItem from './PostListItem'

const PostList = () => {
  const viewModel = usePostViewModel()

  return (
    <>
      <BaseLayout>
        <SkyListWrapperLayout
          before={
            <>
              <Flex className='w-full'>
                <Typography.Text type='secondary' className='text-xl font-semibold'>
                  News ({viewModel.table.dataSource.length})
                </Typography.Text>
              </Flex>
            </>
          }
          addNewProps={{
            onClick: () => viewModel.state.setOpenModalCreate(true)
          }}
        >
          <SkyList
            grid={{ gutter: 20, xxl: 5, xl: 4, lg: 3, md: 2, sm: 1 }}
            itemLayout='horizontal'
            dataSource={viewModel.table.dataSource}
            renderItem={(record, index) => (
              <SkyListItem key={index}>
                <PostListItem
                  record={record}
                  onViewClick={() => {
                    viewModel.state.setNewRecord(record)
                    viewModel.state.setOpenModalReview(true)
                  }}
                  onDelete={() => viewModel.action.handleDelete(record)}
                />
              </SkyListItem>
            )}
          />
        </SkyListWrapperLayout>
      </BaseLayout>
      {viewModel.state.openModalCreate && (
        <ModalAddNewPost
          open={viewModel.state.openModalCreate}
          setOpenModal={viewModel.state.setOpenModalCreate}
          onCreate={viewModel.action.handleCreate}
        />
      )}
      {viewModel.state.openModalReview && viewModel.state.newRecord && (
        <ModalReviewPostDetails
          item={{ ...viewModel.state.newRecord }}
          open={viewModel.state.openModalReview}
          setOpenModal={viewModel.state.setOpenModalReview}
          onSave={viewModel.action.handleUpdate}
        />
      )}
    </>
  )
}

export default PostList
