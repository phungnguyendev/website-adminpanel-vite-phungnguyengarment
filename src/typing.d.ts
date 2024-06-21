import { Readable } from 'stream'

export interface File {
  /** Name of the form field associated with this file. */
  fieldname: string
  /** Name of the file on the uploader's computer. */
  originalname: string
  /**
   * Value of the `Content-Transfer-Encoding` header for this file.
   * @deprecated since July 2015
   * @see RFC 7578, Section 4.7
   */
  encoding: string
  /** Value of the `Content-Type` header for this file. */
  mimetype: string
  /** Size of the file in bytes. */
  size: number
  /**
   * A readable stream of this file. Only available to the `_handleFile`
   * callback for custom `StorageEngine`s.
   */
  stream: Readable
  /** `DiskStorage` only: Directory to which this file has been uploaded. */
  destination: string
  preview: string
  /** `DiskStorage` only: Name of this file within `destination`. */
  filename: string
  /** `DiskStorage` only: Full path to the uploaded file. */
  path: string
  /** `MemoryStorage` only: A Buffer containing the entire file. */
  buffer: Buffer
}

export type StatusType = 'normal' | 'warn' | 'error' | 'success'

export type ItemStatusType = 'draft' | 'active' | 'closed' | 'archived' | 'deleted'

export type NoteItemStatusType = 'lake' | 'enough' | 'arrived' | 'not_arrived'

export type ItemWithKeyAndTitleType = {
  key?: React.Key
  title?: string | null | React.ReactNode
  desc?: string | null | React.ReactNode
  editable?: boolean
  dataIndex: string
  initialField?: {
    value: any
    data?: any[]
  }
  inputType?: InputType
  responsive?: Breakpoint[]
}

export type StepRound = {
  name: string
  type: StatusType
}

export type StepRound = {
  name: string
  type: StatusType
}

export type TableListDataType<T> = {
  key: React.Key
  data: T
}

export interface User {
  id?: number
  email?: string | null
  password?: string | null
  avatar?: string | null
  accessToken?: string | null
  createdAt?: string
  updatedAt?: string
}

export interface Attachment {
  id?: number
  url?: string | null
  type?: string | null
  caption?: string | null
  createdAt?: string
  updatedAt?: string
  orderNumber?: number | null
}

export interface Category {
  id?: number
  imageName?: string | null
  title?: string | null
  desc?: string | null
  createdAt?: string
  updatedAt?: string
}

export interface HeroBanner {
  id?: number
  title?: string | null
  imageName?: string | null
  orderNumber?: number | null
  createdAt?: string
  updatedAt?: string
}

export interface HomeProduct {
  id?: number
  title?: string | null
  imageName?: string | null
  orderNumber?: number | null
  createdAt?: string
  updatedAt?: string
}

export interface IndustrySector {
  id?: number
  title?: string | null
  orderNumber?: number | null
  createdAt?: string
  updatedAt?: string
}

export interface Branch {
  id?: number
  title?: string | null
  orderNumber?: number | null
  createdAt?: string
  updatedAt?: string
}

export interface Partner {
  id?: number
  title?: string | null
  imageName?: string | null
  orderNumber?: number | null
  createdAt?: string
  updatedAt?: string
}

export interface PostAttachment {
  id?: number
  postID?: number | null
  attachmentID?: number | null
  url?: string | null
  type?: string | null
  orderNumber?: number | null
  createdAt?: string
  updatedAt?: string
}

export interface Post {
  id?: number
  title?: string | null
  content?: string | null
  imageName?: string | null
  publishedAt?: string | null
  orderNumber?: number | null
  createdAt?: string
  updatedAt?: string
}

export interface Prize {
  id?: number
  title?: string | null
  imageName?: string | null
  orderNumber?: number | null
  createdAt?: string
  updatedAt?: string
}

export interface Product {
  id?: number
  title?: string | null
  desc?: string | null
  imageName?: string | null
  orderNumber?: number | null
  createdAt?: string
  updatedAt?: string
}

export interface ProductCategory {
  id?: number
  categoryID?: number | null
  productID?: number | null
  createdAt?: string
  updatedAt?: string
}

export interface Project {
  id?: number
  title?: string | null
  desc?: string | null
  imageName?: string | null
  orderNumber?: number | null
  createdAt?: string
  updatedAt?: string
}

export interface RecruitmentPost {
  id?: number
  industrySectorID?: number | null
  vacancies?: string | null
  quantity?: string | null
  wage?: string | null
  workingTime?: string | null
  workingPlace?: string | null
  expirationDate?: string | null
  orderNumber?: number | null
  createdAt?: string
  updatedAt?: string
}
