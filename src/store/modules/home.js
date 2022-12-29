import storage from 'store'
import {getStaffRoleMenu} from '@/api/home'
import {HRSH_PC_ACCESS_TOKEN, HRSH_PC_REFRESH_TOKEN, HRSH_PC_USERINFO, TOKEN_TIME_EXP} from '@/store/mutation-types'
import {welcome} from '@/utils/util'

const home = {
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
    //菜单
    GetStaffRoleMenu({commit}) {
      debugger
      return new Promise((resolve, reject) => {
        getStaffRoleMenu().then(response => {
          const result = response.data
          if (result) {
            // commit('SET_ROLES', [])
            // commit('SET_INFO', result)
          } else {
            reject(new Error('getInfo: roles must be a non-null array !'))
          }
          // commit('SET_NAME', {name: result.name, welcome: welcome()})
          // commit('SET_AVATAR', result.photo)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    

  }
}

export default home
