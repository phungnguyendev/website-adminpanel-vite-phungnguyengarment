import { HeroBanner, HomeProduct, Partner } from '~/typing'

export interface BannerTableDataType extends HeroBanner {
  key: string
}

export interface NewRecordHeroBanner {
  title?: string
  imageUrl?: string
}

export interface HomeProductTableDataType extends HomeProduct {
  key: string
}

export interface PartnerTableDataType extends Partner {
  key: string
}
