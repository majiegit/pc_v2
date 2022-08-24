import axios from 'axios'
import store from '@/store'
import storage from 'store'
import notification from 'ant-design-vue/es/notification'
import message from 'ant-design-vue/es/message'
import {VueAxios} from './axios'
import {ACCESS_TOKEN, REFRESH_TOKEN} from '@/store/mutation-types'

// 创建 axios 实例
const request = axios.create({
  // API 请求的默认前缀
  baseURL: process.env.VUE_APP_API_BASE_URL,
  timeout: 600000 // 请求超时时间
})

// 异常拦截处理器
const errorHandler = (error) => {
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
    }
  }
  return Promise.reject(error)
}


// request 拦截器
request.interceptors.request.use(config => {
  const accessToken = storage.get(ACCESS_TOKEN)
  const refreshToken = storage.get(REFRESH_TOKEN)
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

// response interceptor
request.interceptors.response.use((response) => {
  // 动态刷新 Token
  // 认证 AccessToken
  let accessToken = response.headers[ACCESS_TOKEN.toLowerCase()]
  if (accessToken) {
    storage.set(ACCESS_TOKEN, accessToken, 7 * 24 * 60 * 60 * 1000)
    store.state.accessToken = accessToken
  }
  // 刷新 RefreshToken
  let refreshToken = response.headers[REFRESH_TOKEN.toLowerCase()]
  if (refreshToken) {
    storage.set(REFRESH_TOKEN, refreshToken, 7 * 24 * 60 * 60 * 1000)
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
  } else {
    message.error(res.message)
  }
}, errorHandler)

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
