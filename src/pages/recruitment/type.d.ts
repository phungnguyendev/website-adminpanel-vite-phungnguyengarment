import { JobSector, RecruitmentPost } from '~/typing'

export interface RecruitmentPostTableDataType extends RecruitmentPost {
  key: string
}

export interface JobSectorTableDataType extends JobSector {
  key: string
}

export interface RecruitmentPostNewRecord {
  jobSectorID?: number
  quantity?: number
  wage?: string
  workingTime?: string
  workingPlace?: string
  expirationDate?: string
}

export interface JobSectorNewRecord {
  title?: string
}
