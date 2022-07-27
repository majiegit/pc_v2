import request from '@/utils/request'
import {System_Path} from '@/utils/modulePath'


/**
 * 查询数据字典列表 根据Name 状态
 */
export function queryDictItemListByName(dictId, status, itemText) {
  return request({
    url: System_Path + "/dictItem/list",
    method: 'post',
    params: {dictId: dictId, status: status, itemText: itemText}
  })
}

/**
 * 查询数据字典列表 根据id 状态
 */
export function queryDictItemList(dictId, status) {
  return request({
    url: System_Path + "/dictItem/list",
    method: 'post',
    params: {dictId: dictId, status: status}
  })
}

/**
 * 保存数据字典
 */
export function saveDictItem(data) {
  return request({
    url: System_Path + "/dictItem/save",
    data: data,
    method: 'post'
  })
}

/**
 * 删除数据字典
 */
export function deleteDictItem(id) {
  return request({
    url: System_Path + "/dictItem/deleteById",
    params: {id: id},
    method: 'post'
  })
}

/**
 * 批量删除数据字典
 */
export function deleteDictItemBatch(ids) {
  return request({
    url: System_Path + "/dictItem/deleteByIds",
    data: ids,
    method: 'post'
  })
}