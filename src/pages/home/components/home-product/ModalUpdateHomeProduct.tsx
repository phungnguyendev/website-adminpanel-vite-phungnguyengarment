import { UploadFile } from 'antd'
import { memo, useEffect, useState } from 'react'
import SkyModal, { SkyModalProps } from '~/components/sky-ui/SkyModal'
import EditableStateCell from '~/components/sky-ui/SkyTable/EditableStateCell'
import { File, HeroBanner } from '~/typing'
import { textValidatorChange, textValidatorInit } from '~/utils/helpers'

interface NewModel {
  title?: string | null
  imageFile?: File | null
}

interface SkyModalUpdateProps extends SkyModalProps {
  record: HeroBanner
  onUpdate: (id: number, itemUpdate: HeroBanner, setLoading?: (enable: boolean) => void) => void
}

const ModalUpdateHeroBanner: React.FC<SkyModalUpdateProps> = ({ record, onUpdate, ...props }) => {
  const [, setLoading] = useState<boolean>(false)
  const [recordUpdate, setRecordUpdate] = useState<NewModel>({})

  console.log('Modal update..')

  useEffect(() => {
    if (record) loadData()
  }, [record])

  const loadData = () => {
    setRecordUpdate({ title: record.title })
  }

  return (
    <>
      <SkyModal
        {...props}
        okText='Save'
        title={`Update #${record.id}`}
        onOk={() =>
          onUpdate(
            record.id ?? -1,
            recordUpdate.imageFile
              ? { ...recordUpdate, imageName: recordUpdate.imageFile?.filename }
              : { ...recordUpdate },
            setLoading
          )
        }
      >
        <EditableStateCell
          isEditing
          label='Title'
          inputType='text'
          defaultValue={textValidatorInit(record.title)}
          value={recordUpdate.title}
          onValueChange={(val: string) => setRecordUpdate({ ...recordUpdate, title: textValidatorChange(val) })}
        />
        <EditableStateCell
          isEditing
          label='Images'
          inputType='upload'
          uploadProps={{
            name: 'images',
            uploadType: 'images',
            maxCount: 1
          }}
          value={recordUpdate.imageFile}
          onValueChange={(fileList: UploadFile[]) => {
            setRecordUpdate({
              ...recordUpdate,
              imageFile: (fileList[0].response.data as File[])[0]
            })
          }}
        />
      </SkyModal>
    </>
  )
}

export default memo(ModalUpdateHeroBanner)
