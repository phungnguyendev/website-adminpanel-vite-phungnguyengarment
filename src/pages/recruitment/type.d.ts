import { Branch, IndustrySector, RecruitmentPost } from '~/typing'

export interface RecruitmentTableDataType extends RecruitmentPost {
  key: string
}

export interface IndustrySectorTableDataType extends IndustrySector {
  key: string
}

export interface BranchTableDataType extends Branch {
  key: string
}
