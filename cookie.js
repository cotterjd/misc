import { pipe } from 'ramda'
export function getDomain(w) {
  const url = w.location.origin
  if (url.includes('localhost')) return 'localhost'

	return  pipe(
        x => x.split('.')
      , xs => xs.slice(-2)
      , xs => xs.join('.')
      , x => `.${x}`,
    )(url)
}
function makeCookieString(name, value, days) {
  let expires = ''
  if (days) {
    const date = new Date()
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000))
    expires = `; expires=${date.toGMTString()}`
  }
  // TODO: write test for this.
  return `${name}=${value}${expires};domain=${getDomain(window)}; path=/`
}
function getCookie(name) {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) {
 return (
      decodeURIComponent(
        parts
          .pop()
          .split(';')
          .shift(),
      ) || ''
    )
}
  return ''
}
function deleteCookieString(name) {
  return `${name}=;domain=${getDomain(window)}; expires=Thu, 01 Jan 1970 00:00:01 GMT;`
}

export { makeCookieString, getCookie, deleteCookieString }

