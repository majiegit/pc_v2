import request from '@/utils/request'

/**
 * 查询我的申请数据
 * @param parameter
 */
export function getMyApplication(params) {
  return request({
    url: "/hrsh/myapply/getMyApplication",
    method: 'post',
    params: params
  })
}

/**
 * 查询我的单据
 * @param parameter
 */
export function getBillInfo(params) {
  return request({
    url: "/hrsh/myapply/getBillInfo",
    method: 'post',
    params: params
  })
}

/**
 * 删除我的单据
 * @param parameter
 */
export function deleteBill(params) {
  return request({
    url: "/hrsh/myapply/deleteBill",
    method: 'post',
    params: params
  })
}
