import { Box } from 'lucide-react'
import { lazy } from 'react'
import { BsInfoSquare } from 'react-icons/bs'
import { IoSettingsOutline } from 'react-icons/io5'
import { TbSmartHome } from 'react-icons/tb'
const HomePage = lazy(() => import('~/pages/home/HomePage'))
const AboutPage = lazy(() => import('~/pages/about/AboutPage'))
const ServicePage = lazy(() => import('~/pages/service-page/ServicePage'))
const ProductPage = lazy(() => import('~/pages/product/ProductPage'))

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
    component: HomePage,
    isGroup: false,
    icon: TbSmartHome
  },
  {
    key: '2',
    name: 'Giới thiệu',
    path: 'about',
    component: AboutPage,
    isGroup: false,
    icon: BsInfoSquare
  },
  {
    key: '3',
    name: 'Dịch vụ',
    path: 'services',
    isGroup: false,
    component: ServicePage,
    icon: IoSettingsOutline
  },
  {
    key: '4',
    name: 'Sản phẩm',
    path: 'products',
    component: ProductPage,
    icon: Box
  }
  // {
  //   key: '5',
  //   name: 'Tin tức & Sự kiện',
  //   path: 'news',
  //   component: FinishPage,
  //   isGroup: false,
  //   icon: Newspaper
  // },
  // {
  //   key: '6',
  //   name: 'Tuyển dụng',
  //   path: 'recruitment',
  //   component: FinishPage,
  //   isGroup: false,
  //   icon: FileSearch
  // }
]
