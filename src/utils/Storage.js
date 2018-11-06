class Storage {
  static clear(type) {
    if (type && type.toLowerCase() === 'local') {
      return localStorage.clear()
    } else {
      return sessionStorage.clear()
    }
  }
  static key(index, type) {
    if (type && type.toLowerCase() === 'local') {
      return localStorage.key(index)
    } else {
      return sessionStorage.key(index)
    }
  }
  static getItem(key, type) {
    if (type && type.toLowerCase() === 'local') {
      return JSON.parse(localStorage.getItem(key))
    } else {
      return JSON.parse(sessionStorage.getItem(key))
    }
  }
  static length(type) {
    if (type && type.toLowerCase() === 'local') {
      return localStorage.length
    } else {
      return sessionStorage.length
    }
  }
  static removeItem(key, type) {
    if (type && type.toLowerCase() === 'local') {
      return localStorage.removeItem(key)
    } else {
      return sessionStorage.removeItem(key)
    }
  }
  static setItem(key, value, type) {
    if (type && type.toLowerCase() === 'local') {
      localStorage.setItem(key, JSON.stringify(value))
    } else {
      sessionStorage.setItem(key, JSON.stringify(value))
    }
  }
}

export default Storage
