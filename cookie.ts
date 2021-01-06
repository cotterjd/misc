import { pipe } from 'ramda'

const getDomain = (w:Window):string => {
  const url:string = w.location.origin
  if (url.includes('localhost')) return 'localhost'

	return pipe(
    (x:string) => x.split('.'),
    (xs:string[]) => xs.slice(-2),
    (xs:string[]) => xs.join('.'),
    (x:string) => `.${x}`
  )(url)
}
const makeCookieString = (name:string, value:string, days:number):string => {
  let expires = ''
  if (days) {
    const date:Date = new Date()
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000))
    expires = `; expires=${date.toUTCString()}`
  }
  return `${name}=${value}${expires};domain=${getDomain(window)}; path=/`
}
const getCookie = (name:string):string => {
  const value = `; ${document.cookie}`
  const parts:string[] = value.split(`; ${name}=`)
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
const deleteCookieString = (name:string):string => {
  return `${name}=;domain=${getDomain(window)}; expires=Thu, 01 Jan 1970 00:00:01 GMT;`
}

export default { makeCookieString, getCookie, deleteCookieString }
