import { UploadOutlined } from '@ant-design/icons'
import type { UploadFile, UploadProps } from 'antd'
import { App as AntApp, Button, Flex, Upload } from 'antd'
import { ImageUp } from 'lucide-react'
import React, { useState } from 'react'
import PublicAPI from '~/api/services/PublicAPI'
import appConfig from '~/config/app.config'
import useLocalStorage from '~/hooks/useLocalStorage'

type UploadType = 'images' | 'videos' | 'icons' | 'files'

export interface Uploader2Props extends UploadProps {
  onValueChange?: (fileList: UploadFile[]) => void
  uploadType?: UploadType
}

const Uploader2: React.FC<Uploader2Props> = ({ uploadType, onValueChange, ...props }) => {
  const { message } = AntApp.useApp()
  const [accessTokenStored] = useLocalStorage<string>('accessToken', '')
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const type = props.type ?? 'drag'

  const uploadProps: UploadProps = {
    ...props,
    action: appConfig.baseURL + `/public/upload/${[uploadType]}`,
    headers: {
      authorization: `${accessTokenStored}`
    },
    onChange(info) {
      setFileList(info.fileList)
      const { status } = info.file
      // if (status !== 'uploading') {
      //   console.log(info.file, info.fileList)
      // }
      if (status === 'done') {
        onValueChange?.(info.fileList)
        message.success(`${info.file.name} file uploaded successfully.`)
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`)
      }
    },
    onRemove: (file) => {
      PublicAPI.deleteItemByFileName(file.name ?? '', 'images', '').then((res) => {
        if (!res?.success) throw new Error(`${res?.message}`)
        message.success(`${res.message}`)
      })
      const index = fileList.indexOf(file)
      const newFileList = fileList.slice()
      newFileList.splice(index, 1)
      setFileList(newFileList)
    },
    fileList
  }

  return (
    <Flex vertical>
      <Upload
        {...uploadProps}
        type={type}
        style={{
          height: '350px'
        }}
        accept='image/png, image/gif, image/jpeg'
        className='group'
      >
        {type === 'select' ? (
          <Button icon={<UploadOutlined />}>Select File</Button>
        ) : (
          <Flex vertical className='text-muted group-open:text-primary group-hover:text-primary'>
            <p className='transition-colors duration-300'>
              <ImageUp size={46} />
            </p>
            <p className='ant-upload-text'>Click or drag file to this area to upload</p>
            <p className='ant-upload-hint'>
              Support for a single or bulk upload. Strictly prohibited from uploading company data or other banned
              files.
            </p>
          </Flex>
        )}
      </Upload>
    </Flex>
  )
}

export default Uploader2
