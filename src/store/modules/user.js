import { login, logout } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { Base64 } from 'js-base64'
import Storage from '@/utils/Storage'

const user = {
  state: {
    token: getToken(),
    userInfo: Storage.getItem('userInfo') || {}
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_USER_INFO: (state, userInfo) => {
      Storage.setItem('userInfo', userInfo)
      state.userInfo = userInfo
    }
  },

  actions: {
    // 登录
    Login({ commit }, user) {
      const account = user.account.trim()
      return new Promise((resolve, reject) => {
        login(account, Base64.encode(user.password), user.codeId, user.verifyCode).then(userInfo => {
          setToken(userInfo.token)
          commit('SET_TOKEN', userInfo.token)
          commit('SET_USER_INFO', userInfo)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_USER_INFO', null)
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        commit('SET_USER_INFO', null)
        removeToken()
        resolve()
      })
    }
  }
}

export default user
