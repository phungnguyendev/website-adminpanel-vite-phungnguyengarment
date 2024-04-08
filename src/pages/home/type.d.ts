import { HeroBanner, HomeProduct, Partner } from '~/typing'

export interface HeroBannerTableDataType extends HeroBanner {
  key: string
}

export interface HomeProductTableDataType extends HomeProduct {
  key: string
}

export interface PartnerTableDataType extends Partner {
  key: string
}
