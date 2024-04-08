import useTitle from '~/components/hooks/useTitle'
import BaseLayout from '~/components/layout/BaseLayout'
import HeroBannerTable from './components/hero-banner/HeroBannerTable'
import HomeProductTable from './components/home-product/HomeProductTable'
import PartnerTable from './components/partner/PartnerTable'

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
