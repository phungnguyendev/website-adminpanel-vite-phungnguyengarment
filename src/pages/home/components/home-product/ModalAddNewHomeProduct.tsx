import { UploadFile } from 'antd'
import React, { memo, useState } from 'react'
import SkyModal, { SkyModalProps } from '~/components/sky-ui/SkyModal'
import EditableStateCell from '~/components/sky-ui/SkyTable/EditableStateCell'
import { HomeProduct } from '~/typing'
import { textValidatorChange } from '~/utils/helpers'

export interface HomeProductAddNewProps {
  title?: string | null
  imageUrl?: string | null
}

interface Props extends SkyModalProps {
  onCreate: (newItem: HomeProduct, setLoading?: (enable: boolean) => void) => void
}

const ModalAddNewHomeProduct: React.FC<Props> = ({ onCreate, ...props }) => {
  const [, setLoading] = useState<boolean>(false)
  const [newRecord, setNewRecord] = useState<HomeProduct>({})

  return (
    <>
      <SkyModal {...props} title='Create new' okText='Create' onOk={() => onCreate(newRecord, setLoading)}>
        <EditableStateCell
          isEditing
          label='Title'
          inputType='text'
          value={newRecord.title}
          onValueChange={(val: string) => setNewRecord({ ...newRecord, title: textValidatorChange(val) })}
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
          value={newRecord.imageName}
          onValueChange={(fileList: UploadFile[]) => {
            console.log(fileList)
            setNewRecord({
              ...newRecord,
              imageName: fileList[0].name
            })
          }}
        />
      </SkyModal>
    </>
  )
}

export default memo(ModalAddNewHomeProduct)
