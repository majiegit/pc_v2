import request from '@/utils/request'
import {System_Path} from '@/utils/modulePath'

/**
 * 查询部门字段
 */
export function queryDeptFieldList(params) {
  return request({
    url: System_Path + "/dept/getDeptFieldList",
    method: 'post',
    params: params
  })
}


/**
 * 查询部门列表 - 分页
 */
export function queryDeptPage(params) {
  return request({
    url: System_Path + "/dept/page",
    method: 'post',
    params: params
  })
}


/**
 * 查询部门列表
 */
export function queryDeptList() {
  return request({
    url: System_Path + "/dept/list",
    method: 'post'
  })
}

/**
 * 保存部门
 */
export function saveDept(data) {
  return request({
    url: System_Path + "/dept/save",
    data: data,
    method: 'post'
  })
}

/**
 * 删除部门
 */
export function deleteDept(deptId) {
  return request({
    url: System_Path + "/dept/deleteById",
    params: { deptId: deptId },
    method: 'post'
  })
}

/**
 * 批量删除部门
 */
export function deleteDeptBatch(ids) {
  return request({
    url: System_Path + "/dept/deleteByIds",
    data: ids,
    method: 'post'
  })
}