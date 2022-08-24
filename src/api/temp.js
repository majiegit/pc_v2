import request from '@/utils/request'
import {System_Path} from '@/utils/modulePath'

/**
 * 查询模板字段
 */
export function queryDictFieldList(params) {
  return request({
    url: System_Path + "/dict/getDictFieldList",
    method: 'post',
    params: params
  })
}


/**
 * 查询模板列表 - 分页
 */
export function queryDictPage(params) {
  return request({
    url: System_Path + "/dict/page",
    method: 'post',
    params: params
  })
}


/**
 * 查询模板列表
 */
export function queryDictList() {
  return request({
    url: System_Path + "/dict/list",
    method: 'post'
  })
}

/**
 * 保存模板
 */
export function saveDict(data) {
  return request({
    url: System_Path + "/dict/save",
    data: data,
    method: 'post'
  })
}

/**
 * 删除模板
 */
export function deleteDict(dictId) {
  return request({
    url: System_Path + "/dict/deleteById",
    params: { dictId: dictId },
    method: 'post'
  })
}

/**
 * 批量删除模板
 */
export function deleteDictBatch(ids) {
  return request({
    url: System_Path + "/dict/deleteByIds",
    data: ids,
    method: 'post'
  })
}