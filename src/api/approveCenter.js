import request from '@/utils/request'

/**
 * 查询审批中心数据
 * @param parameter
 */
export function getMyApprove(params) {
  return request({
    url: "/hrsh/approveCenter/getMyApprove",
    method: 'post',
    params: params
  })
}
