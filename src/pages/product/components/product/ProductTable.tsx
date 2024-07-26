import { Flex, Typography } from 'antd'
import { ColumnsType, ColumnType } from 'antd/es/table'
import BaseLayout from '~/components/layout/BaseLayout'
import LazyImage from '~/components/sky-ui/LazyImage'
import EditableStateCell from '~/components/sky-ui/SkyTable/EditableStateCell'
import SkyTable from '~/components/sky-ui/SkyTable/SkyTable'
import SkyTableActionRow from '~/components/sky-ui/SkyTable/SkyTableActionRow'
import SkyTableTypography from '~/components/sky-ui/SkyTable/SkyTableTypography'
import SkyTableWrapperLayout from '~/components/sky-ui/SkyTable/SkyTableWrapperLayout'
import {
  imageValidatorDisplay,
  numberValidatorChange,
  textValidatorChange,
  textValidatorDisplay,
  textValidatorInit
} from '~/utils/helpers'
import useProductViewModel from '../../hooks/useProductViewModel'
import { ProductTableDataType } from '../../type'
import ModalAddNewProduct from './ModalAddNewProduct'

const ProductTable: React.FC = () => {
  const viewModel = useProductViewModel()

  const columns = {
    id: (record: ProductTableDataType) => {
      return <SkyTableTypography strong>{textValidatorDisplay(`#${record.id}`)}</SkyTableTypography>
    },
    category: (record: ProductTableDataType) => {
      return (
        <EditableStateCell
          isEditing={viewModel.table.isEditing(record.key)}
          inputType='select'
          selectProps={{
            options: viewModel.state.categories.map((item) => {
              return {
                key: `${item.id}`,
                label: item.title,
                value: item.id
              }
            })
          }}
          defaultValue={record.categoryID}
          value={viewModel.state.newRecord?.categoryID}
          onValueChange={(value: number) => {
            viewModel.state.setNewRecord((prev) => {
              return { ...prev, categoryID: numberValidatorChange(value) }
            })
          }}
        >
          <SkyTableTypography>{record.category?.title}</SkyTableTypography>
        </EditableStateCell>
      )
    },
    image: (record: ProductTableDataType) => {
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
          <LazyImage src={imageValidatorDisplay(record.imageUrl)} height={120} width={120} />
        </EditableStateCell>
      )
    },
    title: (record: ProductTableDataType) => {
      return (
        <EditableStateCell
          isEditing={viewModel.table.isEditing(record.key)}
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
    actionCol: (record: ProductTableDataType) => {
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

  const tableColumns: ColumnsType<ProductTableDataType> = [
    {
      key: 'sort',
      width: '2%'
    },
    {
      title: 'ID',
      dataIndex: 'id',
      width: '5%',
      render: (_value: any, record: ProductTableDataType) => {
        return columns.id(record)
      }
    },
    {
      title: 'Image',
      dataIndex: 'imageUrl',
      width: '10%',
      responsive: ['sm'],
      render: (_value: any, record: ProductTableDataType) => {
        return columns.image(record)
      }
    },
    {
      title: 'Category',
      dataIndex: 'categoryID',
      width: '10%',
      responsive: ['sm'],
      render: (_value: any, record: ProductTableDataType) => {
        return columns.category(record)
      }
    },
    {
      title: 'Title',
      dataIndex: 'title',
      width: '20%',
      responsive: ['sm'],
      render: (_value: any, record: ProductTableDataType) => {
        return columns.title(record)
      }
    }
  ]

  const actionCol: ColumnType<ProductTableDataType> = {
    title: 'Operation',
    width: '0.001%',
    render: (_value: any, record: ProductTableDataType) => {
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
                  Products ({viewModel.table.dataSource.length})
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
        <ModalAddNewProduct
          open={viewModel.state.openModalCreate}
          setOpenModal={viewModel.state.setOpenModalCreate}
          onCreate={viewModel.action.handleCreate}
        />
      )}
    </>
  )
}

export default ProductTable
