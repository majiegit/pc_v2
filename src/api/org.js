import request from '@/utils/request'
import {System_Path} from '@/utils/modulePath'

/**
 * 查询组织字段
 */
export function queryOrgFieldList(params) {
  return request({
    url: System_Path + "/org/getOrgFieldList",
    method: 'post',
    params: params
  })
}


/**
 * 查询组织列表 - 分页
 */
export function queryOrgPage(params) {
  return request({
    url: System_Path + "/org/page",
    method: 'post',
    params: params
  })
}

/**
 * 查询组织树
 */
export function queryOrgTree(params) {
  return request({
    url: System_Path + "/org/tree",
    method: 'post',
    params: params
  })
}


/**
 * 查询组织列表
 */
export function queryOrgList() {
  return request({
    url: System_Path + "/org/list",
    method: 'post'
  })
}

/**
 * 保存组织
 */
export function saveOrg(data) {
  return request({
    url: System_Path + "/org/save",
    data: data,
    method: 'post'
  })
}

/**
 * 删除组织
 */
export function deleteOrg(orgId) {
  return request({
    url: System_Path + "/org/deleteById",
    params: { orgId: orgId },
    method: 'post'
  })
}

/**
 * 批量删除组织
 */
export function deleteOrgBatch(ids) {
  return request({
    url: System_Path + "/org/deleteByIds",
    data: ids,
    method: 'post'
  })
}