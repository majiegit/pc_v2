import storage from 'store'
import {login, getInfo, logout} from '@/api/login'
import {HRSH_PC_ACCESS_TOKEN, HRSH_PC_REFRESH_TOKEN, HRSH_PC_USERINFO, TOKEN_TIME_EXP} from '@/store/mutation-types'
import {welcome} from '@/utils/util'

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
    SET_NAME: (state, {name, welcome}) => {
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
    Login({commit}, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo).then(response => {
          const result = response.data
          console.log(result)
          // if(response.code == 200){
          storage.set(HRSH_PC_ACCESS_TOKEN, result.accessToken, TOKEN_TIME_EXP)
          storage.set(HRSH_PC_REFRESH_TOKEN, result.refreshToken, TOKEN_TIME_EXP)
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
    GetInfo({commit}) {
      return new Promise((resolve, reject) => {
        getInfo().then(response => {
          const result = response.data
          if (result) {
            commit('SET_ROLES', [])
            commit('SET_INFO', result)
          } else {
            reject(new Error('getInfo: roles must be a non-null array !'))
          }
          commit('SET_NAME', {name: result.name, welcome: welcome()})
          commit('SET_AVATAR', result.photo)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    Logout({commit, state}) {
      return new Promise((resolve) => {
        commit('SET_TOKEN', '', '')
        commit('SET_ROLES', [])
        commit('SET_INFO', {})
        storage.remove(HRSH_PC_ACCESS_TOKEN)
        storage.remove(HRSH_PC_REFRESH_TOKEN)
        storage.remove(HRSH_PC_USERINFO)
        resolve()
      })
    }

  }
}

export default user
