import { Image, ImageProps } from 'antd'
import React from 'react'
import { getPublicUrlGoogleDrive } from '~/utils/helpers'

interface Props extends ImageProps {
  fileId: string
}

const GoogleDriveImage: React.FC<Props> = ({ fileId, ...props }) => {
  return <Image {...props} src={getPublicUrlGoogleDrive(fileId)} alt='Google Drive Image' />
}

export default GoogleDriveImage
