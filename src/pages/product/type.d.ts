import { Category, Product } from '~/typing'

export interface ProductTableDataType extends Product {
  key: string
}

export interface CategoryTableDataType extends Category {
  key: string
}
