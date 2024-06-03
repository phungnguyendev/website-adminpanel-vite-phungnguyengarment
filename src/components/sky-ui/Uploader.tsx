import { App as AntApp, Flex, Image, List, Typography } from 'antd'
import React, { useState } from 'react'
import { FaCloudUploadAlt } from 'react-icons/fa'
import { cn } from '~/utils/helpers'

type InputSize = 'small' | 'default' | 'large'

export interface UploaderProps {
  inputSize?: InputSize
  multiple?: boolean
  name?: string
}

const Uploader: React.FC<UploaderProps> = ({ multiple = false, name, inputSize = 'small', ...props }) => {
  const { message } = AntApp.useApp()
  const [fileList, setFileList] = useState<FileList | null>(null)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  const handleChangeInputFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      setFileList(files)
      setPreviewImage(URL.createObjectURL(files[0]))
      setPreviewOpen(true)
    }
  }

  return (
    <>
      <input
        {...props}
        type='file'
        id='upload-file'
        name={name ?? 'file'}
        multiple={multiple}
        onChange={handleChangeInputFile}
        className='absolute -z-[1] h-0 w-0 overflow-hidden opacity-0'
      />
      <Flex
        vertical
        gap={10}
        className={cn({
          'w-[350px]': inputSize === 'small',
          'w-[440px]': inputSize === 'default',
          'w-[530px]': inputSize === 'large'
        })}
      >
        <label
          htmlFor='upload-file'
          className={cn(
            'group relative w-full cursor-pointer rounded-lg border-dashed bg-white transition-colors duration-300 hover:border-primary hover:text-primary',
            {
              'h-[140px]': inputSize === 'small',
              'h-[180px]': inputSize === 'default',
              'h-[220px]': inputSize === 'large'
            }
          )}
        >
          <Flex
            vertical
            gap={4}
            justify='center'
            align='center'
            className={cn('absolute bottom-0 left-0 right-0 top-0 z-10 h-full w-full rounded-lg bg-accent p-5', {
              'p-2': inputSize === 'small',
              'p-5': inputSize === 'default',
              'p-7': inputSize === 'large'
            })}
          >
            <FaCloudUploadAlt size={inputSize === 'small' ? 32 : inputSize === 'default' ? 64 : 84} />
            <Typography.Text
              className={cn('font-semibold duration-500 group-hover:text-primary', {
                'text-sm': inputSize === 'small',
                'text-base': inputSize === 'default',
                'text-lg': inputSize === 'large'
              })}
            >
              Upload Files
            </Typography.Text>
            <Typography.Text
              className={cn('text-center text-xs duration-500 group-hover:text-primary')}
              type='secondary'
            >
              Image size must be less than <strong>2MB</strong>
            </Typography.Text>
          </Flex>
        </label>
        {fileList && (
          <List
            grid={{
              gutter: 10,
              column: 4
            }}
            dataSource={Array.from({ length: fileList.length }, (_, index) => {
              return {
                file: fileList[index]
              }
            })}
            renderItem={(item, index) => {
              return (
                <List.Item key={index} className='h-[80px]'>
                  <Image
                    src={URL.createObjectURL(item.file)}
                    width={80}
                    height={80}
                    style={{
                      objectFit: 'cover'
                    }}
                  />
                </List.Item>
              )
            }}
          />
        )}
      </Flex>
    </>
  )
}

export default Uploader
