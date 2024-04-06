import { InboxOutlined } from '@ant-design/icons'
import type { GetProp, UploadFile, UploadProps } from 'antd'
import { App as AntApp, Image, Upload } from 'antd'
import React, { useState } from 'react'
import { ResponseDataType } from '~/api/client'
import GoogleDriveAPI from '~/api/services/GoogleDriveAPI'
import appConfig from '~/config/app.config'
import { getBase64 } from '~/utils/helpers'

type ComponentType = 'dragger' | 'clicker'

export interface FileUploaderProps extends UploadProps {
  onFinish?: (file: UploadFile) => void
  componentType?: ComponentType
}

const { Dragger } = Upload

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0]

const FileUploader: React.FC<FileUploaderProps> = ({ onFinish, ...props }) => {
  const { message } = AntApp.useApp()
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState('')

  const uploadProps: UploadProps = {
    ...props,
    name: 'file',
    listType: 'picture-card',
    method: 'POST',
    fileList,
    action: appConfig.baseURL + '/google/drive/upload',
    onChange: (info) => {
      setFileList(info.fileList)
      if (info.file.status === 'done') {
        onFinish?.(info.file)
        message.success(`${info.file.name} file uploaded successfully`)
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`)
      }
    },
    onRemove: (info) => {
      const response = info.response as ResponseDataType
      GoogleDriveAPI.deleteFile(response.data.id)
    },
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
      <Dragger {...uploadProps}>
        <p className='ant-upload-drag-icon'>
          <InboxOutlined />
        </p>
        <p className='ant-upload-text'>Click or drag file to this area to upload</p>
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

export default FileUploader
