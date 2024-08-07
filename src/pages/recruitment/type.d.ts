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
  age?: string
  sex?: string
  academicLevel?: string
  routeTitle?: string
  workingTime?: string
  workingPlace?: string
  expirationDate?: string
  jobDescription?: string
  required?: string
  benefits?: string
}

export interface JobSectorNewRecord {
  title?: string
}
