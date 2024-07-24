import { lazy } from 'react'
import BaseLayout from '~/components/layout/BaseLayout'

const PrizeTable = lazy(() => import('./components/PrizeTable'))

const AboutPage = () => {
  return (
    <>
      <BaseLayout title='About page'>
        <PrizeTable />
      </BaseLayout>
    </>
  )
}

export default AboutPage
