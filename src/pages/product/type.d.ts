import { Category, Product } from '~/typing'

export interface ProductTableDataType extends Product {
  key: string
  category?: Category
}

export interface ProductNewRecord {
  categoryID?: number
  title?: string
  desc?: string
  imageUrl?: string
}

export interface CategoryTableDataType extends Category {
  key: string
}

export interface CategoryNewRecord {
  imageUrl?: string
  title?: string
  desc?: string
}
