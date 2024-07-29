import { Flex, Typography } from 'antd'
import { ColumnsType, ColumnType } from 'antd/es/table'
import BaseLayout from '~/components/layout/BaseLayout'
import EditableStateCell from '~/components/sky-ui/SkyTable/EditableStateCell'
import SkyTable from '~/components/sky-ui/SkyTable/SkyTable'
import SkyTableActionRow from '~/components/sky-ui/SkyTable/SkyTableActionRow'
import SkyTableTypography from '~/components/sky-ui/SkyTable/SkyTableTypography'
import SkyTableWrapperLayout from '~/components/sky-ui/SkyTable/SkyTableWrapperLayout'
import {
  dateValidatorChange,
  dateValidatorDisplay,
  dateValidatorInit,
  numberValidatorChange,
  numberValidatorDisplay,
  numberValidatorInit,
  textValidatorChange,
  textValidatorDisplay,
  textValidatorInit
} from '~/utils/helpers'
import useRecruitmentPostViewModel from '../hooks/useRecruitmentPostViewModel'
import { RecruitmentPostTableDataType } from '../type'
import ModalAddNewRecruitment from './ModalAddNewRecruitment'

const RecruitmentTable: React.FC = () => {
  const viewModel = useRecruitmentPostViewModel()
  const columns = {
    id: (record: RecruitmentPostTableDataType) => {
      return <SkyTableTypography strong>{textValidatorDisplay(`#${record.id}`)}</SkyTableTypography>
    },
    jobSector: (record: RecruitmentPostTableDataType) => {
      return (
        <EditableStateCell
          isEditing={viewModel.table.isEditing(record.key)}
          dataIndex='vacancies'
          title='Vị trí tuyển dụng'
          required
          inputType='select'
          onValueChange={(val: number) =>
            viewModel.state.setNewRecord((prev) => {
              return { ...prev, jobSectorID: numberValidatorChange(val) }
            })
          }
          defaultValue={numberValidatorInit(record.jobSectorID)}
          selectProps={{
            options: viewModel.state.jobSectors.map((item, index) => {
              return { label: item.title, value: item.id, key: index }
            })
          }}
        >
          <Flex wrap='wrap' justify='space-between' align='center' gap={10}>
            <SkyTableTypography className='w-fit'>{textValidatorDisplay(record.jobSector?.title)}</SkyTableTypography>
          </Flex>
        </EditableStateCell>
      )
    },
    quantity: (record: RecruitmentPostTableDataType) => {
      return (
        <EditableStateCell
          isEditing={viewModel.table.isEditing(record.key)}
          inputType='number'
          defaultValue={numberValidatorInit(record.quantity)}
          value={viewModel.state.newRecord?.quantity}
          onValueChange={(val: number) =>
            viewModel.state.setNewRecord((prev) => {
              return { ...prev, quantity: numberValidatorChange(val) }
            })
          }
        >
          <SkyTableTypography>{numberValidatorDisplay(record.quantity)}</SkyTableTypography>
        </EditableStateCell>
      )
    },
    wage: (record: RecruitmentPostTableDataType) => {
      return (
        <EditableStateCell
          isEditing={viewModel.table.isEditing(record.key)}
          inputType='text'
          defaultValue={textValidatorInit(record.wage)}
          value={viewModel.state.newRecord?.wage}
          onValueChange={(val: string) =>
            viewModel.state.setNewRecord((prev) => {
              return { ...prev, wage: textValidatorChange(val) }
            })
          }
        >
          <SkyTableTypography>{textValidatorDisplay(record.wage)}</SkyTableTypography>
        </EditableStateCell>
      )
    },
    workingTime: (record: RecruitmentPostTableDataType) => {
      return (
        <EditableStateCell
          isEditing={viewModel.table.isEditing(record.key)}
          inputType='text'
          defaultValue={textValidatorInit(record.workingTime)}
          value={viewModel.state.newRecord?.workingTime}
          onValueChange={(val: string) =>
            viewModel.state.setNewRecord((prev) => {
              return { ...prev, workingTime: textValidatorChange(val) }
            })
          }
        >
          <SkyTableTypography>{textValidatorDisplay(record.workingTime)}</SkyTableTypography>
        </EditableStateCell>
      )
    },
    workingPlace: (record: RecruitmentPostTableDataType) => {
      return (
        <EditableStateCell
          isEditing={viewModel.table.isEditing(record.key)}
          inputType='text'
          defaultValue={textValidatorInit(record.workingPlace)}
          value={viewModel.state.newRecord?.workingPlace}
          onValueChange={(val: string) =>
            viewModel.state.setNewRecord((prev) => {
              return { ...prev, workingPlace: textValidatorChange(val) }
            })
          }
        >
          <SkyTableTypography>{textValidatorDisplay(record.workingPlace)}</SkyTableTypography>
        </EditableStateCell>
      )
    },
    expirationDate: (record: RecruitmentPostTableDataType) => {
      return (
        <EditableStateCell
          isEditing={viewModel.table.isEditing(record.key)}
          inputType='datepicker'
          defaultValue={dateValidatorInit(record.expirationDate)}
          value={viewModel.state.newRecord?.expirationDate}
          onValueChange={(val: string) =>
            viewModel.state.setNewRecord((prev) => {
              return { ...prev, expirationDate: dateValidatorChange(val) }
            })
          }
        >
          <SkyTableTypography>{dateValidatorDisplay(record.expirationDate)}</SkyTableTypography>
        </EditableStateCell>
      )
    },
    actionCol: (record: RecruitmentPostTableDataType) => {
      return (
        <SkyTableActionRow
          record={record}
          editingKey={viewModel.table.editingKey}
          deletingKey={viewModel.table.deletingKey}
          buttonEdit={{
            onClick: () => {
              viewModel.state.setNewRecord({
                jobSectorID: record.jobSectorID,
                quantity: record.quantity,
                wage: record.wage,
                workingTime: record.workingTime,
                workingPlace: record.workingPlace,
                expirationDate: record.expirationDate
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

  const tableColumns: ColumnsType<RecruitmentPostTableDataType> = [
    {
      key: 'sort',
      width: '2%'
    },
    {
      title: 'ID',
      dataIndex: 'id',
      width: '5%',
      render: (_value: any, record: RecruitmentPostTableDataType) => {
        return columns.id(record)
      }
    },
    {
      title: 'Vị trí tuyển dụng',
      dataIndex: 'jobSector',
      width: '20%',
      responsive: ['sm'],
      render: (_value: any, record: RecruitmentPostTableDataType) => {
        return columns.jobSector(record)
      }
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      width: '10%',
      responsive: ['sm'],
      render: (_value: any, record: RecruitmentPostTableDataType) => {
        return columns.quantity(record)
      }
    },
    {
      title: 'Mức lương',
      dataIndex: 'wage',
      width: '10%',
      responsive: ['sm'],
      render: (_value: any, record: RecruitmentPostTableDataType) => {
        return columns.wage(record)
      }
    },
    {
      title: 'Thời gian làm việc',
      dataIndex: 'workingTime',
      width: '15%',
      responsive: ['sm'],
      render: (_value: any, record: RecruitmentPostTableDataType) => {
        return columns.workingTime(record)
      }
    },
    {
      title: 'Nơi làm việc',
      dataIndex: 'workingPlace',
      width: '15%',
      responsive: ['sm'],
      render: (_value: any, record: RecruitmentPostTableDataType) => {
        return columns.workingPlace(record)
      }
    },
    {
      title: 'Ngày hết hạn',
      dataIndex: 'expirationDate',
      width: '15%',
      responsive: ['sm'],
      render: (_value: any, record: RecruitmentPostTableDataType) => {
        return columns.expirationDate(record)
      }
    }
  ]

  const actionCol: ColumnType<RecruitmentPostTableDataType> = {
    title: 'Operation',
    width: '0.001%',
    render: (_value: any, record: RecruitmentPostTableDataType) => {
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
                  Recruitment's length ({viewModel.table.dataSource.length})
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
        <ModalAddNewRecruitment
          open={viewModel.state.openModalCreate}
          setOpenModal={viewModel.state.setOpenModalCreate}
          onCreate={viewModel.action.handleCreate}
        />
      )}
    </>
  )
}

export default RecruitmentTable
