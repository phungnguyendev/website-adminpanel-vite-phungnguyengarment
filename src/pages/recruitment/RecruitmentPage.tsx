import { lazy } from 'react'
import BaseLayout from '~/components/layout/BaseLayout'

const JobSectorTable = lazy(() => import('./components/JobSectorTable'))
const RecruitmentTable = lazy(() => import('./components/RecruitmentTable'))

const RecruitmentPage = () => {
  return (
    <>
      <BaseLayout title='Recruitment'>
        <JobSectorTable />
        <RecruitmentTable />
      </BaseLayout>
    </>
  )
}

export default RecruitmentPage
