import { InboxOutlined } from '@ant-design/icons'
import type { GetProp, UploadFile, UploadProps } from 'antd'
import { App as AntApp, Image, Upload } from 'antd'
import React, { useEffect, useState } from 'react'
import { getBase64 } from '~/utils/helpers'

type ComponentType = 'dragger' | 'clicker'

export interface ImageUploaderProps extends UploadProps {
  onFinish?: (files: UploadFile[]) => void
  componentType?: ComponentType
}

const { Dragger } = Upload

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0]

const ImageUploader: React.FC<ImageUploaderProps> = ({ ...props }) => {
  const { message } = AntApp.useApp()
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState('')

  useEffect(() => {
    props.onFinish?.(fileList)
  }, [fileList])

  const uploadProps: UploadProps = {
    ...props,
    listType: 'picture-card',
    beforeUpload: (file) => {
      setFileList([...fileList, file])
      return false
    },
    onChange: (info) => {
      setFileList(info.fileList)
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`)
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`)
      }
    },
    onRemove: (file) => {
      const index = fileList.indexOf(file)
      const newFileList = fileList.slice()
      newFileList.splice(index, 1)
      setFileList(newFileList)
    },
    fileList,
    onPreview: async (file) => {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj as FileType)
      }
      setPreviewImage(file.url || (file.preview as string))
      setPreviewOpen(true)
    }
  }

  return (
    <>
      <Dragger {...uploadProps} className={props.className}>
        <p className='ant-upload-drag-icon'>
          <InboxOutlined />
        </p>
        <p className='ant-upload-text'>Click or drag image file to this area to upload</p>
        <p className='ant-upload-hint'>
          Support for a single or bulk upload. Strictly prohibited from uploading company data or other banned files.
        </p>
      </Dragger>
      {previewImage && (
        <Image
          wrapperStyle={{ display: 'none' }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage('')
          }}
          src={previewImage}
        />
      )}
    </>
  )
}

export default ImageUploader
