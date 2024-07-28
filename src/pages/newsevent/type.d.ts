import { Attachment, Post } from '~/typing'

export interface PostTableDataType extends Post {
  key: string
}

export interface NewRecordPost {
  title?: string
  content?: string
  imageUrl?: string
  publishedAt?: string
}

export interface AttachmentTableDataType extends Attachment {
  key: string
}

export interface NewRecordAttachment {
  url?: string
  type?: string
  caption?: string
}
