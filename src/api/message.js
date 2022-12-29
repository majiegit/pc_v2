import request from '@/utils/request'
/**
 * 查询工作任务消息
 * @param parameter
 */
export function queryApproveMessageList(params) {
  return request({
    url: "/hrsh/message/queryApproveMessageList",
    method: 'post',
    params: params
  })
}


/**
 * 查询通知消息
 * @param parameter
 */
export function queryNoticeMessageList(params) {
  return request({
    url: "/hrsh/message/queryNoticeMessageList",
    method: 'post',
    params: params
  })
}


/**
 * 查询未读消息数量
 * @param parameter
 */
export function queryIsReadMessageCount(params) {
  return request({
    url: "/hrsh/message/queryIsReadMessageCount",
    method: 'post',
    params: params
  })
}

/**
 * 更新消息已读未读状态
 * @param parameter
 */
export function updateNoticeMessageIsRead(params) {
  return request({
    url: "/hrsh/message/updateNoticeMessageIsRead",
    method: 'post',
    params: params
  })
}






