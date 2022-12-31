import { UserLayout, BasicLayout, BlankLayout, PageView, RouteView, HeaderLayout, LogoLayout, leftLayout } from '@/layouts'

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


    ]
  },
  {
    path: '/dashboard/index',
    name: 'dashboard',
    component: () => import('@/views/dashboard/index')
  },
  {
    path: '/message',
    name: 'message',
    component: () => import('@/views/message/index')
  },
  // {
  //   path: '/message/details',
  //   name: 'details',
  //   component: () => import('@/views/message/details')
  // },
  {
    path: '/salary',
    name: 'salary',
    component: () => import('@/views/salary/index')
  },
  {
    path: '/personal',
    name: 'personal',
    component: () => import('@/views/personal/index')
  },
  {
    path: '/accessory',
    name: 'accessory',
    component: () => import('@/views/accessory/index')
  },
  {
    path: '/myApply',
    name: 'myApply',
    component: () => import('@/views/myApply/index')
  },
  {
    path: '/leaveEdit',
    name: 'leaveEdit',
    component: () => import('@/views/leave/edit')
  },
  {
    path: '/leaveDetail',
    name: 'leaveDetail',
    component: () => import('@/views/leave/detail')
  },
  {
    path: '/leaveApprove',
    name: 'leaveApprove',
    component: () => import('@/views/leave/approve')
  },
  {
    path: '/approveCenter',
    name: 'approveCenter',
    component: () => import('@/views/approveCenter/index')
  },
  {
    path: '/leaveoffEdit',
    name: 'leaveoffEdit',
    component: () => import('@/views/leaveoff/edit')
  },
  {
    path: '/leaveoffDetail',
    name: 'leaveoffDetail',
    component: () => import('@/views/leaveoff/detail')
  },
  {
    path: '/leaveoffApprove',
    name: 'leaveoffApprove',
    component: () => import('@/views/leaveoff/approve')
  },
  {
    path: '/tripoffEdit',
    name: 'tripoffEdit',
    component: () => import('@/views/tripoff/edit')
  },
  {
    path: '/tripoffDetail',
    name: 'tripoffDetail',
    component: () => import('@/views/tripoff/detail')
  },
  {
    path: '/tripoffApprove',
    name: 'tripoffApprove',
    component: () => import('@/views/tripoff/approve')
  },

  {
    path: '/tripEdit',
    name: 'tripEdit',
    component: () => import('@/views/trip/edit')
  },
  {
    path: '/tripDetail',
    name: 'tripDetail',
    component: () => import('@/views/trip/detail')
  },
  {
    path: '/tripApprove',
    name: 'tripApprove',
    component: () => import('@/views/trip/approve')
  }
]

