import { UserLayout } from '@/layouts'
// 基础
import base from '@/router/base'
// 系统管理
import system from '@/router/system/index'

/**
 *
 * 动态路由 根据模块定义
 */
export const constantRouterComponents = Object.assign(
  base,
  system
)



// 前端未找到页面路由（固定不用改）
export const notFoundRouter = {
  path: '*', redirect: '/404', hidden: true
}

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/',
    component: UserLayout,
    redirect: '/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/login/Login')
      }
    ]
  },
  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  }
]
