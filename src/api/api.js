import request from '@/utils/request'
import {System_Path} from '@/utils/modulePath'


/**
 * 查询API接口列表 - 分页
 */
export function queryApiPage(data) {
  return request({
    url: System_Path + "/api/page",
    method: 'post',
    params: data
  })
}


/**
 * 查询API接口列表
 */
export function queryApiList() {
  return request({
    url: System_Path + "/api/list",
    method: 'post'
  })
}

/**
 * 保存API接口
 */
export function saveApi(data) {
  return request({
    url: System_Path + "/api/save",
    data: data,
    method: 'post'
  })
}

/**
 * 删除API接口
 */
export function deleteApi(id) {
  return request({
    url: System_Path + "/api/deleteById",
    params: { id: id },
    method: 'post'
  })
}

/**
 * 批量删除API接口
 */
export function deleteApiBatch(ids) {
  return request({
    url: System_Path + "/api/deleteByIds",
    data: ids,
    method: 'post'
  })
}