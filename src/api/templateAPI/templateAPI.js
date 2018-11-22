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
    url: process.env.BASE_API + '/template/detail?template_id='+id,
    method: 'get',
    headers: {
      'token': getToken()
    }
  })
}


export function TEMPLATE_FIND(params) {
  return request({
    url: process.env.BASE_API + '/template/list-page',
    method: 'get',
    params,
    headers: {
      'token': getToken()
    }
  })
}
export function TEMPLATE_DEL(id) {
  return request({
    url: process.env.BASE_API + '/template/del/'+id+'/?template_id='+id,
    method: 'DELETE',
    headers: {
      'token': getToken()
    }
  })
}

export function OTT_DEVICE_LIST(params,data) {
  for(let i in data){
    if(!data[i]){
      delete data[i];
    }
  }
  if(params.pageIndex){
    params.pageIndex = params.pageIndex-1
  }
  return request({
    url: process.env.BASE_API + '/ott/device/list',
    method: 'post',
    params,
    data,
    headers: {
      'token': getToken()
    }
  })
}
export function region_province() {
  return request({
    url: process.env.BASE_API + '/region/province',
    method: 'get',
    headers: {
      'token': getToken()
    }
  })
}
export function region_city(params) {
  return request({
    url: process.env.BASE_API + '/region/city',
    method: 'get',
    params,
    headers: {
      'token': getToken()
    }
  })
}
export function get_store_org() {
  return request({
    url: process.env.BASE_API + '/ott/store/org',
    method: 'get',
    headers: {
      'token': getToken()
    }
  })
}
export function get_store_brand(params) {
  return request({
    url: process.env.BASE_API + '/ott/store/brand',
    method: 'get',
    params,
    headers: {
      'token': getToken()
    }
  })
}
export function get_device_brand() {
  return request({
    url: process.env.BASE_API + '/ott/device/brand',
    method: 'get',
    headers: {
      'token': getToken()
    }
  })
}
export function get_store(params) {
  return request({
    url: process.env.BASE_API + '/ott/store',
    method: 'get',
    params,
    headers: {
      'token': getToken()
    }
  })
}
export function get_device_model(brandCode) {
  return request({
    url: process.env.BASE_API + `/ott/device/model/${brandCode}?brandCode=${brandCode}`,
    method: 'get',
    headers: {
      'token': getToken()
    }
  })
}
export function edition_check_join_device(data) {
  return request({
    url: process.env.BASE_API + '/edition/check-join-device',
    method: 'post',
    data,
    headers: {
      'token': getToken()
    }
  })
}
export function template_publish(data) {
  return request({
    url: process.env.BASE_API + '/template/publish',
    method: 'post',
    data,
    headers: {
      'token': getToken()
    }
  })
}

