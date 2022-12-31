import request from '@/utils/request'
/**
 * 导航栏
 * @param parameter
 */
export function getStaffRoleMenu(data) {
  return request({
    url: '/hrsh/home/getStaffRoleMenu',
    method: 'post',
    params: data
  })
};
// //消息列表
// export function getMessageList(data) {
//   return request({
//     url: '/hrsh/message/queryNoticeMessageList',
//     method: 'post',
//     params: data
//   })
// }
//消息未读数量
export function getMessageCount(data) {
  return request({
    url: '/hrsh/message/queryIsReadMessageCount',
    method: 'post',
    params: data
  })
}
/**
 * 查询用户基本信息
 * @param parameter
 */
export function queryPsndocInfo(params) {
  return request({
    url: "/hrsh/psndoc/getPsndocInfo",
    method: 'post',
    params: params
  })
}





