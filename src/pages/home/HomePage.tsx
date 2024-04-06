import useTitle from '~/components/hooks/useTitle'
import BaseLayout from '~/components/layout/BaseLayout'
import HeroBannerTable from './components/herobanner/HeroBannerTable'

const HomePage: React.FC = () => {
  useTitle('Home page')

  return (
    <>
      <BaseLayout title='Trang chủ'>
        <HeroBannerTable />
      </BaseLayout>
    </>
  )
}

export default HomePage
