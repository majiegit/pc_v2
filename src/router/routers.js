import {constantRouterComponents, notFoundRouter} from '@/config/router.config'


// 根级菜单
const rootRouter = {
  name: 'index',
  path: '/',
  component: 'BasicLayout',
  redirect: '/home',
  meta: {
    title: '主页'
  },
  children: []
}

/**
 * 动态生成菜单
 * @param token
 * @returns {Promise<Router>}
 */
export const generatorDynamicRouter = (res) => {
  return new Promise((resolve) => {
    const {permissions} = res
    const menu = []
    const childrenNav = []
    //      后端数据, 根级树数组,  根级 PID
    listToTree(permissions, childrenNav, '0')
    rootRouter.children = childrenNav
    menu.push(rootRouter)
    const routers = generator(menu)
    console.log('路由菜单',routers)
    routers.push(notFoundRouter)
    resolve(routers)
  })
}

/**
 * 格式化树形结构数据 生成 vue-router 层级路由表
 *
 * @param routerMap
 * @param parent
 * @returns {*}
 */
export const generator = (routerMap, parent) => {
  return routerMap.map(item => {
    const {title, hidden, openMode, path, name, icon, component,isRoute} = item
    const currentRouter = {
      // 如果路由设置了 path，则作为默认 path，否则 路由地址 动态拼接生成如 /dashboard/workplace
      path: path,
      // 路由名称，建议唯一
      name: name,
      // 该路由对应页面的 组件 :方案1
      // component: constantRouterComponents[item.component || item.key],
      // 该路由对应页面的 组件 :方案2 (动态加载)

      // meta: 页面标题, 菜单图标, 页面权限(供指令权限用，可去掉)
      meta: {
        title: title,
        icon: icon || undefined
      }
    }
    if (component) {
      currentRouter.component = constantRouterComponents[component]
    }else {
      if(isRoute){
        currentRouter.component = () => import(`@/views${path}`)
      }
    }
    // 是否设置了隐藏菜单
    if (hidden) {
      currentRouter.hidden = true
    }
    // 是否设置打开方式
    if (openMode == 1) {
      currentRouter.meta.target = '_blank'
    }
    // // 是否设置了隐藏子菜单
    // if (hideChildren) {
    //   currentRouter.hideChildrenInMenu = true
    // }
    // 为了防止出现后端返回结果不规范，处理有可能出现拼接出两个 反斜杠
    // if (!currentRouter.path.startsWith('http')) {
    //   currentRouter.path = currentRouter.path.replace('//', '/')
    // }
    // 重定向
    item.redirect && (currentRouter.redirect = item.redirect)
    // 是否有子菜单，并递归处理
    if (item.children && item.children.length > 0) {
      // Recursion
      currentRouter.children = generator(item.children, currentRouter)
    }
    return currentRouter
  })
}

/**
 * 数组转树形结构
 * @param list 源数组
 * @param tree 树
 * @param parentId 父ID
 */
const listToTree = (list, tree, parentId) => {
  list.forEach(item => {
    // 判断是否为父级菜单
    if (item.pid === parentId) {
      const child = {
        ...item,
        children: []
      }
      // 迭代 list， 找到当前菜单相符合的所有子菜单
      listToTree(list, child.children, item.id)
      // 删掉不存在 children 值的属性
      if (child.children.length <= 0) {
        delete child.children
      }
      // 加入到树中
      tree.push(child)
    }
  })
}
