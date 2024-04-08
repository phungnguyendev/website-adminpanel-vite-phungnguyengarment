import { Image, Skeleton, type ImageProps } from 'antd'
import React from 'react'
import { cn } from '~/utils/helpers'

export interface LazyImageProps extends ImageProps {}

const LazyImage: React.FC<LazyImageProps> = ({ ...props }) => {
  return (
    <>
      <Image
        {...props}
        alt='banner-img'
        height={120}
        width={120}
        className={cn('object-cover', props.className)}
        placeholder={<Skeleton.Avatar active={true} size={120} shape='square' />}
      />
    </>
  )
}

export default LazyImage
