import request from '@/utils/request'
import {System_Path} from '@/utils/modulePath'

/**
 * 查询所有权限 树形
 */
export function permissionTree(params) {
  return request({
    url: System_Path + "/permission/tree",
    method: 'get',
    params: params
  })
}

/**
 * 保存菜单权限
 */
export function permissionSave(data) {
  return request({
    url: System_Path + "/permission/save",
    data: data,
    method: 'post',
  })
}

/**
 * 删除权限菜单
 */
export function deletePermission(ids) {
  return request({
    url: System_Path + "/permission/deleteById",
    data: ids,
    method: 'post',
  })
}