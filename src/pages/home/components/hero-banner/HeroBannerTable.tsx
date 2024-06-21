import { UploadFile } from 'antd'
import { ColumnsType } from 'antd/es/table'
import BaseLayout from '~/components/layout/BaseLayout'
import LazyImage from '~/components/sky-ui/LazyImage'
import EditableStateCell from '~/components/sky-ui/SkyTable/EditableStateCell'
import SkyTable from '~/components/sky-ui/SkyTable/SkyTable'
import SkyTableTypography from '~/components/sky-ui/SkyTable/SkyTableTypography'
import { imageValidatorDisplay, textValidatorChange, textValidatorDisplay, textValidatorInit } from '~/utils/helpers'
import useBannerViewModel from '../../hooks/useBannerViewModel'
import { BannerTableDataType } from '../../type'
import ModalAddNewHeroBanner from './ModalAddNewHeroBanner'
import ModalUpdateHeroBanner from './ModalUpdateHeroBanner'

const HeroBannerTable: React.FC = () => {
  const { table, state, action } = useBannerViewModel()
  const {
    newRecord,
    setNewRecord,
    recorded,
    setRecorded,
    openModalCreate,
    setOpenModalCreate,
    openModalUpdate,
    setOpenModalUpdate
  } = state
  const { handleCreate, handleUpdate, handleDelete, handlePageChange, handleDraggableChange } = action

  console.log('Hero Banner Table')

  const columns = {
    id: (record: BannerTableDataType) => {
      return <SkyTableTypography strong>{textValidatorDisplay(`#${record.id}`)}</SkyTableTypography>
    },
    image: (record: BannerTableDataType) => {
      return (
        <EditableStateCell
          isEditing={table.isEditing(record.key)}
          inputType='upload'
          uploadProps={{
            multiple: true
          }}
          // defaultValue={record.imageUrl}
          value={newRecord.images}
          onValueChange={(info: UploadFile) => {
            console.log(info)
            // setNewRecord({ ...newRecord, images: ([] as UploadFile[]).push(info) })
          }}
        >
          <LazyImage alt='banner-img' src={imageValidatorDisplay(record.imageName)} height={120} width={120} />
        </EditableStateCell>
      )
    },
    title: (record: BannerTableDataType) => {
      return (
        <EditableStateCell
          isEditing={table.isEditing(record.key!)}
          inputType='text'
          defaultValue={textValidatorInit(record.title)}
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

  const tableColumns: ColumnsType<BannerTableDataType> = [
    {
      key: 'sort',
      width: '2%'
    },
    {
      title: 'ID',
      dataIndex: 'id',
      width: '5%',
      render: (_value: any, record: BannerTableDataType) => {
        return columns.id(record)
      }
    },
    {
      title: 'Image',
      dataIndex: 'imageUrl',
      width: '10%',
      responsive: ['sm'],
      render: (_value: any, record: BannerTableDataType) => {
        return columns.image(record)
      }
    },
    {
      title: 'Title',
      dataIndex: 'title',
      width: '20%',
      responsive: ['sm'],
      render: (_value: any, record: BannerTableDataType) => {
        return columns.title(record)
      }
    }
  ]

  return (
    <>
      <BaseLayout
        title='Hero banners'
        titleProps={{
          level: 5,
          type: 'secondary'
        }}
        onAddNewClick={{
          onClick: () => setOpenModalCreate(true),
          isShow: true
        }}
      >
        <SkyTable
          {...table}
          onDragEnd={handleDraggableChange}
          columns={tableColumns}
          onPageChange={handlePageChange}
          isShowDeleted={table.showDeleted}
          actionProps={{
            onEdit: {
              onClick: (_e, record) => {
                setRecorded({ id: record?.id ?? -1, ...record })
                // table.handleStartEditing(record!.key!)
                setOpenModalUpdate((prev) => !prev)
              },
              isShow: true,
              disabled: openModalUpdate
            },
            // onSave: {
            //   onClick: (_e, record) => onUpdate(record!)
            // },
            onDelete: {
              onClick: (_e, record) => table.handleStartDeleting(record!.key!),
              isShow: !table.showDeleted
            },
            onRestore: {
              onClick: (_e, record) => table.handleStartRestore(record!.key!),
              isShow: false
            },
            onConfirmCancelEditing: () => {
              table.handleCancelEditing()
            },
            onConfirmCancelDeleting: () => table.handleCancelDeleting(),
            onConfirmDelete: (record) => handleDelete(record),
            onConfirmCancelRestore: () => table.handleCancelRestore(),
            isShow: true
          }}
        />
      </BaseLayout>

      {openModalCreate && (
        <ModalAddNewHeroBanner open={openModalCreate} setOpenModal={setOpenModalCreate} onCreate={handleCreate} />
      )}
      {openModalUpdate && (
        <ModalUpdateHeroBanner
          record={recorded}
          open={openModalUpdate}
          setOpenModal={setOpenModalUpdate}
          onUpdate={handleUpdate}
        />
      )}
    </>
  )
}

export default HeroBannerTable
