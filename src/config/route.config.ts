import { lazy } from 'react'
import { AiOutlineProduct } from 'react-icons/ai'
import { GoInfo } from 'react-icons/go'
import { IoNewspaperOutline } from 'react-icons/io5'
import { IconType } from 'react-icons/lib'
import { MdOutlineMiscellaneousServices } from 'react-icons/md'
import { TbSmartHome, TbUserSearch } from 'react-icons/tb'

const HomePage = lazy(() => import('~/pages/home/HomePage'))
const AboutPage = lazy(() => import('~/pages/about/AboutPage'))
const ServicePage = lazy(() => import('~/pages/service-page/ServicePage'))
const ProductPage = lazy(() => import('~/pages/product/ProductPage'))
const PostPage = lazy(() => import('~/pages/post/PostPage'))
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
    icon: GoInfo
  },
  {
    key: '2',
    name: 'Dịch vụ',
    path: '/service',
    component: ServicePage,
    icon: MdOutlineMiscellaneousServices
  },
  {
    key: '3',
    name: 'Sản phẩm',
    path: '/product',
    component: ProductPage,
    icon: AiOutlineProduct
  },
  {
    key: '4',
    name: 'Tin tức & Sự kiện',
    path: '/news',
    component: PostPage,
    icon: IoNewspaperOutline
  },
  {
    key: '5',
    name: 'Tuyển dụng',
    path: '/careers',
    component: RecruitmentPage,
    icon: TbUserSearch
  }
]

export default routes
