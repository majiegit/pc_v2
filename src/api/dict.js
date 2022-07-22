import request from '@/utils/request'
import {System_Path} from '@/utils/modulePath'

/**
 * 查询数据字典
 */
export function queryDictList() {
  return request({
    url: System_Path + "/dict/list",
    method: 'post',
  })
}

/**
 * 保存数据字典
 */
export function saveDict(data) {
  return request({
    url: System_Path + "/user/role/save",
    data: data,
    method: 'post',
  })
}

/**
 * 删除数据字典
 */
export function deleteDict(id) {
  return request({
    url: System_Path + "/user/role/deleteById",
    params: { roleId: id },
    method: 'post',
  })
}