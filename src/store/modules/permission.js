/**
 * 向后端请求用户的菜单，动态生成路由
 */
import { routerList } from '@/router/index'
// import { generatorDynamicRouter } from '@/router/routers'

const permission = {
  state: {
    routers: routerList,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = routerList.concat(routers)
    }
  },
  actions: {
    GenerateRoutes ({ commit }, data) {
      return new Promise(resolve => {
        // const { result } = data
        // generatorDynamicRouter(result).then(routers => {
          commit('SET_ROUTERS', [])
          resolve()
        // })
      })
    }
  }
}

export default permission
