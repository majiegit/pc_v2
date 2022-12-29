import request from '@/utils/request'


/**
 * 查询用户模板数据
 * @param parameter
 */
export function queryPsndocTemp(params) {
  return request({
    url: "/hrsh/psndoc/queryPsnInfoTemp",
    method: 'post',
    params: params
  })
}

/**
 * 查询用户个人信息
 * @param parameter
 */
export function getSubInfoVO(params) {
  return request({
    url: "/hrsh/psndoc/getSubInfoVO",
    method: 'post',
    params: params
  })
}

/**
 * 查询用户个人信息参照数数据
 * @param parameter
 */
export function queryReferencePsn(data) {
  return request({
    url: "/hrsh/psndoc/queryReferencePsn",
    method: 'post',
    data: data
  })
}

/**
 * 提交个人信息修改数据
 * @param parameter
 */
export function saveSubInfo(data) {
  return request({
    url: "/hrsh/psndoc/saveSubInfo",
    method: 'post',
    data: data
  })
}

/**
 * 撤回个人信息修改数据
 * @param parameter
 */
export function revokeLisn(params) {
  return request({
    url: "/hrsh/psndoc/revokeLisn",
    method: 'post',
    params: params
  })
}
