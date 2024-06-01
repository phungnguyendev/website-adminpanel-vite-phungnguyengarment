import { ColumnsType } from 'antd/es/table'
import BaseLayout from '~/components/layout/BaseLayout'
import EditableStateCell from '~/components/sky-ui/SkyTable/EditableStateCell'
import SkyTable2 from '~/components/sky-ui/SkyTable/SkyTable'
import SkyTableRow from '~/components/sky-ui/SkyTable/SkyTableRow'
import SkyTableTypography from '~/components/sky-ui/SkyTable/SkyTableTypography'
import { IndustrySector } from '~/typing'
import {
  numberValidatorChange,
  numberValidatorDisplay,
  textValidatorChange,
  textValidatorDisplay,
  textValidatorInit
} from '~/utils/helpers'
import useRecruitmentViewModel from '../hooks/useRecruitmentViewModel'
import { RecruitmentTableDataType } from '../type'
import ModalAddNewRecruitment from './ModalAddNewBranch'

const RecruitmentTable: React.FC = () => {
  const { table, state, action, service } = useRecruitmentViewModel()
  const { newRecord, setNewRecord, openModal, setOpenModal, industrySectors } = state
  const { onUpdate, onCreate, onDelete, onPage } = action
  const { recruitmentService } = service

  const matchIndustrySectorItem = (industrySectorID?: number | null | undefined): IndustrySector | undefined => {
    return industrySectors.find((self) => self.id === industrySectorID)
  }

  const columns: ColumnsType<RecruitmentTableDataType> = [
    {
      title: 'Vị trí tuyển dụng',
      dataIndex: 'vacancies',
      width: '20%',
      render: (_value: any, record: RecruitmentTableDataType) => {
        return (
          <EditableStateCell
            isEditing={table.isEditing(record.key)}
            dataIndex='vacancies'
            title='Vị trí tuyển dụng'
            inputType='select'
            selectProps={{
              options: industrySectors.map((item) => {
                return {
                  value: numberValidatorDisplay(item.id),
                  label: textValidatorDisplay(item.title),
                  optionData: numberValidatorDisplay(item.id)
                }
              }),
              defaultValue: textValidatorInit(matchIndustrySectorItem(record.industrySectorID)?.title)
            }}
            onValueChange={(industrySectorID: number) => {
              setNewRecord({ ...newRecord, industrySectorID: numberValidatorChange(industrySectorID) })
            }}
          >
            <SkyTableTypography placeholder='asd' status={'active'}>
              {textValidatorDisplay(record.vacancies)}
            </SkyTableTypography>
          </EditableStateCell>
        )
      }
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      width: '5%',
      responsive: ['sm'],
      render: (_value: any, record: RecruitmentTableDataType) => {
        return (
          <EditableStateCell
            isEditing={table.isEditing(record.key)}
            dataIndex='quantity'
            title='Quantity'
            inputType='number'
            initialValue={textValidatorInit(record.quantity)}
            value={newRecord.quantity}
            onValueChange={(quantity: string) => {
              setNewRecord({ ...newRecord, quantity: textValidatorChange(quantity) })
            }}
          >
            <SkyTableTypography placeholder='asd' status={'active'}>
              {textValidatorDisplay(record.quantity)}
            </SkyTableTypography>
          </EditableStateCell>
        )
      }
    },
    {
      title: 'Mức lương',
      dataIndex: 'wage',
      width: '10%',
      responsive: ['sm'],
      render: (_value: any, record: RecruitmentTableDataType) => {
        return (
          <EditableStateCell
            isEditing={table.isEditing(record.key)}
            dataIndex='wage'
            title='Wage'
            inputType='text'
            initialValue={textValidatorInit(record.wage)}
            value={newRecord.wage}
            onValueChange={(wage: string) => {
              setNewRecord({ ...newRecord, wage: textValidatorChange(wage) })
            }}
          >
            <SkyTableTypography placeholder='asd' status={'active'}>
              {textValidatorDisplay(record.wage)}
            </SkyTableTypography>
          </EditableStateCell>
        )
      }
    },
    {
      title: 'Thời gian làm việc',
      dataIndex: 'workingTime',
      width: '15%',
      responsive: ['sm'],
      render: (_value: any, record: RecruitmentTableDataType) => {
        return (
          <EditableStateCell
            isEditing={table.isEditing(record.key)}
            dataIndex='workingTime'
            title='Working Time'
            inputType='text'
            initialValue={textValidatorInit(record.workingTime)}
            value={newRecord.workingTime}
            onValueChange={(workingTime: string) => {
              setNewRecord({ ...newRecord, workingTime: textValidatorChange(workingTime) })
            }}
          >
            <SkyTableTypography placeholder='asd' status={'active'}>
              {textValidatorDisplay(record.workingTime)}
            </SkyTableTypography>
          </EditableStateCell>
        )
      }
    },
    {
      title: 'Nơi làm việc',
      dataIndex: 'workingPlace',
      width: '15%',
      responsive: ['sm'],
      render: (_value: any, record: RecruitmentTableDataType) => {
        return (
          <EditableStateCell
            isEditing={table.isEditing(record.key)}
            dataIndex='workingPlace'
            title='Working place'
            inputType='text'
            initialValue={textValidatorInit(record.workingPlace)}
            value={newRecord.workingPlace}
            onValueChange={(workingPlace: string) => {
              setNewRecord({ ...newRecord, workingPlace: textValidatorChange(workingPlace) })
            }}
          >
            <SkyTableTypography placeholder='asd' status={'active'}>
              {textValidatorDisplay(record.workingPlace)}
            </SkyTableTypography>
          </EditableStateCell>
        )
      }
    },
    {
      title: 'Ngày hết hạn',
      dataIndex: 'expirationDate',
      width: '10%',
      responsive: ['sm'],
      render: (_value: any, record: RecruitmentTableDataType) => {
        return (
          <EditableStateCell
            isEditing={table.isEditing(record.key)}
            dataIndex='expirationDate'
            title='Expiration Date'
            inputType='text'
            initialValue={textValidatorInit(record.expirationDate)}
            value={newRecord.expirationDate}
            onValueChange={(expirationDate: string) => {
              setNewRecord({ ...newRecord, expirationDate: textValidatorChange(expirationDate) })
            }}
          >
            <SkyTableTypography placeholder='asd' status={'active'}>
              {textValidatorDisplay(record.expirationDate)}
            </SkyTableTypography>
          </EditableStateCell>
        )
      }
    }
  ]

  return (
    <>
      <BaseLayout
        title='Recruitment'
        titleProps={{
          level: 3,
          type: 'secondary'
        }}
        onAddNewClick={{
          onClick: () => setOpenModal(true),
          isShow: true
        }}
      >
        <SkyTable2
          dataSource={table.dataSource}
          setDataSource={table.setDataSource}
          loading={table.loading}
          columns={columns}
          editingKey={table.editingKey}
          deletingKey={table.deletingKey}
          metaData={recruitmentService.metaData}
          onPageChange={onPage}
          isShowDeleted={table.showDeleted}
          components={{
            body: {
              row: SkyTableRow
            }
          }}
          onDraggableChange={(oldData, newData) => {
            if (newData) {
              console.table({
                oldData: oldData,
                newData: newData
              })
            }
          }}
          actionProps={{
            onEdit: {
              onClick: (_e, record) => {
                setNewRecord({ ...record })
                table.handleStartEditing(record!.key!)
              },
              isShow: true
            },
            onSave: {
              onClick: (_e, record) => onUpdate(record!)
            },
            onDelete: {
              onClick: (_e, record) => table.handleStartDeleting(record!.key!),
              isShow: !table.showDeleted
            },
            onRestore: {
              onClick: (_e, record) => table.handleStartRestore(record!.key!),
              isShow: false
            },
            onConfirmCancelEditing: () => {
              table.handleConfirmCancelEditing()
            },
            onConfirmCancelDeleting: () => table.handleConfirmCancelDeleting(),
            onConfirmDelete: (record) => onDelete(record),
            onConfirmCancelRestore: () => table.handleConfirmCancelRestore(),
            isShow: true
          }}
        />
      </BaseLayout>
      {openModal && (
        <ModalAddNewRecruitment
          loading={table.loading}
          openModal={openModal}
          setOpenModal={setOpenModal}
          onAddNew={onCreate}
        />
      )}
    </>
  )
}

export default RecruitmentTable
