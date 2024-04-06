import type { ModalProps } from 'antd'
import { Modal, Spin, Typography } from 'antd'
import React from 'react'

export interface SkyModalWrapperProps extends ModalProps {
  loading?: boolean
}

const SkyModalWrapper: React.FC<SkyModalWrapperProps> = ({ loading, ...props }) => {
  return (
    <Modal
      {...props}
      title={<Typography.Title level={2}>{props.title}</Typography.Title>}
      centered
      width={900}
      className='w-full'
    >
      <Spin spinning={loading} tip='loading'>
        {props.children}
      </Spin>
    </Modal>
  )
}

export default SkyModalWrapper
