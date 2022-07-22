import request from '@/utils/request'
import {System_Path} from '@/utils/modulePath'

/**
 * 查询所有角色
 */
export function getRoleList() {
  return request({
    url: System_Path + "/user/role/list",
    method: 'get',
  })
}

/**
 * 保存角色
 */
export function saveRole(data) {
  return request({
    url: System_Path + "/user/role/save",
    data: data,
    method: 'post',
  })
}

/**
 * 删除角色
 */
export function deleteRole(id) {
  return request({
    url: System_Path + "/user/role/delete",
    params: { roleId: id },
    method: 'post',
  })
}