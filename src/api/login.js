import request from '@/utils/request'
/**
 * 登录
 * @param parameter
 */
export function login(parameter) {
  return request({
    url: '/hrsh/login/loginByUserCodePassword',
    method: 'post',
    params: parameter
  })
}

/**
 * 查询用户信息
 */
export function getInfo() {
  return request({
    url: '/hrsh/psndoc/getPsndocInfo',
    method: 'post'
  })
}

/**
 * 退出
 */
export function logout() {
  return request({
    url: "/hrsh/auth/logout",
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
    url: "/hrsh/auth/getVerificationCode",
    method: 'post'
  })
}

/**
 * 获取手机验证码
 * @param phone
 */
export function getPhoneVerificationCode(phone) {
  return request({
    url: "/hrsh/auth/getPhoneVerificationCode",
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
    url: "/hrsh/auth/register",
    method: 'post',
    data: data
  })
}