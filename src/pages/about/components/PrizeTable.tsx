import { UploadFile } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import PrizeAPI from '~/api/services/PrizeAPI'
import useTable from '~/components/hooks/useTable'
import BaseLayout from '~/components/layout/BaseLayout'
import EditableStateCell from '~/components/sky-ui/SkyTable/EditableStateCell'
import SkyTable2 from '~/components/sky-ui/SkyTable/SkyTable2'
import SkyTableRow from '~/components/sky-ui/SkyTable/SkyTableRow'
import SkyTableTypography from '~/components/sky-ui/SkyTable/SkyTableTypography'
import { Prize } from '~/typing'
import { getPublicUrlGoogleDrive, textValidatorChange, textValidatorDisplay, textValidatorInit } from '~/utils/helpers'
import usePrize from '../hooks/usePrize'
import { PrizeTableDataType } from '../type'
import ModalAddNewPrize from './ModalAddNewPrize'

const PrizeTable: React.FC = () => {
  const table = useTable<PrizeTableDataType>([])
  const {
    newRecord,
    setNewRecord,
    openModal,
    setOpenModal,
    handleSaveClick,
    handleAddNewItem,
    handleConfirmDelete,
    handlePageChange,
    prizeService
  } = usePrize(table)

  const columns = {
    id: (record: PrizeTableDataType) => {
      return <SkyTableTypography strong>{textValidatorDisplay(String(record.id))}</SkyTableTypography>
    },
    image: (record: PrizeTableDataType) => {
      return (
        <EditableStateCell
          isEditing={table.isEditing(record.key)}
          dataIndex='imageId'
          title='Image'
          inputType='uploadFile'
          initialValue={textValidatorInit(record.imageId)}
          value={newRecord.imageId}
          onValueChange={(val: UploadFile) => {
            setNewRecord({ ...newRecord, imageId: textValidatorChange(val.response.data.id) })
          }}
        >
          {/* <Image
            alt='banner-img'
            src={getPublicUrlGoogleDrive(record.imageId ?? '')}
            height={120}
            width={120}
            className='object-cover'
            placeholder={<Skeleton.Avatar active={true} size={120} shape='square' />}
          /> */}
          <LazyLoadImage
            width={120}
            height={120}
            className='object-cover'
            alt='banner-img'
            src={getPublicUrlGoogleDrive(record.imageId ?? '')}
          />
        </EditableStateCell>
      )
    },
    title: (record: PrizeTableDataType) => {
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

  const tableColumns: ColumnsType<PrizeTableDataType> = [
    {
      key: 'sort',
      width: '2%'
    },
    {
      title: 'ID',
      dataIndex: 'id',
      width: '5%',
      render: (_value: any, record: PrizeTableDataType) => {
        return columns.id(record)
      }
    },
    {
      title: 'Image',
      dataIndex: 'imageId',
      width: '10%',
      responsive: ['sm'],
      render: (_value: any, record: PrizeTableDataType) => {
        return columns.image(record)
      }
    },
    {
      title: 'Title',
      dataIndex: 'title',
      width: '20%',
      responsive: ['sm'],
      render: (_value: any, record: PrizeTableDataType) => {
        return columns.title(record)
      }
    }
  ]

  return (
    <>
      <BaseLayout
        title='Prizes'
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
          metaData={prizeService.metaData}
          onPageChange={handlePageChange}
          isShowDeleted={table.showDeleted}
          components={{
            body: {
              row: SkyTableRow
            }
          }}
          onDraggableChange={(oldData, newData) => {
            if (newData) {
              console.log({
                oldData,
                newData
              })
              PrizeAPI.updateList(
                newData.map((item, index) => {
                  return { ...item, orderNumber: index } as Prize
                }) as Prize[]
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
        <ModalAddNewPrize
          loading={table.loading}
          openModal={openModal}
          setOpenModal={setOpenModal}
          onAddNew={handleAddNewItem}
        />
      )}
    </>
  )
}

export default PrizeTable
