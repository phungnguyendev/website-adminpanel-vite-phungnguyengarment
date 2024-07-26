export type StatusType = 'normal' | 'warn' | 'error' | 'success'

export type ItemStatusType = 'draft' | 'active' | 'closed' | 'archived' | 'deleted'

export type NoteItemStatusType = 'lake' | 'enough' | 'arrived' | 'not_arrived'

export type ItemWithKeyAndTitleType = {
  key?: React.Key
  title?: string | React.ReactNode
  desc?: string | React.ReactNode
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
  email?: string
  password?: string
  avatar?: string
  accessToken?: string
  createdAt?: string
  updatedAt?: string
}

export interface Attachment {
  id?: number
  url?: string
  type?: string
  caption?: string
  createdAt?: string
  updatedAt?: string
  orderNumber?: number
}

export interface Category {
  id?: number
  imageUrl?: string
  title?: string
  desc?: string
  createdAt?: string
  updatedAt?: string
}

export interface HeroBanner {
  id?: number
  title?: string
  imageUrl?: string
  orderNumber?: number
  createdAt?: string
  updatedAt?: string
}

export interface HomeProduct {
  id?: number
  title?: string
  imageUrl?: string
  orderNumber?: number
  createdAt?: string
  updatedAt?: string
}

export interface IndustrySector {
  id?: number
  title?: string
  orderNumber?: number
  createdAt?: string
  updatedAt?: string
}

export interface Branch {
  id?: number
  title?: string
  orderNumber?: number
  createdAt?: string
  updatedAt?: string
}

export interface Partner {
  id?: number
  title?: string
  imageUrl?: string
  orderNumber?: number
  createdAt?: string
  updatedAt?: string
}

export interface PostAttachment {
  id?: number
  postID?: number
  attachmentID?: number
  url?: string
  type?: string
  orderNumber?: number
  createdAt?: string
  updatedAt?: string
}

export interface Post {
  id?: number
  title?: string
  content?: string
  imageUrl?: string
  publishedAt?: string
  orderNumber?: number
  createdAt?: string
  updatedAt?: string
}

export interface Prize {
  id?: number
  title?: string
  imageUrl?: string
  orderNumber?: number
  createdAt?: string
  updatedAt?: string
}

export interface Product {
  id?: number
  categoryID?: number
  title?: string
  desc?: string
  imageUrl?: string
  orderNumber?: number
  createdAt?: string
  updatedAt?: string
}

export interface ProductCategory {
  id?: number
  categoryID?: number
  productID?: number
  createdAt?: string
  updatedAt?: string
}

export interface Project {
  id?: number
  title?: string
  desc?: string
  imageUrl?: string
  orderNumber?: number
  createdAt?: string
  updatedAt?: string
}

export interface RecruitmentPost {
  id?: number
  industrySectorID?: number
  vacancies?: string
  quantity?: string
  wage?: string
  workingTime?: string
  workingPlace?: string
  expirationDate?: string
  orderNumber?: number
  createdAt?: string
  updatedAt?: string
}
