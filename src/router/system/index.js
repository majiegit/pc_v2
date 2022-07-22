
/**
 * 系统模块路由信息
 * @type { *[] }
 */
export default {
  /**
   * 主页路由
   * @returns {Promise<*>|*}
   * @constructor
   */
  'Dashboard': () => import('@/views/home/index'),

  /**
   * 菜单管理
   * @returns {Promise<*>|*}
   * @constructor
   */
  'MenuIndex': () => import('@/views/system/menu/index'),
}

