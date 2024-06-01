import { ColumnsType } from 'antd/es/table'
import { useEffect } from 'react'
import IndustrySectorAPI from '~/api/services/IndustrySectorAPI'
import BaseLayout from '~/components/layout/BaseLayout'
import EditableStateCell from '~/components/sky-ui/SkyTable/EditableStateCell'
import SkyTable2 from '~/components/sky-ui/SkyTable/SkyTable'
import SkyTableRow from '~/components/sky-ui/SkyTable/SkyTableRow'
import SkyTableTypography from '~/components/sky-ui/SkyTable/SkyTableTypography'
import { IndustrySector } from '~/typing'
import { textValidatorChange, textValidatorDisplay, textValidatorInit } from '~/utils/helpers'
import useBranchViewModel from '../hooks/useBranchViewModel'
import { BranchTableDataType } from '../type'
import ModalAddNewBranch from './ModalAddNewBranch'

const BranchTable: React.FC = () => {
  const { table, state, action, service } = useBranchViewModel()
  const { newRecord, setNewRecord, openModal, setOpenModal } = state
  const { onUpdate, onCreate, onDelete, onPage } = action
  const { branchService } = service

  useEffect(() => {
    console.log(table.dataSource)
  }, [table.dataSource])

  const columns: ColumnsType<BranchTableDataType> = [
    {
      title: 'Chi nhánh',
      dataIndex: 'title',
      render: (_value: any, record: BranchTableDataType) => {
        return (
          <EditableStateCell
            isEditing={table.isEditing(record.key)}
            dataIndex='title'
            title='Title'
            inputType='text'
            initialValue={textValidatorInit(record.title)}
            value={newRecord.title}
            onValueChange={(title: string) => {
              setNewRecord({ ...newRecord, title: textValidatorChange(title) })
            }}
          >
            <SkyTableTypography placeholder='asd' status={'active'}>
              {textValidatorDisplay(record.title)}
            </SkyTableTypography>
          </EditableStateCell>
        )
      }
    }
  ]

  return (
    <>
      <BaseLayout
        title='Branch'
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
          metaData={branchService.metaData}
          onPageChange={onPage}
          isShowDeleted={table.showDeleted}
          components={{
            body: {
              row: SkyTableRow
            }
          }}
          onDraggableChange={(_, newData) => {
            if (newData) {
              IndustrySectorAPI.updateList(
                newData.map((item, index) => {
                  return { ...item, orderNumber: index } as IndustrySector
                }) as IndustrySector[]
              )
                .then((res) => {
                  if (res?.success) console.log(res?.data)
                })
                .catch((e) => console.log(`${e}`))
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
        <ModalAddNewBranch
          loading={table.loading}
          openModal={openModal}
          setOpenModal={setOpenModal}
          onAddNew={onCreate}
        />
      )}
    </>
  )
}

export default BranchTable
