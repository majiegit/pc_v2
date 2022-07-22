import request from '@/utils/request'
import {System_Path} from '@/utils/modulePath'

/**
 * 查询模板
 */
export function queryTempList() {
  return request({
    url: System_Path + "/temp/list",
    method: 'post',
  })
}

/**
 * 保存模板
 */
export function saveTemp(data) {
  return request({
    url: System_Path + "/temp/save",
    data: data,
    method: 'post',
  })
}

/**
 * 删除模板
 */
export function deleteTempById(id) {
  return request({
    url: System_Path + "/temp/deleteById",
    params: { tempId: id },
    method: 'post',
  })
}