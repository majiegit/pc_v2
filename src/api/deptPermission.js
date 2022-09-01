import request from '@/utils/request'
import {System_Path} from '@/utils/modulePath'


/**
 * 查询部门权限列表
 */
export function queryDeptPermissionList(deptId) {
  return request({
    url: System_Path + "/deptPermission/list",
    method: 'post',
    params: {deptId: deptId}
  })
}

/**
 * 查询部门权限Id集合列表
 */
export function queryDeptPermissionIds(deptId) {
  return request({
    url: System_Path + "/deptPermission/permissionIds",
    method: 'post',
    params: {deptId: deptId}
  })
}

/**
 * 保存部门权限
 */
export function saveDeptPermission(data) {
  return request({
    url: System_Path + "/deptPermission/save",
    data: data,
    method: 'post'
  })
}

/**
 * 查询部门权限树
 */
export function queryDeptPermissionTree(deptId) {
  return request({
    url: System_Path + "/deptPermission/tree",
    method: 'post',
    params: {deptId: deptId}
  })
}