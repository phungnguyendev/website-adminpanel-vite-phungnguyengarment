import { InboxOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import type { UploadFile } from 'antd'
import { Trash2 } from 'lucide-react'
import React, { FC, HTMLAttributes, useRef, useState } from 'react'
import { cn } from '~/utils/helpers'

export interface DragDropFileProps extends HTMLAttributes<HTMLElement> {
  onChange?: () => void
}

const DragDropFile: FC<DragDropFileProps> = ({ ...props }) => {
  // drag state
  const [dragActive, setDragActive] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const [fileList, setFileList] = useState<UploadFile[]>([])

  function handleFile(files: FileList) {
    console.log('Number of files: ' + files.item(0)?.name)
  }

  // handle drag events
  const handleDrag = function (e: React.DragEvent<HTMLDivElement> | React.DragEvent<HTMLFormElement>) {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  // triggers when file is dropped
  const handleDrop = function (e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files)
    }
  }

  // triggers when file is selected with click
  const handleChange = function (e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault()
    console.log(e)
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files)
    }
  }

  return (
    <div {...props} className='w-full'>
      {/* <Dragger /> */}
      {/* <form id='form-file-upload' onDragEnter={handleDrag} onSubmit={(e) => e.preventDefault()}> */}
      <span className='m-0 box-border list-none p-0 text-sm text-foreground text-opacity-[0.88]'>
        <div
          className={cn(
            'relative h-full w-full cursor-pointer rounded-lg border border-dashed border-[#d9d9d9] bg-[rgb(0,0,0,0.02)] text-center transition-colors duration-300 hover:border-primary'
            // {
            //   'border-primary': dragActive
            // }
          )}
        >
          <span
            tabIndex={0}
            role='button'
            className='box-border table h-full w-full cursor-pointer rounded-lg p-4 text-center outline-none'
          >
            <input
              id='input-file-upload'
              type='file'
              ref={inputRef}
              accept=''
              style={{
                display: 'none',
                cursor: 'pointer',
                alignItems: 'baseline',
                color: 'inherit',
                textAlign: 'start'
              }}
              onChange={handleChange}
              multiple
            />
            <label htmlFor='input-file-upload'>
              <span className='box-border table-cell align-middle'>
                <p className='ant-upload-drag-icon'>
                  <InboxOutlined />
                </p>
                <p className='ant-upload-text'>Click or drag file to this area to upload</p>
                <p className='ant-upload-hint'>
                  Support for a single or bulk upload. Strictly prohibited from uploading company data or other banned
                  files.
                </p>
              </span>
            </label>
          </span>
          {dragActive && (
            <div
              id='drag-file-element'
              className='absolute bottom-0 left-0 right-0 top-0'
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            />
          )}
        </div>
        <div className='box-border before:table before:content-[""] after:clear-both after:box-border after:table after:content-[""]'>
          <div className='box-border transition-all duration-300 before:table before:h-0 before:w-0 before:content-[""]'>
            <div className='relative mt-2 flex h-[22px] items-center text-sm text-primary transition-colors duration-300'>
              <div className='box-border block'>
                <span className='inline-flex items-center align-[-0.125rem] text-sm font-normal normal-case leading-none text-primary antialiased'>
                  <svg
                    viewBox='64 64 896 896'
                    focusable='false'
                    data-icon='paper-clip'
                    width='1em'
                    height='1em'
                    fill='currentColor'
                    aria-hidden='true'
                  >
                    <path d='M779.3 196.6c-94.2-94.2-247.6-94.2-341.7 0l-261 260.8c-1.7 1.7-2.6 4-2.6 6.4s.9 4.7 2.6 6.4l36.9 36.9a9 9 0 0012.7 0l261-260.8c32.4-32.4 75.5-50.2 121.3-50.2s88.9 17.8 121.2 50.2c32.4 32.4 50.2 75.5 50.2 121.2 0 45.8-17.8 88.8-50.2 121.2l-266 265.9-43.1 43.1c-40.3 40.3-105.8 40.3-146.1 0-19.5-19.5-30.2-45.4-30.2-73s10.7-53.5 30.2-73l263.9-263.8c6.7-6.6 15.5-10.3 24.9-10.3h.1c9.4 0 18.1 3.7 24.7 10.3 6.7 6.7 10.3 15.5 10.3 24.9 0 9.3-3.7 18.1-10.3 24.7L372.4 653c-1.7 1.7-2.6 4-2.6 6.4s.9 4.7 2.6 6.4l36.9 36.9a9 9 0 0012.7 0l215.6-215.6c19.9-19.9 30.8-46.3 30.8-74.4s-11-54.6-30.8-74.4c-41.1-41.1-107.9-41-149 0L463 364 224.8 602.1A172.22 172.22 0 00174 724.8c0 46.3 18.1 89.8 50.8 122.5 33.9 33.8 78.3 50.7 122.7 50.7 44.4 0 88.8-16.9 122.6-50.7l309.2-309C824.8 492.7 850 432 850 367.5c.1-64.6-25.1-125.3-70.7-170.9z'></path>
                  </svg>
                </span>
                <span className='w-full flex-auto overflow-hidden text-ellipsis whitespace-nowrap px-2 text-primary transition-all duration-300'>
                  Name file
                </span>
                <span className='box-border whitespace-nowrap'>
                  <Button className='h-[20px] border-none leading-none'>
                    <span className='box-border inline-block leading-[0]'>
                      <span className='inline-flex cursor-pointer items-center align-[-0.125rem] font-normal normal-case text-primary transition-all duration-300'>
                        <Trash2 size={16} className='inline-block leading-none' />
                      </span>
                    </span>
                  </Button>
                </span>
              </div>
            </div>
          </div>
        </div>
      </span>
      {/* </form> */}
    </div>
  )
}

export default DragDropFile

{
  /* <form
        id='form-file-upload'
        className='flex h-[16rem] min-h-[32px] min-w-[26rem] flex-col items-center justify-center'
        onDragEnter={handleDrag}
        onSubmit={(e) => e.preventDefault()}
      >
        <input
          ref={inputRef}
          id='input-file-upload'
          type='file'
          style={{
            display: 'none'
          }}
          multiple={true}
          onChange={handleChange}
        />
        <label
          id='label-file-upload'
          htmlFor='input-file-upload'
          className={cn(
            'm-auto flex h-full w-full flex-col items-center justify-center rounded-lg border border-dashed border-[#cbd5e1] bg-[#f8fafc]',
            {
              'bg-white': dragActive
            }
          )}
        >
          <p className='h-fit w-fit'>
            <span className='text-primary'>
              <Inbox size={48} />
            </span>
          </p>
          <p className='text-[rgb(0,0,0,0.88)]'>Click or drag file to this area to upload</p>
          <p className='text-center text-sm text-[rgb(0,0,0,0.45)]'>
            Support for a single or bulk upload. Strictly prohibited from uploading company data or other banned files.
          </p>
        </label>
        {dragActive && (
          <div
            id='drag-file-element'
            className='absolute bottom-0 left-0 right-0 top-0 h-full w-full rounded-2xl'
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          ></div>
        )}
      </form> */
}
