import request from '@/utils/request'
import {Admin_Path} from '@/utils/modulePath'

/**
 * 登录
 * @param parameter
 */
export function login(parameter) {
  return request({
    url: Admin_Path + "/auth/login",
    method: 'post',
    params: parameter
  })
}

/**
 * 查询用户信息
 */
export function getInfo() {
  return request({
    url: Admin_Path + '/user/userPermissionMenuByToken',
    method: 'post'
  })
}

/**
 * 退出
 */
export function logout() {
  return request({
    url: Admin_Path + "/auth/logout",
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 获取图文验证码
 */
export function getVerificationCode() {
  return request({
    url: Admin_Path + "/auth/getVerificationCode",
    method: 'post'
  })
}

/**
 * 获取手机验证码
 * @param phone
 */
export function getPhoneVerificationCode(phone) {
  return request({
    url: Admin_Path + "/auth/getPhoneVerificationCode",
    method: 'post',
    params: {phone: phone}
  })
}

/**
 * 注册
 * @param data
 */
export function saveRegister(data) {
  return request({
    url: Admin_Path + "/auth/register",
    method: 'post',
    data: data
  })
}