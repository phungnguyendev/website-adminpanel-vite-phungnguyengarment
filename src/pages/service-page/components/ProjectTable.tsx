import { UploadFile } from 'antd'
import { ColumnsType } from 'antd/es/table'
import ProjectAPI from '~/api/services/ProjectAPI'
import useTable from '~/components/hooks/useTable'
import BaseLayout from '~/components/layout/BaseLayout'
import LazyImage from '~/components/sky-ui/LazyImage'
import EditableStateCell from '~/components/sky-ui/SkyTable/EditableStateCell'
import SkyTable2 from '~/components/sky-ui/SkyTable/SkyTable'
import SkyTableRow from '~/components/sky-ui/SkyTable/SkyTableRow'
import SkyTableTypography from '~/components/sky-ui/SkyTable/SkyTableTypography'
import { Project } from '~/typing'
import { getPublicUrlGoogleDrive, textValidatorChange, textValidatorDisplay, textValidatorInit } from '~/utils/helpers'
import useProject from '../hooks/useProject'
import { ProjectTableDataType } from '../type'
import ModalAddNewProject from './ModalAddNewProject'

const ProjectTable: React.FC = () => {
  const table = useTable<ProjectTableDataType>([])
  const {
    newRecord,
    setNewRecord,
    openModal,
    setOpenModal,
    handleSaveClick,
    handleAddNewItem,
    handleConfirmDelete,
    handlePageChange,
    projectService
  } = useProject(table)

  const columns = {
    id: (record: ProjectTableDataType) => {
      return <SkyTableTypography strong>{textValidatorDisplay(String(record.id))}</SkyTableTypography>
    },
    image: (record: ProjectTableDataType) => {
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
          <LazyImage alt='banner-img' src={getPublicUrlGoogleDrive(record.imageId ?? '')} height={120} width={120} />
        </EditableStateCell>
      )
    },
    title: (record: ProjectTableDataType) => {
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
    desc: (record: ProjectTableDataType) => {
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

  const tableColumns: ColumnsType<ProjectTableDataType> = [
    {
      key: 'sort',
      width: '2%'
    },
    {
      title: 'ID',
      dataIndex: 'id',
      width: '5%',
      render: (_value: any, record: ProjectTableDataType) => {
        return columns.id(record)
      }
    },
    {
      title: 'Image',
      dataIndex: 'imageId',
      width: '10%',
      responsive: ['sm'],
      render: (_value: any, record: ProjectTableDataType) => {
        return columns.image(record)
      }
    },
    {
      title: 'Title',
      dataIndex: 'title',
      width: '20%',
      responsive: ['sm'],
      render: (_value: any, record: ProjectTableDataType) => {
        return columns.title(record)
      }
    },
    {
      title: 'Description',
      dataIndex: 'desc',
      width: '20%',
      responsive: ['sm'],
      render: (_value: any, record: ProjectTableDataType) => {
        return columns.desc(record)
      }
    }
  ]

  return (
    <>
      <BaseLayout
        title='Projects'
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
          pageSize={10}
          editingKey={table.editingKey}
          deletingKey={table.deletingKey}
          metaData={projectService.metaData}
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
              ProjectAPI.updateList(
                newData.map((item, index) => {
                  return { ...item, orderNumber: index } as Project
                }) as Project[]
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
        <ModalAddNewProject
          loading={table.loading}
          openModal={openModal}
          setOpenModal={setOpenModal}
          onAddNew={handleAddNewItem}
        />
      )}
    </>
  )
}

export default ProjectTable
