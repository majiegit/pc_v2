import request from '@/utils/request'
import {System_Path} from '@/utils/modulePath'

const userApi = {
  UserListPage: System_Path + '/user/page'
}

/**
 * 查询用户列表
 */
export function queryUserListPage(current,size) {
  return request({
    url: userApi.UserListPage,
    method: 'post',
    params: {current: current, size: size}
  })
}