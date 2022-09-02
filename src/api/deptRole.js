import request from '@/utils/request'
import {System_Path} from '@/utils/modulePath'

/**
 * 查询所有角色
 */
export function getDeptRoleList(params) {
  return request({
    url: System_Path + "/deptRole/list",
    method: 'post',
    params: params
  })
}

/**
 * 保存角色
 */
export function saveDeptRole(data) {
  return request({
    url: System_Path + "/deptRole/save",
    data: data,
    method: 'post',
  })
}

/**
 * 删除角色
 */
export function deleteDeptRole(deptId,roleId) {
  return request({
    url: System_Path + "/deptRole/delete",
    params: {
      deptId: deptId,
      roleId: roleId
    },
    method: 'post',
  })
}