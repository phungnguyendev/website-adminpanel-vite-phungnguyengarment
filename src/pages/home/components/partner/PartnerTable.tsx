import type { ColumnsType } from 'antd/es/table'
import PartnerAPI from '~/api/services/PartnerAPI'
import useTable from '~/components/hooks/useTable'
import BaseLayout from '~/components/layout/BaseLayout'
import LazyImage from '~/components/sky-ui/LazyImage'
import EditableStateCell from '~/components/sky-ui/SkyTable/EditableStateCell'
import SkyTable2 from '~/components/sky-ui/SkyTable/SkyTable'
import SkyTableRow from '~/components/sky-ui/SkyTable/SkyTableRow'
import SkyTableTypography from '~/components/sky-ui/SkyTable/SkyTableTypography'
import { Partner } from '~/typing'
import { textValidatorChange, textValidatorDisplay, textValidatorInit } from '~/utils/helpers'
import usePartner from '../../hooks/usePartner'
import { PartnerTableDataType } from '../../type'
import ModalAddNewPartner from './ModalAddNewPartner'

const PartnerTable: React.FC = () => {
  const table = useTable<PartnerTableDataType>([])
  const {
    newRecord,
    setNewRecord,
    openModal,
    setOpenModal,
    handleSaveClick,
    handleAddNewItem,
    handleConfirmDelete,
    handlePageChange,
    partnerService
  } = usePartner(table)

  const columns = {
    id: (record: PartnerTableDataType) => {
      return <SkyTableTypography strong>{textValidatorDisplay(String(record.id))}</SkyTableTypography>
    },
    image: (record: PartnerTableDataType) => {
      return (
        <EditableStateCell
          isEditing={table.isEditing(record.key)}
          dataIndex='imageUrl'
          title='Image'
          placeholder='Paste your image link..'
          inputType='text'
          initialValue={textValidatorInit(record.imageUrl)}
          value={newRecord.imageUrl}
          onValueChange={(newImage: string) => {
            setNewRecord({ ...newRecord, imageUrl: textValidatorChange(newImage) })
          }}
        >
          <LazyImage
            alt='banner-img'
            className='object-contain'
            src={textValidatorDisplay(record.imageUrl)}
            height={120}
            width={120}
          />
        </EditableStateCell>
      )
    },
    title: (record: PartnerTableDataType) => {
      return (
        <EditableStateCell
          isEditing={table.isEditing(record.key!)}
          dataIndex='title'
          title='Title'
          inputType='text'
          required={true}
          initialValue={textValidatorInit(record.title)}
          value={newRecord.title}
          onValueChange={(val: string) => setNewRecord({ ...newRecord, title: textValidatorChange(val) })}
        >
          <SkyTableTypography placeholder='asd' status={'active'}>
            {textValidatorDisplay(record.title)}
          </SkyTableTypography>
        </EditableStateCell>
      )
    }
  }

  const tableColumns: ColumnsType<PartnerTableDataType> = [
    {
      key: 'sort',
      width: '2%'
    },
    {
      title: 'ID',
      dataIndex: 'id',
      width: '5%',
      render: (_value: any, record: PartnerTableDataType) => {
        return columns.id(record)
      }
    },
    {
      title: 'Image',
      dataIndex: 'imageUrl',
      width: '10%',
      responsive: ['sm'],
      render: (_value: any, record: PartnerTableDataType) => {
        return columns.image(record)
      }
    },
    {
      title: 'Title',
      dataIndex: 'title',
      width: '20%',
      responsive: ['sm'],
      render: (_value: any, record: PartnerTableDataType) => {
        return columns.title(record)
      }
    }
  ]

  return (
    <>
      <BaseLayout
        title='Partners'
        titleProps={{
          level: 5,
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
          columns={tableColumns}
          editingKey={table.editingKey}
          deletingKey={table.deletingKey}
          metaData={partnerService.metaData}
          onPageChange={handlePageChange}
          isShowDeleted={table.showDeleted}
          components={{
            body: {
              row: SkyTableRow
            }
          }}
          onDraggableChange={(_, newData) => {
            if (newData) {
              PartnerAPI.updateList(
                newData.map((item, index) => {
                  return { ...item, orderNumber: index } as Partner
                }) as Partner[]
              )
                .then((res) => {
                  if (!res?.success) {
                    throw new Error(`${res?.message}`)
                  }
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
              onClick: (_e, record) => handleSaveClick(record!)
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
            onConfirmDelete: (record) => handleConfirmDelete(record),
            onConfirmCancelRestore: () => table.handleConfirmCancelRestore(),
            isShow: true
          }}
        />
      </BaseLayout>
      {openModal && (
        <ModalAddNewPartner
          loading={table.loading}
          openModal={openModal}
          setOpenModal={setOpenModal}
          onAddNew={handleAddNewItem}
        />
      )}
    </>
  )
}

export default PartnerTable
