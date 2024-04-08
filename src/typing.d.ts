export type StatusType = 'normal' | 'warn' | 'error' | 'success'

export type SortDirection = 'asc' | 'desc'

export type ItemStatusType = 'draft' | 'active' | 'closed' | 'archived' | 'deleted'

export type NoteItemStatusType = 'lake' | 'enough' | 'arrived' | 'not_arrived'

export type InputType =
  | 'number'
  | 'text'
  | 'colorpicker'
  | 'select'
  | 'datepicker'
  | 'colorselector'
  | 'textarea'
  | 'checkbox'
  | 'multipleselect'
  | 'password'
  | 'email'
  | 'uploadFile'

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
  fullName?: string | null
  email?: string | null
  password?: string | null
  avatar?: string | null
  phone?: string | null
  otp?: string | null
  appPassword?: string | null
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
  icon?: string | null
  title?: string | null
  desc?: string | null
  createdAt?: string
  updatedAt?: string
}

export interface HeroBanner {
  id?: number
  title?: string | null
  imageId?: string | null
  orderNumber?: number | null
  createdAt?: string
  updatedAt?: string
}

export interface HomeProduct {
  id?: number
  title?: string | null
  imageId?: string | null
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

export interface Partner {
  id?: number
  title?: string | null
  imageId?: string | null
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
  publishedAt?: string | null
  orderNumber?: number | null
  createdAt?: string
  updatedAt?: string
}

export interface Prize {
  id?: number
  title?: string | null
  imageId?: string | null
  orderNumber?: number | null
  createdAt?: string
  updatedAt?: string
}

export interface Product {
  id?: number
  title?: string | null
  desc?: string | null
  imageId?: string | null
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
  imageId?: string | null
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
  workPlace?: string | null
  expirationDate?: string | null
  orderNumber?: number | null
  createdAt?: string
  updatedAt?: string
}
