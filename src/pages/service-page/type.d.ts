import { Project } from '~/typing'

export interface ProjectTableDataType extends Project {
  key: string
}

export interface NewRecordProject {
  title?: string
  desc?: string
  imageUrl?: string
}
