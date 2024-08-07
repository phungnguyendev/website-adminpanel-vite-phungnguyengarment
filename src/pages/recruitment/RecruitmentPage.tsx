import { lazy } from 'react'
import BaseLayout from '~/components/layout/BaseLayout'

const JobSectorTable = lazy(() => import('./components/JobSectorTable'))
const RecruitmentList = lazy(() => import('./components/RecruitmentList'))

const RecruitmentPage = () => {
  return (
    <>
      <BaseLayout title='Recruitment'>
        <JobSectorTable />
        <RecruitmentList />
      </BaseLayout>
    </>
  )
}

export default RecruitmentPage
