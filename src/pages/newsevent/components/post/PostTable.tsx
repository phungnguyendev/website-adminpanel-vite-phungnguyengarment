import { Flex, Typography } from 'antd'
import { ColumnsType, ColumnType } from 'antd/es/table'
import React from 'react'
import BaseLayout from '~/components/layout/BaseLayout'
import LazyImage from '~/components/sky-ui/LazyImage'
import EditableStateCell from '~/components/sky-ui/SkyTable/EditableStateCell'
import SkyTable from '~/components/sky-ui/SkyTable/SkyTable'
import SkyTableActionRow from '~/components/sky-ui/SkyTable/SkyTableActionRow'
import SkyTableTypography from '~/components/sky-ui/SkyTable/SkyTableTypography'
import SkyTableWrapperLayout from '~/components/sky-ui/SkyTable/SkyTableWrapperLayout'
import { imageValidatorDisplay, textValidatorChange, textValidatorDisplay, textValidatorInit } from '~/utils/helpers'
import usePostViewModel from '../../hooks/usePostViewModel'
import { PostTableDataType } from '../../type'
import ModalAddNewPost from './ModalAddNewPost'

const PostTable: React.FC = () => {
  const viewModel = usePostViewModel()

  const columns = {
    id: (record: PostTableDataType) => {
      return <SkyTableTypography strong>{textValidatorDisplay(`#${record.id}`)}</SkyTableTypography>
    },
    image: (record: PostTableDataType) => {
      return (
        <EditableStateCell
          isEditing={viewModel.table.isEditing(record.key)}
          inputType='textarea'
          defaultValue={record.imageUrl}
          value={viewModel.state.newRecord?.imageUrl}
          onValueChange={(value: string) => {
            viewModel.state.setNewRecord((prev) => {
              return { ...prev, imageUrl: textValidatorChange(value) }
            })
          }}
        >
          <LazyImage
            alt='img'
            src={imageValidatorDisplay(record.imageUrl)}
            height={120}
            width={120}
            className='object-cover'
          />
        </EditableStateCell>
      )
    },
    title: (record: PostTableDataType) => {
      return (
        <EditableStateCell
          isEditing={viewModel.table.isEditing(record.key!)}
          inputType='text'
          defaultValue={textValidatorInit(record.title)}
          value={viewModel.state.newRecord?.title}
          onValueChange={(val: string) =>
            viewModel.state.setNewRecord((prev) => {
              return { ...prev, title: textValidatorChange(val) }
            })
          }
        >
          <SkyTableTypography>{textValidatorDisplay(record.title)}</SkyTableTypography>
        </EditableStateCell>
      )
    },
    actionCol: (record: PostTableDataType) => {
      return (
        <SkyTableActionRow
          record={record}
          editingKey={viewModel.table.editingKey}
          deletingKey={viewModel.table.deletingKey}
          buttonEdit={{
            onClick: () => {
              viewModel.state.setNewRecord({
                title: record.title,
                imageUrl: record.imageUrl
              })
              viewModel.table.handleStartEditing(record.key)
            }
          }}
          buttonSave={{
            // Save
            onClick: () => viewModel.action.handleUpdate(record)
          }}
          // Start delete
          buttonDelete={{
            onClick: () => viewModel.table.handleStartDeleting(record.key)
          }}
          // Cancel editing
          onConfirmCancelEditing={() => viewModel.table.handleCancelEditing()}
          // Cancel delete
          onConfirmCancelDeleting={() => viewModel.table.handleCancelDeleting()}
          // Delete (update status record => 'deleted')
          onConfirmDelete={() => viewModel.action.handleDelete(record)}
        />
      )
    }
  }

  const tableColumns: ColumnsType<PostTableDataType> = [
    {
      key: 'sort',
      width: '2%'
    },
    {
      title: 'ID',
      dataIndex: 'id',
      width: '5%',
      render: (_value: any, record: PostTableDataType) => {
        return columns.id(record)
      }
    },
    {
      title: 'Image',
      dataIndex: 'imageUrl',
      width: '20%',
      responsive: ['sm'],
      render: (_value: any, record: PostTableDataType) => {
        return columns.image(record)
      }
    },
    {
      title: 'Title',
      dataIndex: 'title',
      width: '20%',
      responsive: ['sm'],
      render: (_value: any, record: PostTableDataType) => {
        return columns.title(record)
      }
    }
  ]

  const actionCol: ColumnType<PostTableDataType> = {
    title: 'Operation',
    width: '0.001%',
    render: (_value: any, record: PostTableDataType) => {
      return columns.actionCol(record)
    }
  }

  return (
    <>
      <BaseLayout>
        <SkyTableWrapperLayout
          before={
            <>
              <Flex className='w-full'>
                <Typography.Text type='secondary' className='text-xl font-semibold'>
                  Posts ({viewModel.table.dataSource.length})
                </Typography.Text>
              </Flex>
            </>
          }
          addNewProps={{
            onClick: () => viewModel.state.setOpenModalCreate(true)
          }}
        >
          <SkyTable
            loading={viewModel.table.loading}
            tableColumns={{
              columns: tableColumns,
              actionColumn: actionCol
              // showAction: isAcceptRole(PERMISSION_ACCESS_ROLE, currentUser.roles)
            }}
            dataSource={viewModel.table.dataSource}
            setDataSource={viewModel.table.setDataSource}
            pagination={{
              pageSize: viewModel.table.paginator.pageSize,
              current: viewModel.table.paginator.page,
              onChange: viewModel.action.handlePageChange
            }}
            onDragEnd={viewModel.action.handleDraggableEnd}
          />
        </SkyTableWrapperLayout>
      </BaseLayout>

      {viewModel.state.openModalCreate && (
        <ModalAddNewPost
          open={viewModel.state.openModalCreate}
          setOpenModal={viewModel.state.setOpenModalCreate}
          onCreate={viewModel.action.handleCreate}
        />
      )}
    </>
  )
}

export default PostTable
