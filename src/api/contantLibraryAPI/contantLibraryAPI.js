import request from '@/utils/request'
import { getToken } from '@/utils/auth'

// apd --> http://192.168.16.170:8080/ott-manage/rest/swagger.json

export function GET_STORES(storeName) {
  return request({
    url: process.env.BASE_API + '/ott/store?storeName=' + storeName,
    method: 'get'
  })
}
export function GET_CONTANT_APP() {
  return request({
    url: process.env.BASE_API + '/content/app',
    method: 'get',
    headers: {
      'token': getToken()
    }
  })
}
export function CONTENT_CREATE(data) {
  return request({
    url: process.env.BASE_API + '/content/create',
    method: 'post',
    data,
    headers: {
      'token': getToken()
    }
  })
}
export function CONTENT_UPDATE(data) {
  return request({
    url: process.env.BASE_API + '/content/update',
    method: 'post',
    data,
    headers: {
      'token': getToken()
    }
  })
}

export function CONTANT_GET(id) {
  return request({
    url: process.env.BASE_API + '/content/get?contentId='+id,
    method: 'get',
    headers: {
      'token': getToken()
    }
  })
}
export function GET_DEVICE_LIST(data, pageIndex = 0, pageSize = 20, roomNoSortType) {
  const params = {}
  if (roomNoSortType === 'ascending') {
    params.roomNoSortType = 0
  }
  if (roomNoSortType === 'descending') {
    params.roomNoSortType = 1
  }
  params.pageIndex = pageIndex
  params.pageSize = pageSize
  return request({
    url: process.env.BASE_API + '/ott/device/list',
    method: 'post',
    params,
    data,
    headers: {
      'Content-Type': 'application/json',
      'token': getToken()
    }
  })
}

export function GET_CONTANT_FIND(params,data) {
  for(let i in data){
    if(!data[i]){
      delete data[i];
      continue;
    }
    if(data[i].length == 0){    
      delete data[i];
    }
  }
  if(params.pageIndex){
    params.pageIndex = params.pageIndex-1
  }
  return request({
    url: process.env.BASE_API + '/content/find',
    method: 'post',
    params,
    data,
    headers: {
      'token': getToken()
    }
  })
}

export function CHANGE_DEVICE_STATUS(data, params) {
  return request({
    url: process.env.BASE_API + '/ott/device/status',
    method: 'put',
    data,
    params,
    headers: {
      'token': getToken()
    }
  })
}

export function UPDATE_INFO(data) {
  return request({
    url: process.env.BASE_API + '/ott/device/update',
    method: 'post',
    data,
    headers: {
      'token': getToken()
    }
  })
}

export function STORE_DEVICE_DETAIL(storeId) {
  return request({
    url: process.env.GAIA_API + '/store/' + storeId,
    method: 'get',
    headers: {
      'EVA-ACCESS-TOKEN': getToken()
    }
  })
}

export function STORE_DEVICES(params) {
  return request({
    url: process.env.BASE_API + '/ott/store/devices',
    method: 'get',
    params
  })
}

export function DEVICE_DETAIL(params) {
  return request({
    url: process.env.BASE_API + '/ott/device/detail',
    method: 'get',
    params
  })
}

export function REGISTER_CHECK(uuid) {
  return request({
    url: process.env.BASE_API + '/ott/device/register/check',
    method: 'get',
    params: {
      token: getToken(),
      uuid
    }
  })
}

export function REGISTER_DEVICE(data) {
  return request({
    url: process.env.BASE_API + '/ott/device/register/' + getToken(),
    method: 'post',
    data
  })
}

export function GET_MODEL_LIST(brandCode) {
  return request({
    url: process.env.BASE_API + '/ott/device/model/' + brandCode,
    method: 'get'
  })
}
