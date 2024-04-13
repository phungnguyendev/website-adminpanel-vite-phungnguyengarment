import { Typography } from 'antd'
import useTable from '~/components/hooks/useTable'
import SkyList from '~/components/sky-ui/SkyList/SkyList'
import SkyListItem from '~/components/sky-ui/SkyList/SkyListItem'
import usePost from '../../hooks/usePost'
import { PostTableDataType } from '../../type'

const PostList = () => {
  const table = useTable<PostTableDataType>([])
  const {
    newRecord,
    setNewRecord,
    openModal,
    setOpenModal,
    handleSaveClick,
    handleAddNewItem,
    handleConfirmDelete,
    handlePageChange,
    postService
  } = usePost(table)

  return (
    <>
      <SkyList
        dataSource={table.dataSource}
        renderItem={(item) => (
          <SkyListItem>
            <Typography.Title>{item.title}</Typography.Title>
          </SkyListItem>
        )}
      />
    </>
  )
}

export default PostList
