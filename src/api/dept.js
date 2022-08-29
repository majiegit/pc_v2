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
 * 查询部门树
 */
export function queryDeptTree(params) {
  return request({
    url: System_Path + "/dept/tree",
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
 * 查询部门 根据 部门Id
 */
export function getDeptById(id) {
  return request({
    url: System_Path + "/dept/getById",
    params: { id: id },
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