import {UserLayout, BasicLayout, BlankLayout, PageView, RouteView, HeaderLayout, LogoLayout} from '@/layouts'

export default [

  /**
   * 登录
   */
  {
    path: '/',
    component: UserLayout,
    redirect: '/login',
    hidden: true,
    children: [
      {
        name: 'login',
        path: '/login',
        component: () => import('@/views/login/Login')
      }
    ]
  },
  {
    path: '/404',
    component: () => import('@/views/exception/404')
  }
]
