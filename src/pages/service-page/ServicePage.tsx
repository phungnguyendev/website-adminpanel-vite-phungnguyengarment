import { lazy } from 'react'
import BaseLayout from '~/components/layout/BaseLayout'

const ProjectTable = lazy(() => import('./components/ProjectTable'))

const ServicePage = () => {
  return (
    <>
      <BaseLayout title='Service page'>
        <ProjectTable />
      </BaseLayout>
    </>
  )
}

export default ServicePage
