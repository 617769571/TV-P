import axios from 'axios'
import { Message/*, MessageBox*/ } from 'element-ui'
import store from '../store'
// import { getToken } from '@/utils/auth'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 5000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(
  config => {
    return config
  },
  error => {
    // Do something with request error
    Promise.reject(error)
  }
)

// respone拦截器
service.interceptors.response.use(
  response => {
    /**
     * code为非200是抛错 可结合自己业务进行修改
     */
    const res = response.data
    if (response.status !== 200) {
      Message({
        message: res.message,
        type: 'error',
        duration: 5 * 1000
      })

      if (response.status === 403 || response.status === 204) {
        store.dispatch('FedLogOut').then(() => {
          location.reload() // 为了重新实例化vue-router对象 避免bug
        })
      }
      return Promise.reject('error')
    } else {
      return response.data
    }
  },
  error => {
    const { response } = error
    const data = response.data
    let message = data.message
    const errorCode = data.errorCode
    message = message && message.match(/[\u4e00-\u95fa]+/)
    switch (errorCode) {
      case 'VERIFY_CODE_EXPIRE':
        Message({ message: '刷新验证码', type: 'error' })
        break
      case 'VERIFY_CODE_ERROR':
        Message({ message: '验证码错误', type: 'error' })
        break
      case 'WRONG_PASSWORD':
        Message({ message: '密码错误', type: 'error' })
        break
      case 'TOKEN_CANCELED_BY_OTHERS':
        Message({ message: '账号已登陆', type: 'error' })
        if (response.status === 403) {
          store.dispatch('FedLogOut').then(() => {
            location.reload()
          })
        }
        break
      // default:
      //   Message({
      //     message: message[0] || error.message,
      //     type: 'error',
      //     duration: 5 * 1000
      //   })
      //   break
    }
    if (response.status === 410) {
      store.dispatch('FedLogOut').then(() => {
        location.reload()
      })
    }
    return Promise.reject(error)
  }
)

export default service
