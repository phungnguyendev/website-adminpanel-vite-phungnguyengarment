import type { ModalProps } from 'antd'
import { Modal, Typography } from 'antd'
import { memo } from 'react'
import { cn } from '~/utils/helpers'

interface SkyModalUpdateProps<T extends any> extends ModalProps {
  onSave?: (recordUpdate: T) => void
}

const SkyModalUpdate = <T extends any>({ onSave, ...props }: SkyModalUpdateProps<T>) => {
  return (
    <>
      <Modal
        {...props}
        title={
          <Typography.Title className='pb-5' level={2}>
            {props.title}
          </Typography.Title>
        }
        centered
        okText='Save'
        width={props.width ?? 1200}
        className={cn('z-10 w-full', props.className)}
      >
        {props.children}
      </Modal>
    </>
  )
}

export default memo(SkyModalUpdate)
