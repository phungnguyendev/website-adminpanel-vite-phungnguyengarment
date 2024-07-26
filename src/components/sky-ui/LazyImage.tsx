import { Image, Skeleton, type ImageProps } from 'antd'
import React from 'react'
import { cn } from '~/utils/helpers'

export interface LazyImageProps extends ImageProps {}

const LazyImage: React.FC<LazyImageProps> = ({ ...props }) => {
  return (
    <>
      <Image
        {...props}
        alt='img'
        className={cn('object-contain', props.className)}
        placeholder={<Skeleton.Avatar size={120} shape='square' />}
      />
    </>
  )
}

export default LazyImage
