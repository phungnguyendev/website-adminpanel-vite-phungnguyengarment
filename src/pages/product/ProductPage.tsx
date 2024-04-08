import BaseLayout from '~/components/layout/BaseLayout'
import CategoryTable from './components/category/CategoryTable'
import ProductTable from './components/product/ProductTable'

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
