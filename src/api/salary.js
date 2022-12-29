import request from '@/utils/request'

/**
 * 查询我的薪资
 * @param parameter
 */
export function querySalaryData(params) {
  return request({
    url: "/hrsh/salary/querySalary",
    method: 'post',
    params: params
  })
}

/**
 * 薪资密码修改
 * @param parameter
 */
export function updatePwd(data) {
  return request({
    url: "/hrsh/salary/updatePwd",
    method: 'post',
    data: data
  })
}

/**
 * 薪资密码重置
 * @param parameter
 */
export function restPwd(data){
  return request({
    url: "/hrsh/salary/restPwd",
    method: 'post',
    data: data
  })
}

/**
 * 薪资密码验证
 * @param parameter
 */
export function checkPwd(data) {
  return request({
    url: "/hrsh/salary/checkPwd",
    method: 'post',
    data: data
  })
}

/**
 * 是否启用薪资密码二次验证
 * @param parameter
 */
export function enablePwd(data) {
  return request({
    url: "/hrsh/salary/enablePwd",
    method: 'post',
    data: data
  })
}
/**
 * 薪资确认
 * @param parameter
 */
export function salaryConfirmSave(data) {
  debugger
  return request({
    url: "/admin/salaryConfirm/save",
    method: 'post',
    data: data
  })
}

/**
 * 薪资确认
 * @param parameter
 */
export function salaryConfirmList(data) {
  return request({
    url: "/admin/salaryConfirm/list",
    method: 'post',
    data: data
  })
}
