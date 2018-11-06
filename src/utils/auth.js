import Storage from './Storage'

const storageKey = 'Admin-Token'

export function getToken() {
  return Storage.getItem(storageKey)
}

export function setToken(token) {
  Storage.setItem(storageKey, token)
}

export function removeToken() {
  Storage.clear()
}
