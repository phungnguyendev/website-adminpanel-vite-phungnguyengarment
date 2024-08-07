import { Collapse, Flex, Typography } from 'antd'
import React from 'react'
import SkyTableWrapperLayout from '~/components/sky-ui/SkyTable/SkyTableWrapperLayout'
import { textValidatorDisplay } from '~/utils/helpers'
import useRecruitmentPostViewModel from '../hooks/useRecruitmentPostViewModel'
import ModalAddNewRecruitment from './ModalAddNewRecruitment'
import RecruitmentListItem from './RecruitmentListItem'

interface Props {}

const RecruitmentList: React.FC<Props> = () => {
  const viewModel = useRecruitmentPostViewModel()
  return (
    <>
      <SkyTableWrapperLayout
        before={
          <>
            <Flex className='w-full'>
              <Typography.Text type='secondary' className='text-xl font-semibold'>
                Recruitment's length ({viewModel.table.dataSource.length})
              </Typography.Text>
            </Flex>
          </>
        }
        addNewProps={{
          onClick: () => viewModel.state.setOpenModalCreate(true)
        }}
        className='overflow-hidden'
      >
        <Collapse
          items={viewModel.table.dataSource.map((record, index) => {
            return {
              key: record.key,
              label: (
                <Typography.Text strong className='text-base'>
                  {textValidatorDisplay(record.jobSector?.title)}
                </Typography.Text>
              ),
              children: (
                <RecruitmentListItem
                  key={index}
                  item={record}
                  editingKey={viewModel.table.editingKey}
                  jobSectors={viewModel.state.jobSectors}
                  isEditing={viewModel.table.isEditing(record.key)}
                  newRecord={viewModel.state.newRecord}
                  setNewRecord={viewModel.state.setNewRecord}
                  onEdit={() => {
                    viewModel.state.setNewRecord({ ...record })
                    viewModel.table.handleStartEditing(record.key)
                  }}
                  onSave={() => viewModel.action.handleUpdate(record)}
                  onDelete={() => viewModel.table.handleStartDeleting(record.key)}
                  onConfirmDelete={() => viewModel.action.handleDelete(record)}
                  onConfirmCancelEditing={() => viewModel.table.handleCancelEditing()}
                  onConfirmCancelDeleting={() => viewModel.table.handleCancelDeleting()}
                />
              )
            }
          })}
        />

        {/* <SkyList
          dataSource={viewModel.table.dataSource}z
          renderItem={(record, index) => {
            return (
              <RecruitmentListItem
                key={index}
                item={record}
                editingKey={viewModel.table.editingKey}
                jobSectors={viewModel.state.jobSectors}
                isEditing={viewModel.table.isEditing(record.key)}
                newRecord={viewModel.state.newRecord}
                setNewRecord={viewModel.state.setNewRecord}
                onEdit={() => {
                  viewModel.state.setNewRecord({ ...record })
                  viewModel.table.handleStartEditing(record.key)
                }}
                onSave={() => viewModel.action.handleUpdate(record)}
                onDelete={() => viewModel.table.handleStartDeleting(record.key)}
                onConfirmDelete={() => viewModel.action.handleDelete(record)}
                onConfirmCancelEditing={() => viewModel.table.handleCancelEditing()}
                onConfirmCancelDeleting={() => viewModel.table.handleCancelDeleting()}
              />
            )
          }}
        /> */}
      </SkyTableWrapperLayout>
      {viewModel.state.openModalCreate && (
        <ModalAddNewRecruitment
          open={viewModel.state.openModalCreate}
          setOpenModal={viewModel.state.setOpenModalCreate}
          onCreate={viewModel.action.handleCreate}
        />
      )}
    </>
  )
}

export default RecruitmentList
