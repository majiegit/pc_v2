import request from '@/utils/request'
import {System_Path} from '@/utils/modulePath'

/**
 * 查询部门人员列表
 */
export function queryDeptUserList(deptId) {
  return request({
    url: System_Path + "/deptUser/list",
    method: 'post',
    params: {deptId: deptId}
  })
}

/**
 * 保存部门人员
 */
export function saveDeptUser(data) {
  return request({
    url: System_Path + "/deptUser/save",
    data: data,
    method: 'post'
  })
}

/**
 * 删除部门人员
 */
export function deleteDeptUser(deptUserId) {
  return request({
    url: System_Path + "/deptUser/deleteById",
    params: {deptUserId: deptUserId},
    method: 'post'
  })
}

/**
 * 批量删除部门人员
 */
export function deleteDeptUserBatch(ids) {
  return request({
    url: System_Path + "/deptUser/deleteByIds",
    data: ids,
    method: 'post'
  })
}