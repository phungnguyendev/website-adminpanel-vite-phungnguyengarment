import { ColumnsType } from 'antd/es/table'
import ProductAPI from '~/api/services/ProductAPI'
import useTable from '~/components/hooks/useTable'
import BaseLayout from '~/components/layout/BaseLayout'
import LazyImage from '~/components/sky-ui/LazyImage'
import EditableStateCell from '~/components/sky-ui/SkyTable/EditableStateCell'
import SkyTable2 from '~/components/sky-ui/SkyTable/SkyTable'
import SkyTableRow from '~/components/sky-ui/SkyTable/SkyTableRow'
import SkyTableTypography from '~/components/sky-ui/SkyTable/SkyTableTypography'
import { Category, Product } from '~/typing'
import { numberValidatorChange, textValidatorChange, textValidatorDisplay, textValidatorInit } from '~/utils/helpers'
import useProduct from '../../hooks/useProduct'
import { ProductTableDataType } from '../../type'
import ModalAddNewProduct from './ModalAddNewProduct'

const ProductTable: React.FC = () => {
  const table = useTable<ProductTableDataType>([])
  const {
    newRecord,
    setNewRecord,
    openModal,
    setOpenModal,
    handleSaveClick,
    handleAddNewItem,
    handleConfirmDelete,
    handlePageChange,
    productService,
    categories,
    productCategories
  } = useProduct(table)

  const getCategoryFromRecord = (record: ProductTableDataType): Category | undefined => {
    const productCategoryFound = productCategories.find((productCategory) => productCategory.productID === record.id)
    const categoryFound = categories.find((category) => category.id === productCategoryFound?.categoryID)
    return productCategoryFound ? categoryFound : undefined
  }

  const getCategoryFromCategoryID = (categoryID?: number | null): Category | undefined => {
    const categoryFound = categories.find((category) => category.id === categoryID)
    return categoryFound
  }

  const columns = {
    id: (record: ProductTableDataType) => {
      return <SkyTableTypography strong>{textValidatorDisplay(String(record.id))}</SkyTableTypography>
    },
    image: (record: ProductTableDataType) => {
      return (
        <EditableStateCell
          isEditing={table.isEditing(record.key)}
          dataIndex='imageUrl'
          title='Image'
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
    category: (record: ProductTableDataType) => {
      return (
        <EditableStateCell
          isEditing={table.isEditing(record.key!)}
          dataIndex='categoryID'
          title='Category'
          inputType='select'
          placeholder='Select category'
          selectProps={{
            options: categories.map((item) => {
              return {
                label: item.title,
                value: item.id,
                key: item.id
              }
            })
          }}
          initialValue={textValidatorInit(record.category?.title)}
          value={getCategoryFromCategoryID(newRecord.categoryID)}
          onValueChange={(val: number) => setNewRecord({ ...newRecord, categoryID: numberValidatorChange(val) })}
        >
          <SkyTableTypography code placeholder='asd' status={'active'}>
            {textValidatorDisplay(getCategoryFromRecord(record)?.title)}
          </SkyTableTypography>
        </EditableStateCell>
      )
    },
    title: (record: ProductTableDataType) => {
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
    },
    desc: (record: ProductTableDataType) => {
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
          <SkyTableTypography placeholder='asd' status={'active'}>
            {textValidatorDisplay(record.desc)}
          </SkyTableTypography>
        </EditableStateCell>
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
      dataIndex: 'category',
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
    },
    {
      title: 'Description',
      dataIndex: 'desc',
      width: '20%',
      responsive: ['sm'],
      render: (_value: any, record: ProductTableDataType) => {
        return columns.desc(record)
      }
    }
  ]

  return (
    <>
      <BaseLayout
        title='Products'
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
          metaData={productService.metaData}
          onPageChange={handlePageChange}
          isShowDeleted={table.showDeleted}
          components={{
            body: {
              row: SkyTableRow
            }
          }}
          onDraggableChange={(_, newData) => {
            if (newData) {
              ProductAPI.updateList(
                newData.map((item, index) => {
                  return { ...item, orderNumber: index } as Product
                }) as Product[]
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
        <ModalAddNewProduct openModal={openModal} setOpenModal={setOpenModal} onAddNew={handleAddNewItem} />
      )}
    </>
  )
}

export default ProductTable
