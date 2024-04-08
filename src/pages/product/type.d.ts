import { Category, Product } from '~/typing'

export interface ProductTableDataType extends Product {
  key: string
  category?: Category
}

export interface CategoryTableDataType extends Category {
  key: string
}
