import request from '@/utils/request'

/**
 * 查询销假单据
 * @param parameter
 */
export function getLeaveoffBill(params) {
  return request({
    url: "/hrsh/leaveoff/get",
    method: 'post',
    data: params
  })
}


/**
 * 保存销假单据
 * @param parameter
 */
export function saveLeaveoffBill(params) {
  return request({
    url: "/hrsh/leaveoff/save",
    method: 'post',
    data: params
  })
}

/**
 * 删除销假单据
 * @param parameter
 */
export function deleteLeaveoffBill(params) {
  return request({
    url: "/hrsh/leaveoff/delete",
    method: 'post',
    data: params
  })
}

/**
 * 提交销假单据
 * @param parameter
 */
export function submitLeaveoffBill(params) {
  return request({
    url: "/hrsh/leaveoff/submit",
    method: 'post',
    data: params
  })
}

/**
 * 收回销假单据
 * @param parameter
 */
export function recoverLeaveoffBill(params) {
  return request({
    url: "/hrsh/leaveoff/recover",
    method: 'post',
    data: params
  })
}

/**
 * 批准销假单据
 * @param parameter
 */
export function approveLeaveoffBill(params) {
  return request({
    url: "/hrsh/leaveoff/approve",
    method: 'post',
    data: params
  })
}

/**
 * 驳回销假单据
 * @param parameter
 */
export function rejectLeaveoffBill(params) {
  return request({
    url: "/hrsh/leaveoff/reject",
    method: 'post',
    data: params
  })
}

/**
 * 计算销假时长
 * @param parameter
 */
export function queryLeaveoffLength(params) {
  return request({
    url: "/hrsh/leaveoff/queryLength",
    method: 'post',
    data: params
  })
}

/**
 * 查询待销假请假记录
 * @param parameter
 */
export function queryLeaveIsRevoked(params) {
  return request({
    url: "/hrsh/leaveoff/queryLeaveIsRevoked",
    method: 'post',
    data: params
  })
}
