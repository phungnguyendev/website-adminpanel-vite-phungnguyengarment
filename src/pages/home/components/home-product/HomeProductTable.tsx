import { Skeleton, UploadFile } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import HomeProductAPI from '~/api/services/HomeProductAPI'
import { NoImage } from '~/assets'
import useTable from '~/components/hooks/useTable'
import BaseLayout from '~/components/layout/BaseLayout'
import EditableStateCell from '~/components/sky-ui/SkyTable/EditableStateCell'
import SkyTable2 from '~/components/sky-ui/SkyTable/SkyTable2'
import SkyTableRow from '~/components/sky-ui/SkyTable/SkyTableRow'
import SkyTableTypography from '~/components/sky-ui/SkyTable/SkyTableTypography'
import { HomeProduct } from '~/typing'
import { getPublicUrlGoogleDrive, textValidatorChange, textValidatorDisplay, textValidatorInit } from '~/utils/helpers'
import useHomeProduct from '../../hooks/useHomeProduct'
import { HomeProductTableDataType } from '../../type'
import ModalAddNewHomeProduct from './ModalAddNewHomeProduct'

const HomeProductTable: React.FC = () => {
  const table = useTable<HomeProductTableDataType>([])
  const {
    newRecord,
    setNewRecord,
    openModal,
    setOpenModal,
    handleSaveClick,
    handleAddNewItem,
    handleConfirmDelete,
    handlePageChange,
    homeProductService
  } = useHomeProduct(table)

  const columns = {
    id: (record: HomeProductTableDataType) => {
      return <SkyTableTypography strong>{textValidatorDisplay(String(record.id))}</SkyTableTypography>
    },
    image: (record: HomeProductTableDataType) => {
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
            className='object-contain'
            alt='banner-img'
            src={getPublicUrlGoogleDrive(record.imageId ?? '')}
            placeholder={<Skeleton.Avatar active size={120} shape='square' />}
            placeholderSrc={NoImage}
          />
        </EditableStateCell>
      )
    },
    title: (record: HomeProductTableDataType) => {
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

  const tableColumns: ColumnsType<HomeProductTableDataType> = [
    {
      key: 'sort',
      width: '2%'
    },
    {
      title: 'ID',
      dataIndex: 'id',
      width: '5%',
      render: (_value: any, record: HomeProductTableDataType) => {
        return columns.id(record)
      }
    },
    {
      title: 'Image',
      dataIndex: 'imageId',
      width: '10%',
      responsive: ['sm'],
      render: (_value: any, record: HomeProductTableDataType) => {
        return columns.image(record)
      }
    },
    {
      title: 'Title',
      dataIndex: 'title',
      width: '20%',
      responsive: ['sm'],
      render: (_value: any, record: HomeProductTableDataType) => {
        return columns.title(record)
      }
    }
  ]

  return (
    <>
      <BaseLayout
        title='Home products'
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
          metaData={homeProductService.metaData}
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
              HomeProductAPI.updateList(
                newData.map((item, index) => {
                  return { ...item, orderNumber: index } as HomeProduct
                }) as HomeProduct[]
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
        <ModalAddNewHomeProduct
          loading={table.loading}
          openModal={openModal}
          setOpenModal={setOpenModal}
          onAddNew={handleAddNewItem}
        />
      )}
    </>
  )
}

export default HomeProductTable
