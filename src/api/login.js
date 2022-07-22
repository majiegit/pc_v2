import request from '@/utils/request'
import { Auth_Path,System_Path } from '@/utils/modulePath'

export function login(parameter) {
  return request({
    url: Auth_Path + "/auth/login",
    method: 'post',
    params: parameter
  })
}


export function getInfo() {
  return request({
    url: System_Path + '/user/userPermissionInfoByToken',
    method: 'post'
  })
}


export function logout() {
  return request({
    url: Auth_Path + "/auth/logout",
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}