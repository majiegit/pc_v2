import {UserLayout, BasicLayout, BlankLayout, PageView, RouteView} from '@/layouts'

/**
 *
 * 动态路由 根据模块定义
 */
export const constantRouterComponents = {
  // 基础页面 layout 必须引入
  BasicLayout: BasicLayout,
  BlankLayout: BlankLayout,
  RouteView: RouteView,
  PageView: PageView
}


// 前端未找到页面路由（固定不用改）
export const notFoundRouter = {
  path: '*', redirect: '/404', hidden: true
}

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [

  /**
   * 登录注册
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
        component: () => import('@/views/user/Login')
      },
      {
        name: 'register',
        path: '/register',
        component: () => import('@/views/user/Register')
      },
      {
        name: 'registerResult',
        path: '/registerResult',
        component: () => import('@/views/user/RegisterResult')
      },
    ]
  },
  /**
   * 主页
   */
  // dashboard
  {
    path: '/dashboard',
    component: BasicLayout,
    redirect: '/dashboard/index',
    children: [
      {
        path: '/dashboard/index',
        name: 'dashboard',
        component: () => import('@/views/dashboard/index')
      }
    ]
  },
  /**
   * 个人设置
   */
  // account
  {
    path: '/account',
    component: BasicLayout,
    redirect: '/account/center',
    name: 'account',
    meta: {title: 'menu.account', icon: 'user', keepAlive: true},
    children: [
      {
        path: '/account/center',
        name: 'center',
        component: () => import('@/views/account/center/index')
      },
      {
        path: '/account/settings',
        name: 'settings',
        component: () => import('@/views/account/settings/index')
      }
    ]
  },
  {
    path: '/404',
    component: () => import('@/views/exception/404')
  }
]
