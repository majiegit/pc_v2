import router from './router'
import store from './store'
import storage from 'store'
import NProgress from 'nprogress' // progress bar
import '@/components/NProgress/nprogress.less' // progress bar custom style
import notification from 'ant-design-vue/es/notification'
import { setDocumentTitle, domTitle } from '@/utils/domUtil'
import { HRSH_PC_ACCESS_TOKEN,HRSH_PC_USERINFO,TOKEN_TIME_EXP } from '@/store/mutation-types'
import { i18nRender } from '@/locales'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const allowList = ['login', 'register', 'registerResult'] // no redirect allowList
const loginRoutePath = '/login'
const defaultRoutePath = '/dashboard'

router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar
  to.meta && (typeof to.meta.title !== 'undefined' && setDocumentTitle(`${i18nRender(to.meta.title)} - ${domTitle}`))
  /* has token */
  if (storage.get(HRSH_PC_ACCESS_TOKEN)) {
    // 如果有token 情况下
    if (to.path === loginRoutePath) {
      next({ path: defaultRoutePath })
      NProgress.done()
    } else {
      // check login user.roles is null
      // storage.get(HRSH_PC_USERINFO)
      console.log(store.getters.roles)
      console.log(store.getters.userInfo)
      if (store.getters.userInfo.name === undefined) {
        store
          .dispatch('GetInfo')
          .then(res => {
            const result = res.data
            storage.set(HRSH_PC_USERINFO, result,TOKEN_TIME_EXP)
            // generate dynamic router
            store.dispatch('GenerateRoutes', { result }).then(() => {
              // 根据roles权限生成可访问的路由表
              // 动态添加可访问路由表
              router.addRoutes(store.getters.addRouters)
              // 请求带有 redirect 重定向时，登录自动重定向到该地址
              const redirect = decodeURIComponent(from.query.redirect || to.path)
              if (to.path === redirect) {
                // set the replace: true so the navigation will not leave a history record
                next({ ...to, replace: true })
              } else {
                // 跳转到目的路由
                next({ path: redirect })
              }
            })
          }).catch(() => {
            // notification.error({
            //   message: '错误',
            //   description: '请求用户信息失败，请重试'
            // })
            // 失败时，获取用户信息失败时，调用登出，来清空历史保留信息
            // store.dispatch('Logout').then(() => {
            //   next({ path: loginRoutePath, query: { redirect: to.fullPath } })
            // })
          })
      } else {
        // 有用户权限信息，直接进入
        next()
      }
    }
  } else {
    // 没有token 情况下
    if (allowList.includes(to.name)) {
      // 在免登录名单，直接进入
      next()
    } else {
      // 不在免登陆名单下，跳转登录地址，携带重定向访问地址
      next({ path: loginRoutePath, query: { redirect: to.fullPath } })
      NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
    }
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
