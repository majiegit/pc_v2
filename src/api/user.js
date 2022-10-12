import request from '@/utils/request'
import {Admin_Path} from '@/utils/modulePath'

const userApi = {
  UserListPage: Admin_Path + '/user/page',
  UserFieldList: Admin_Path + '/user/getUserFieldList',
  AddUser: Admin_Path + '/user/add',
  UpdateUser: Admin_Path + '/user/update',
  GetUser: Admin_Path + '/user/get',
  UploadAvatar: Admin_Path + '/user/upload/avatar',
  UpdatePassword: Admin_Path + '/user/update/password'
}

/**
 * 查询用户分页-列表
 */
export function queryUserListPage(param) {
  return request({
    url: userApi.UserListPage,
    method: 'post',
    params: param
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

/**
 * 添加用户
 */
export function addUserData(param) {
  return request({
    url: userApi.AddUser,
    method: 'post',
    data: param
  })
}

/**
 * 修改用户
 */
export function updateUserData(param) {
  return request({
    url: userApi.UpdateUser,
    method: 'post',
    data: param
  })
}

/**
 * 查询用户 - 根据用户ID
 */
export function getUserById(userId) {
  return request({
    url: userApi.GetUser,
    method: 'post',
    params: {userId: userId}
  })
}


/**
 * 修改头像 - 根据用户ID
 */
export function uploadAvatar(data) {
  return request({
    url: userApi.UploadAvatar,
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: data
  })
}

/**
 * 修改密码 - 根据用户ID
 */
export function updatePassword(data) {
  return request({
    url: userApi.UpdatePassword,
    method: 'post',
    data: data
  })
}