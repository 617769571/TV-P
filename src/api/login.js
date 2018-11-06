import request from '@/utils/request'
import { getToken } from '@/utils/auth'

export function login(account, password, codeId, verifyCode) {
  return request({
    url: process.env.GAIA_API + '/user-login/login',
    method: 'post',
    data: {
      account,
      password,
      codeId,
      verifyCode
    }
  })
}

export function logout() {
  return request({
    url: process.env.GAIA_API + '/user-login/logout',
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'EVA-ACCESS-TOKEN': getToken()
    }
  })
}
