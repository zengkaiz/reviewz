import Cookie from 'js-cookie'

export function getCookie(name) {
  return Cookie.get(name)
}

export function setCookie(key, value) {
  Cookie.set(key, value, 7, true)
}

export function removeCookie(key) {
  Cookie.remove(key)
}
