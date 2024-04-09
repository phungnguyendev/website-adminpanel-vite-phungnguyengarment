import { Attachment, Post } from '~/typing'

export interface PostTableDataType extends Post {
  key: string
}

export interface AttachmentTableDataType extends Attachment {
  key: string
}
