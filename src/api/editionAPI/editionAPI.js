import request from '@/utils/request'
import { getToken } from '@/utils/auth'

export function TEMPLATE_ADD(data) {
  return request({
    url: process.env.BASE_API + '/template/add',
    method: 'post',
    data,
    headers: {
      'token': getToken()
    }
  })
}

export function TEMPLATE_UPDATE(data) {
  return request({
    url: process.env.BASE_API + '/template/edit',
    method: 'post',
    data,
    headers: {
      'token': getToken()
    }
  })
}

export function TEMPLATE_DETAIL(id) {
  return request({
    url: process.env.BASE_API + '/template/detail?template_id=' + id,
    method: 'get',
    headers: {
      'token': getToken()
    }
  })
}

export function EDITION_FIND(params) {
  return request({
    url: process.env.BASE_API + '/edition/list-page',
    method: 'get',
    params,
    headers: {
      'token': getToken()
    }
  })
}

export function TEMPLATE_DEL(id) {
  return request({
    url: process.env.BASE_API + '/template/del/' + id + '/?template_id=' + id,
    method: 'DELETE',
    headers: {
      'token': getToken()
    }
  })
}
