import storage from 'store'
import { login, getInfo, logout } from '@/api/login'
import { ACCESS_TOKEN,REFRESH_TOKEN,USERINFO,TOKEN_TIME_EXP } from '@/store/mutation-types'
import { welcome } from '@/utils/util'

const user = {
  state: {
    token: '',
    name: '',
    welcome: '',
    avatar: '',
    roles: [],
    info: {}
  },

  mutations: {
    SET_TOKEN: (state, accessToken, rfreshToken) => {
      state.accessToken = accessToken
      state.rfreshToken = rfreshToken
    },
    SET_NAME: (state, { name, welcome }) => {
      state.name = name
      state.welcome = welcome
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_INFO: (state, info) => {
      state.info = info
    }
  },

  actions: {
    // 登录
    Login ({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo).then(response => {
          const result = response.data
          console.log(result)
          // if(response.code == 200){
            storage.set(ACCESS_TOKEN, result.accessToken, TOKEN_TIME_EXP)
            storage.set(REFRESH_TOKEN, result.refreshToken, TOKEN_TIME_EXP)
            commit('SET_TOKEN', result.accessToken, result.refreshToken)
            resolve()
          // }else {
          //   reject(response)
          // }
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo ({ commit }) {
      return new Promise((resolve, reject) => {
        getInfo().then(response => {
          // console.log(2222,response)
          const result = response.data
          if(result){
            commit('SET_ROLES', result.roles)
            commit('SET_INFO', result.userInfo)
          }else {
            reject(new Error('getInfo: roles must be a non-null array !'))
          }
          commit('SET_NAME', { name: result.userInfo.realname, welcome: welcome() })
          commit('SET_AVATAR', result.userInfo.avatar)

          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    Logout ({ commit, state }) {
      return new Promise((resolve) => {
        logout(state.accessToken).then(() => {
          commit('SET_TOKEN', '', '')
          commit('SET_ROLES', [])
          commit('SET_INFO', {})
          storage.remove(ACCESS_TOKEN)
          storage.remove(REFRESH_TOKEN)
          storage.remove(USERINFO)
          resolve()
        }).catch(() => {
          resolve()
        }).finally(() => {
        })
      })
    }

  }
}

export default user
