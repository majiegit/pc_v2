import request from '@/utils/request'

/**
 * 查询请假单据
 * @param parameter
 */
export function getLeaveBill(params) {
  return request({
    url: "/hrsh/leave/get",
    method: 'post',
    data: params
  })
}


/**
 * 保存请假单据
 * @param parameter
 */
export function saveLeaveBill(params) {
  return request({
    url: "/hrsh/leave/save",
    method: 'post',
    data: params
  })
}

/**
 * 删除请假单据
 * @param parameter
 */
export function deleteLeaveBill(params) {
  return request({
    url: "/hrsh/leave/delete",
    method: 'post',
    data: params
  })
}

/**
 * 提交请假单据
 * @param parameter
 */
export function submitLeaveBill(params) {
  return request({
    url: "/hrsh/leave/submit",
    method: 'post',
    data: params
  })
}

/**
 * 收回请假单据
 * @param parameter
 */
export function recoverLeaveBill(params) {
  return request({
    url: "/hrsh/leave/recover",
    method: 'post',
    data: params
  })
}

/**
 * 批准请假单据
 * @param parameter
 */
export function approveLeaveBill(params) {
  return request({
    url: "/hrsh/leave/approve",
    method: 'post',
    data: params
  })
}

/**
 * 驳回请假单据
 * @param parameter
 */
export function rejectLeaveBill(params) {
  return request({
    url: "/hrsh/leave/reject",
    method: 'post',
    data: params
  })
}

/**
 * 查询请假类型
 * @param parameter
 */
export function queryLeaveType(params) {
  return request({
    url: "/hrsh/leave/queryLeaveType",
    method: 'post',
    data: params
  })
}

/**
 * 计算请假时长
 * @param parameter
 */
export function queryLeaveLength(params) {
  return request({
    url: "/hrsh/leave/queryLength",
    method: 'post',
    data: params
  })
}
