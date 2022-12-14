import axios from 'axios'
import store from '@/store'
import storage from 'store'
import notification from 'ant-design-vue/es/notification'
import message from 'ant-design-vue/es/message'
import {VueAxios} from './axios'
import {ACCESS_TOKEN, REFRESH_TOKEN, HRSH_PC_ACCESS_TOKEN,HRSH_PC_REFRESH_TOKEN,TOKEN_TIME_EXP} from '@/store/mutation-types'

// 创建 axios 实例
const request = axios.create({
  // API 请求的默认前缀
  baseURL: process.env.VUE_APP_API_BASE_URL,
  timeout: 600000 // 请求超时时间
})


// request 拦截器
request.interceptors.request.use(config => {
  const accessToken = storage.get(HRSH_PC_ACCESS_TOKEN)
  const refreshToken = storage.get(HRSH_PC_REFRESH_TOKEN)
  // 如果 token 存在
  // 让每个请求携带自定义 token 请根据实际情况自行修改
  if (accessToken) {
    config.headers[ACCESS_TOKEN] = accessToken
  }
  if (refreshToken) {
    config.headers[REFRESH_TOKEN] = refreshToken
  }
  return config
})

// response 拦截器
request.interceptors.response.use(
  response => {
    // 动态刷新 Token
    // 认证 AccessToken
    let accessToken = response.headers[ACCESS_TOKEN.toLowerCase()]
    if (accessToken) {
      storage.set(HRSH_PC_ACCESS_TOKEN, accessToken, TOKEN_TIME_EXP)
      store.state.accessToken = accessToken
    }
    // 刷新 RefreshToken
    let refreshToken = response.headers[REFRESH_TOKEN.toLowerCase()]
    if (refreshToken) {
      storage.set(HRSH_PC_REFRESH_TOKEN, refreshToken, TOKEN_TIME_EXP)
      store.state.refreshToken = refreshToken
    }

    // 响应数据处理
    let res = response.data
    // 请求数据成功, 直接 return
    // console.log(response)
    if (res.code === 200) {
      return res
    } else if (res.code === 401) {
      
      // 如果身份失效，调用注销接口
      notification.error({
        message: '身份已失效',
        description: res.message
      })
      store.dispatch('Logout').then(() => {
        setTimeout(() => {
          window.location.reload()
        }, 1500)
      })
      // debugger
    } else {
      message.error(res.message)  // 弹出错误消息
      // return Promise.reject(res) // 返回 直接进入catch
    }
  },
  error => {
    if (error.response) {
      const data = error.response.data
      if (error.response.status === 403) {
        notification.error({
          message: 'Forbidden',
          description: data.message
        })
      }
      if (error.response.status === 401 && !(data.result && data.result.isLogin)) {
        notification.error({
          message: 'Unauthorized',
          description: 'Authorization verification failed'
        })
      }
      if (error.response.status === 500) {
        notification.error({
          message: '网络异常',
          description: '网络异常，请检查网络'
        })
       // return
      }
      if (error.response.status === 404) {
        notification.error({
          message: '网络异常',
          description: '网络异常，请检查网络'
        })
        return
      }

      store.dispatch('Logout').then(() => {
        setTimeout(() => {
          window.location.reload()
        }, 1500)
      })
    }
    return Promise.reject(error)
  })

const installer = {
  vm: {},
  install(Vue) {
    Vue.use(VueAxios, request)
  }
}

export default request

export {
  installer as VueAxios,
  request as axios
}
