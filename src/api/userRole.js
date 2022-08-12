import request from '@/utils/request'
import {System_Path} from '@/utils/modulePath'

/**
 * 查询角色用户
 */
export function queryRoleUser(roleId) {
  return request({
    url: System_Path + "/userRole/queryUserList",
    method: 'post',
    params: {roleId: roleId}
  })
}

/**
 * 取消关联角色用户
 */
export function removeRoleUser(roleId, userIds) {
  return request({
    url: System_Path + "/userRole/removeUser",
    method: 'post',
    data: {roleId: roleId, userIds: userIds}
  })
}