import request from '@/utils/request'
import {System_Path} from '@/utils/modulePath'

/**
 * 查询角色用户
 */
export function queryRoleUser(params) {
  return request({
    url: System_Path + "/userRole/queryUserList",
    method: 'post',
    params: params
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

/**
 * 保存角色用户关联
 */
export function saveUserRole(roleId, userIds) {
  return request({
    url: System_Path + "/userRole/saveUserRole",
    method: 'post',
    data: {roleId: roleId, userIds: userIds}
  })
}


