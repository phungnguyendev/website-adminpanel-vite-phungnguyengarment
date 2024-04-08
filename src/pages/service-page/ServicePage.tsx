import BaseLayout from '~/components/layout/BaseLayout'
import ProjectTable from './components/ProjectTable'

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
