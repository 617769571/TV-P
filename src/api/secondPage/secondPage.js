import request from '@/utils/request'
import { getToken } from '@/utils/auth'


export function SECONDPAGE_CREATE(data) {
  return request({
    url: process.env.BASE_API + '/secondPage/create',
    method: 'post',
    data,
    headers: {
      'token': getToken()
    }
  })
}
export function SECONDPAGE_UPDATE(data) {
  return request({
    url: process.env.BASE_API + '/secondPage/update',
    method: 'post',
    data,
    headers: {
      'token': getToken()
    }
  })
}

export function SECONDPAGE_GET(id) {
  return request({
    url: process.env.BASE_API + '/secondPage/get?secondPageId='+id,
    method: 'get',
    headers: {
      'token': getToken()
    }
  })
}


export function SECONDPAGE_FIND(params) {
  // 
  return request({
    url: process.env.BASE_API + '/secondPage/find',
    method: 'get',
    params,
    headers: {
      'token': getToken()
    }
  })
}

