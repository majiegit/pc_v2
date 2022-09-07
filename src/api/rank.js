import request from '@/utils/request'
import {System_Path} from '@/utils/modulePath'

/**
 * 查询职级字段
 */
export function queryRankFieldList(params) {
  return request({
    url: System_Path + "/rank/getRankFieldList",
    method: 'post',
    params: params
  })
}


/**
 * 查询职级列表 - 分页
 */
export function queryRankPage(params) {
  return request({
    url: System_Path + "/rank/page",
    method: 'post',
    params: params
  })
}


/**
 * 查询职级列表
 */
export function queryRankList(params) {
  return request({
    url: System_Path + "/rank/list",
    method: 'post',
    params: params
  })
}

/**
 * 保存职级
 */
export function saveRank(data) {
  return request({
    url: System_Path + "/rank/save",
    data: data,
    method: 'post'
  })
}

/**
 * 删除职级
 */
export function deleteRank(rankId) {
  return request({
    url: System_Path + "/rank/deleteById",
    params: { rankId: rankId },
    method: 'post'
  })
}

/**
 * 批量删除职级
 */
export function deleteRankBatch(ids) {
  return request({
    url: System_Path + "/rank/deleteByIds",
    data: ids,
    method: 'post'
  })
}