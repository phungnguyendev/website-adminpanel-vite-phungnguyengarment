import { lazy } from 'react'
import { GrStatusInfo } from 'react-icons/gr'
import { IconType } from 'react-icons/lib'
import { TbSmartHome } from 'react-icons/tb'

const HomePage = lazy(() => import('~/pages/home/HomePage'))
const AboutPage = lazy(() => import('~/pages/about/AboutPage'))
const ServicePage = lazy(() => import('~/pages/service-page/ServicePage'))
const ProductPage = lazy(() => import('~/pages/product/ProductPage'))
const NewsEventPage = lazy(() => import('~/pages/newsevent/NewsEventPage'))
const RecruitmentPage = lazy(() => import('~/pages/recruitment/RecruitmentPage'))

export type SideType = {
  key: string
  name: string
  path: string
  component: React.LazyExoticComponent<() => JSX.Element> | React.ReactNode | any
  icon: IconType
}

const routes: SideType[] = [
  {
    key: '0',
    name: 'Trang chủ',
    path: '/',
    component: HomePage,
    icon: TbSmartHome
  },
  {
    key: '1',
    name: 'Giới thiệu',
    path: '/about',
    component: AboutPage,
    icon: GrStatusInfo
  },
  {
    key: '2',
    name: 'Dịch vụ',
    path: '/service',
    component: ServicePage,
    icon: TbSmartHome
  },
  {
    key: '3',
    name: 'Sản phẩm',
    path: '/product',
    component: ProductPage,
    icon: TbSmartHome
  },
  {
    key: '4',
    name: 'Tin tức & Sự kiện',
    path: '/news',
    component: NewsEventPage,
    icon: TbSmartHome
  },
  {
    key: '5',
    name: 'Tuyển dụng',
    path: '/careers',
    component: RecruitmentPage,
    icon: TbSmartHome
  }
]

export default routes
