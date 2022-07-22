import request from '@/utils/request'
import {System_Path} from '@/utils/modulePath'

/**
 * 查询当前角色权限
 */
export function rolePermissionListByRoleId(roleId) {
  return request({
    url: System_Path + "/user/rolePermission/list",
    method: 'post',
    params: {roleId: roleId}
  })
}
/**
 * 保存角色权限
 */
export function saveRolePermission(roleId,permissionIds) {
  return request({
    url: System_Path + "/user/rolePermission/save",
    method: 'post',
    data: {roleId: roleId, permissionIds: permissionIds}
  })
}