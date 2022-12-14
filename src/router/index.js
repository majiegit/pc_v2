import Vue from 'vue'
import Router from 'vue-router'
import login from '@/router/login'
import home from '@/router/home'
import fixed from '@/router/fixed'

export const routerList = [].concat(
  login,
  home,
  fixed
)
// hack router push callback
const originalPush = Router.prototype.push
Router.prototype.push = function push (location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(Router)
export default new Router({
  mode: 'hash',
  routes: routerList,
  base: process.env.NODE_ENV === 'production' ? '/hrself': './',
})
