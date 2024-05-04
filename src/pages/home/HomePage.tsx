import { lazy } from 'react'
import useTitle from '~/components/hooks/useTitle'
import BaseLayout from '~/components/layout/BaseLayout'

const HeroBannerTable = lazy(() => import('./components/hero-banner/HeroBannerTable'))
const HomeProductTable = lazy(() => import('./components/home-product/HomeProductTable'))
const PartnerTable = lazy(() => import('./components/partner/PartnerTable'))

const HomePage: React.FC = () => {
  useTitle('Home page')

  return (
    <>
      <BaseLayout title='Home page'>
        <HeroBannerTable />
        <HomeProductTable />
        <PartnerTable />
      </BaseLayout>
    </>
  )
}

export default HomePage
