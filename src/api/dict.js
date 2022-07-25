import request from '@/utils/request'
import {System_Path} from '@/utils/modulePath'

/**
 * 查询字段数据
 */
export function queryFieldList(param) {
  return request({
    url: System_Path + "/dict/getFieldList",
    method: 'post',
    data: param
  })
}

/**
 * 查询数据字典列表 - 分页
 */
export function queryDictPage(current,size,groupId) {
  return request({
    url: System_Path + "/dict/page",
    method: 'post',
    params: {current: current, size: size,groupId: groupId}
  })
}


/**
 * 查询数据字典列表
 */
export function queryDictList() {
  return request({
    url: System_Path + "/dict/list",
    method: 'post'
  })
}

/**
 * 保存数据字典
 */
export function saveDict(data) {
  return request({
    url: System_Path + "/dict/save",
    data: data,
    method: 'post'
  })
}

/**
 * 删除数据字典
 */
export function deleteDict(id) {
  return request({
    url: System_Path + "/dict/deleteById",
    params: { id: id },
    method: 'post'
  })
}

/**
 * 批量删除数据字典
 */
export function deleteDictBatch(ids) {
  return request({
    url: System_Path + "/dict/deleteByIds",
    data: ids,
    method: 'post'
  })
}