import request from '@/utils/request'
import {System_Path} from '@/utils/modulePath'

const userApi = {
  UserListPage: System_Path + '/user/page',
  UserFieldList: System_Path + '/user/getUserFieldList'
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
/**
 * 查询用户字段实体数据
 */
export function queryUserFieldList(param) {
  return request({
    url: userApi.UserFieldList,
    method: 'post',
    data: param
  })
}

