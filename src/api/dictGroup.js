import request from '@/utils/request'
import {System_Path} from '@/utils/modulePath'

/**
 * 查询数据字典列表 - 分页
 */
export function queryDictGroupPage(current, size) {
  return request({
    url: System_Path + "/dictGroup/page",
    method: 'post',
    params: {current: current, size: size}
  })
}


/**
 * 查询数据字典列表
 */
export function queryDictGroupListByGroupName(groupName) {
  return request({
    url: System_Path + "/dictGroup/list",
    method: 'post',
    params: { groupName: groupName}
  })
}

/**
 * 查询数据字典列表
 */
export function queryDictGroupList() {
  return request({
    url: System_Path + "/dictGroup/list",
    method: 'post'
  })
}

/**
 * 保存数据字典
 */
export function saveDictGroup(data) {
  return request({
    url: System_Path + "/dictGroup/save",
    data: data,
    method: 'post'
  })
}

/**
 * 删除数据字典
 */
export function deleteDictGroup(id) {
  return request({
    url: System_Path + "/dictGroup/deleteById",
    params: {id: id},
    method: 'post'
  })
}

/**
 * 批量删除数据字典
 */
export function deleteDictGroupBatch(ids) {
  return request({
    url: System_Path + "/dictGroup/deleteByIds",
    data: ids,
    method: 'post'
  })
}