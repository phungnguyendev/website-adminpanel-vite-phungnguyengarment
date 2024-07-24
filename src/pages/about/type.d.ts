import { Prize } from '~/typing'

export interface PrizeTableDataType extends Prize {
  key: string
}

export interface NewRecordPrize {
  title?: string
  imageUrl?: string
}
