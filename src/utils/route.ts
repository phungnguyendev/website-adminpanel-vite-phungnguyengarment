import { Box, FileSearch, Newspaper } from 'lucide-react'
import { lazy } from 'react'
import { BsInfoSquare } from 'react-icons/bs'
import { IoSettingsOutline } from 'react-icons/io5'
import { TbSmartHome } from 'react-icons/tb'
const CuttingGroupPage = lazy(() => import('~/pages/cutting-group/CuttingGroupPage'))
// const RolePage = lazy(() => import('~/pages/role/RolePage'))
const GarmentAccessoryPage = lazy(() => import('~/pages/about/AboutPage'))
const ProductPage = lazy(() => import('~/pages/home/HomePage'))
// const ImportationPage = lazy(() => import('~/pages/importation/ImportationPage'))
const SewingLineDeliveryPage = lazy(() => import('~/pages/sewing-line-delivery/SewingLineDeliveryPage'))
const FinishPage = lazy(() => import('~/pages/completion/CompletionPage'))

export type SideType = {
  key: string
  name: string
  path: string
  component: React.LazyExoticComponent<() => JSX.Element> | React.ReactNode | any
  isGroup?: boolean
  icon: React.LazyExoticComponent<() => JSX.Element> | React.ReactNode | any
}

export const appRoutes: SideType[] = [
  {
    key: '1',
    name: 'Trang chủ',
    path: '/',
    component: ProductPage,
    isGroup: false,
    icon: TbSmartHome
  },
  {
    key: '2',
    name: 'Giới thiệu',
    path: 'about',
    component: GarmentAccessoryPage,
    isGroup: false,
    icon: BsInfoSquare
  },
  {
    key: '3',
    name: 'Dịch vụ',
    path: 'services',
    isGroup: false,
    component: CuttingGroupPage,
    icon: IoSettingsOutline
  },
  {
    key: '4',
    name: 'Sản phẩm',
    path: 'products',
    component: SewingLineDeliveryPage,
    icon: Box
  },
  {
    key: '5',
    name: 'Tin tức & Sự kiện',
    path: 'news',
    component: FinishPage,
    isGroup: false,
    icon: Newspaper
  },
  {
    key: '6',
    name: 'Tuyển dụng',
    path: 'recruitment',
    component: FinishPage,
    isGroup: false,
    icon: FileSearch
  }
]
