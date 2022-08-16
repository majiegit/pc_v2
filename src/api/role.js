import request from '@/utils/request'
import {System_Path} from '@/utils/modulePath'

/**
 * 查询所有角色
 */
export function getRoleList(params) {
  return request({
    url: System_Path + "/role/list",
    method: 'post',
    params: params
  })
}

/**
 * 保存角色
 */
export function saveRole(data) {
  return request({
    url: System_Path + "/role/save",
    data: data,
    method: 'post',
  })
}

/**
 * 删除角色
 */
export function deleteRole(id) {
  return request({
    url: System_Path + "/role/delete",
    params: { roleId: id },
    method: 'post',
  })
}