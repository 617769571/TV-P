import request from '@/utils/request'
import { getToken } from '@/utils/auth'

export function GET_STORE_LIST(params) {
  return request({
    url: process.env.BASE_API + '/ott/store',
    method: 'get',
    params,
    headers: {
      'Content-Type': 'application/json',
      'token': getToken()
    }
  })
}

export function GET_ROOM_TYPE(params) {
  return request({
    url: process.env.BASE_API + '/ott/store/room-type/list',
    method: 'get',
    params,
    headers: {
      'Content-Type': 'application/json',
      'token': getToken()
    }
  })
}

export function GET_ALL_ROOM_TYPE() {
  return request({
    url: process.env.BASE_API + '/ott/store/room-type/all',
    method: 'get'
  })
}
