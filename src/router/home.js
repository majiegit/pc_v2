import {UserLayout, BasicLayout, BlankLayout, PageView, RouteView, HeaderLayout, LogoLayout} from '@/layouts'

export default [
  /**
   * 主页
   */
  // dashboard
  {
    path: '/dashboard',
    component: LogoLayout,
    redirect: '/dashboard/index',
    children: [
      {
        path: '/dashboard/index',
        name: 'dashboard',
        component: () => import('@/views/dashboard/index')
      }
    ]
  },
]
