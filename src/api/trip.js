import request from '@/utils/request'

/**
 * 查询出差单据
 * @param parameter
 */
export function getTripBill(params) {
  return request({
    url: "/hrsh/trip/get",
    method: 'post',
    data: params
  })
}


/**
 * 保存出差单据
 * @param parameter
 */
export function saveTripBill(params) {
  return request({
    url: "/hrsh/trip/save",
    method: 'post',
    data: params
  })
}

/**
 * 删除出差单据
 * @param parameter
 */
export function deleteTripBill(params) {
  return request({
    url: "/hrsh/trip/delete",
    method: 'post',
    data: params
  })
}

/**
 * 提交出差单据
 * @param parameter
 */
export function submitTripBill(params) {
  return request({
    url: "/hrsh/trip/submit",
    method: 'post',
    data: params
  })
}

/**
 * 收回出差单据
 * @param parameter
 */
export function recoverTripBill(params) {
  return request({
    url: "/hrsh/trip/recover",
    method: 'post',
    data: params
  })
}

/**
 * 批准出差单据
 * @param parameter
 */
export function approveTripBill(params) {
  return request({
    url: "/hrsh/trip/approve",
    method: 'post',
    data: params
  })
}

/**
 * 驳回出差单据
 * @param parameter
 */
export function rejectTripBill(params) {
  return request({
    url: "/hrsh/trip/reject",
    method: 'post',
    data: params
  })
}

/**
 * 查询出差类型
 * @param parameter
 */
export function queryTripType(params) {
  return request({
    url: "/hrsh/trip/queryTripType",
    method: 'post',
    data: params
  })
}

/**
 * 计算出差时长
 * @param parameter
 */
export function queryTripLength(params) {
  return request({
    url: "/hrsh/trip/queryLength",
    method: 'post',
    data: params
  })
}
