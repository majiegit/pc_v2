import request from '@/utils/request'
import {System_Path} from '@/utils/modulePath'

/**
 * 查询职务字段
 */
export function queryJobFieldList(params) {
  return request({
    url: System_Path + "/job/getJobFieldList",
    method: 'post',
    params: params
  })
}


/**
 * 查询职务列表 - 分页
 */
export function queryJobPage(params) {
  return request({
    url: System_Path + "/job/page",
    method: 'post',
    params: params
  })
}


/**
 * 查询职务列表
 */
export function queryJobList() {
  return request({
    url: System_Path + "/job/list",
    method: 'post'
  })
}

/**
 * 保存职务
 */
export function saveJob(data) {
  return request({
    url: System_Path + "/job/save",
    data: data,
    method: 'post'
  })
}

/**
 * 删除职务
 */
export function deleteJob(jobId) {
  return request({
    url: System_Path + "/job/deleteById",
    params: { jobId: jobId },
    method: 'post'
  })
}

/**
 * 批量删除职务
 */
export function deleteJobBatch(ids) {
  return request({
    url: System_Path + "/job/deleteByIds",
    data: ids,
    method: 'post'
  })
}