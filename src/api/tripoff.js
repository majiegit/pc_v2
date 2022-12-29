import request from '@/utils/request'

/**
 * 查询销差单据
 * @param parameter
 */
export function getTripoffBill(params) {
  return request({
    url: "/hrsh/tripoff/get",
    method: 'post',
    data: params
  })
}


/**
 * 保存销差单据
 * @param parameter
 */
export function saveTripoffBill(params) {
  return request({
    url: "/hrsh/tripoff/save",
    method: 'post',
    data: params
  })
}

/**
 * 删除销差单据
 * @param parameter
 */
export function deleteTripoffBill(params) {
  return request({
    url: "/hrsh/tripoff/delete",
    method: 'post',
    data: params
  })
}

/**
 * 提交销差单据
 * @param parameter
 */
export function submitTripoffBill(params) {
  return request({
    url: "/hrsh/tripoff/submit",
    method: 'post',
    data: params
  })
}

/**
 * 收回销差单据
 * @param parameter
 */
export function recoverTripoffBill(params) {
  return request({
    url: "/hrsh/tripoff/recover",
    method: 'post',
    data: params
  })
}

/**
 * 批准销差单据
 * @param parameter
 */
export function approveTripoffBill(params) {
  return request({
    url: "/hrsh/tripoff/approve",
    method: 'post',
    data: params
  })
}

/**
 * 驳回销差单据
 * @param parameter
 */
export function rejectTripoffBill(params) {
  return request({
    url: "/hrsh/tripoff/reject",
    method: 'post',
    data: params
  })
}


/**
 * 计算销差时长
 * @param parameter
 */
export function queryTripoffLength(params) {
  return request({
    url: "/hrsh/tripoff/queryLength",
    method: 'post',
    data: params
  })
}

/**
 * 查询待销差请差记录
 * @param parameter
 */
export function queryTripIsRevoked(params) {
  return request({
    url: "/hrsh/tripoff/queryTripIsRevoked",
    method: 'post',
    data: params
  })
}
