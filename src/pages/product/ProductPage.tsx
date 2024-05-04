import { lazy } from 'react'
import BaseLayout from '~/components/layout/BaseLayout'

const CategoryTable = lazy(() => import('./components/category/CategoryTable'))
const ProductTable = lazy(() => import('./components/product/ProductTable'))

const ProductPage = () => {
  return (
    <>
      <BaseLayout title='Product page'>
        <CategoryTable />
        <ProductTable />
      </BaseLayout>
    </>
  )
}

export default ProductPage
