import { Box, Newspaper } from 'lucide-react'
import { lazy } from 'react'
import { BsInfoSquare } from 'react-icons/bs'
import { IoSettingsOutline } from 'react-icons/io5'
import { TbSmartHome } from 'react-icons/tb'

const HomePage = lazy(() => import('~/pages/home/HomePage'))
const AboutPage = lazy(() => import('~/pages/about/AboutPage'))
const ServicePage = lazy(() => import('~/pages/service-page/ServicePage'))
const ProductPage = lazy(() => import('~/pages/product/ProductPage'))
const NewsEventPage = lazy(() => import('~/pages/newsevent/NewsEventPage'))
const PostDetails = lazy(() => import('~/pages/newsevent/components/post/PostDetails'))

export interface RouteType {
  name: string
  path: string
  breadcrumb: string
  component: React.LazyExoticComponent<() => JSX.Element> | React.ReactNode | any
  icon?: React.LazyExoticComponent<() => JSX.Element> | React.ReactNode | any
}

export const routeSide: RouteType[] = [
  {
    name: 'Trang chủ',
    path: '/',
    breadcrumb: 'Home',
    component: HomePage,
    icon: TbSmartHome
  },
  { name: 'Giới thiệu', path: '/about', breadcrumb: 'About', component: AboutPage, icon: BsInfoSquare },
  { name: 'Dịch vụ', path: '/services', breadcrumb: 'Service', component: ServicePage, icon: IoSettingsOutline },
  { name: 'Sản phẩm', path: '/products', breadcrumb: 'Products', component: ProductPage, icon: Box },
  {
    name: 'Tin tức & Sự kiện',
    path: '/news',
    breadcrumb: 'News',
    component: NewsEventPage,
    icon: Newspaper
  }
]

export const routes: RouteType[] = [
  {
    name: 'Trang chủ',
    path: '/',
    breadcrumb: 'Home',
    component: HomePage,
    icon: TbSmartHome
  },
  { name: 'Giới thiệu', path: '/about', breadcrumb: 'About', component: AboutPage, icon: BsInfoSquare },
  { name: 'Dịch vụ', path: '/services', breadcrumb: 'Service', component: ServicePage, icon: IoSettingsOutline },
  { name: 'Sản phẩm', path: '/products', breadcrumb: 'Products', component: ProductPage, icon: Box },
  {
    name: 'Tin tức & Sự kiện',
    path: '/news',
    breadcrumb: 'News',
    component: NewsEventPage,
    icon: Newspaper
  },
  {
    name: 'Chi tiết tin tức',
    path: '/news/:postID',
    breadcrumb: 'Post detail',
    component: PostDetails,
    icon: Newspaper
  }
]
