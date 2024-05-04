import { ColumnsType } from 'antd/es/table'
import CategoryAPI from '~/api/services/CategoryAPI'
import useTable from '~/components/hooks/useTable'
import BaseLayout from '~/components/layout/BaseLayout'
import LazyImage from '~/components/sky-ui/LazyImage'
import EditableStateCell from '~/components/sky-ui/SkyTable/EditableStateCell'
import SkyTable2 from '~/components/sky-ui/SkyTable/SkyTable'
import SkyTableRow from '~/components/sky-ui/SkyTable/SkyTableRow'
import SkyTableTypography from '~/components/sky-ui/SkyTable/SkyTableTypography'
import { Category } from '~/typing'
import { textValidatorChange, textValidatorDisplay, textValidatorInit } from '~/utils/helpers'
import useCategory from '../../hooks/useCategory'
import { CategoryTableDataType } from '../../type'
import ModalAddNewCategory from './ModalAddNewCategory'

const CategoryTable: React.FC = () => {
  const table = useTable<CategoryTableDataType>([])
  const {
    newRecord,
    setNewRecord,
    openModal,
    setOpenModal,
    handleSaveClick,
    handleAddNewItem,
    handleConfirmDelete,
    handlePageChange,
    categoryService
  } = useCategory(table)

  const columns = {
    id: (record: CategoryTableDataType) => {
      return <SkyTableTypography strong>{textValidatorDisplay(String(record.id))}</SkyTableTypography>
    },
    imageUrl: (record: CategoryTableDataType) => {
      return (
        <EditableStateCell
          isEditing={table.isEditing(record.key)}
          dataIndex='imageUrl'
          title='Image'
          inputType='text'
          initialValue={textValidatorInit(record.imageUrl)}
          value={newRecord.imageUrl}
          onValueChange={(val: string) => {
            setNewRecord({ ...newRecord, imageUrl: textValidatorChange(val) })
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
    title: (record: CategoryTableDataType) => {
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
          <SkyTableTypography placeholder='Input your title..' status={'active'}>
            {textValidatorDisplay(record.title)}
          </SkyTableTypography>
        </EditableStateCell>
      )
    },
    desc: (record: CategoryTableDataType) => {
      return (
        <EditableStateCell
          isEditing={table.isEditing(record.key!)}
          dataIndex='desc'
          title='Description'
          inputType='text'
          required={true}
          initialValue={textValidatorInit(record.desc)}
          value={newRecord.desc}
          onValueChange={(val: string) => setNewRecord({ ...newRecord, desc: textValidatorChange(val) })}
        >
          <SkyTableTypography placeholder='Input your description..' status={'active'}>
            {textValidatorDisplay(record.desc)}
          </SkyTableTypography>
        </EditableStateCell>
      )
    }
  }

  const tableColumns: ColumnsType<CategoryTableDataType> = [
    {
      key: 'sort',
      width: '2%'
    },
    {
      title: 'ID',
      dataIndex: 'id',
      width: '5%',
      render: (_value: any, record: CategoryTableDataType) => {
        return columns.id(record)
      }
    },
    {
      title: 'Image',
      dataIndex: 'imageUrl',
      width: '10%',
      responsive: ['sm'],
      render: (_value: any, record: CategoryTableDataType) => {
        return columns.imageUrl(record)
      }
    },
    {
      title: 'Title',
      dataIndex: 'title',
      width: '20%',
      responsive: ['sm'],
      render: (_value: any, record: CategoryTableDataType) => {
        return columns.title(record)
      }
    },
    {
      title: 'Description',
      dataIndex: 'desc',
      width: '20%',
      responsive: ['sm'],
      render: (_value: any, record: CategoryTableDataType) => {
        return columns.desc(record)
      }
    }
  ]

  return (
    <>
      <BaseLayout
        title='Categories'
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
          metaData={categoryService.metaData}
          onPageChange={handlePageChange}
          isShowDeleted={table.showDeleted}
          components={{
            body: {
              row: SkyTableRow
            }
          }}
          onDraggableChange={(_, newData) => {
            if (newData) {
              CategoryAPI.updateList(
                newData.map((item, index) => {
                  return { ...item, orderNumber: index } as Category
                }) as Category[]
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
        <ModalAddNewCategory openModal={openModal} setOpenModal={setOpenModal} onAddNew={handleAddNewItem} />
      )}
    </>
  )
}

export default CategoryTable
