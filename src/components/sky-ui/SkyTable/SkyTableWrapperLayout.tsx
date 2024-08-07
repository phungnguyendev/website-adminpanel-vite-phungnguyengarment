import { Button, ButtonProps, Flex, Spin } from 'antd'
import { Plus } from 'lucide-react'
import React from 'react'
import { cn } from '~/utils/helpers'

export interface SkyTableWrapperLayoutProps extends React.HTMLAttributes<HTMLElement> {
  loading?: boolean
  onLoading?: (enable: boolean) => void
  addNewProps?: ButtonProps
  before?: React.ReactNode
  after?: React.ReactNode
}

const SkyTableWrapperLayout: React.FC<SkyTableWrapperLayoutProps> = ({ addNewProps, children, loading, ...props }) => {
  return (
    <>
      <Flex {...props} vertical gap={20} className={cn('w-full rounded-md', props.className)}>
        <Flex gap={20} align='center' className='w-full flex-col md:flex-row'>
          <Flex gap={20} justify='space-between' align='center' className='w-full'>
            {props.before}
            {addNewProps && (
              <Flex gap={20} justify='end' align='center' className='w-fuller'>
                {props.after}
                <Button {...addNewProps} className='flex items-center' type='primary' icon={<Plus size={20} />}>
                  Add
                </Button>
              </Flex>
            )}
          </Flex>
        </Flex>
        {loading ? <Spin /> : children}
      </Flex>
    </>
  )
}

export default SkyTableWrapperLayout
