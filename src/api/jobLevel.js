import request from '@/utils/request'
import {System_Path} from '@/utils/modulePath'

/**
 * 查询职级字段
 */
export function queryJobLevelFieldList(params) {
  return request({
    url: System_Path + "/jobLevel/getJobLevelFieldList",
    method: 'post',
    params: params
  })
}


/**
 * 查询职级列表 - 分页
 */
export function queryJobLevelPage(params) {
  return request({
    url: System_Path + "/jobLevel/page",
    method: 'post',
    params: params
  })
}


/**
 * 查询职级列表
 */
export function queryJobLevelList() {
  return request({
    url: System_Path + "/jobLevel/list",
    method: 'post'
  })
}

/**
 * 保存职级
 */
export function saveJobLevel(data) {
  return request({
    url: System_Path + "/jobLevel/save",
    data: data,
    method: 'post'
  })
}

/**
 * 删除职级
 */
export function deleteJobLevel(jobLevelId) {
  return request({
    url: System_Path + "/jobLevel/deleteById",
    params: { jobLevelId: jobLevelId },
    method: 'post'
  })
}

/**
 * 批量删除职级
 */
export function deleteJobLevelBatch(ids) {
  return request({
    url: System_Path + "/jobLevel/deleteByIds",
    data: ids,
    method: 'post'
  })
}