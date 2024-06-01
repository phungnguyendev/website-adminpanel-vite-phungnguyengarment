import { lazy } from 'react'
import BaseLayout from '~/components/layout/BaseLayout'

const BranchTable = lazy(() => import('./components/BranchTable'))
const IndustrySectorTable = lazy(() => import('./components/IndustrySectorTable'))
const RecruitmentTable = lazy(() => import('./components/RecruitmentTable'))

const RecruitmentPage = () => {
  return (
    <>
      <BaseLayout title='Recruitment'>
        <BranchTable />
        <IndustrySectorTable />
        <RecruitmentTable />
      </BaseLayout>
    </>
  )
}

export default RecruitmentPage
