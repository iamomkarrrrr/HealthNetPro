import { STORAGE_TOKEN_KEY, STORAGE_USER_KEY } from './constants'

export const saveAuthData = ({ token, user }) => {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_TOKEN_KEY, token)
  localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user))
}

export const removeAuthData = () => {
  if (typeof window === 'undefined') return
  localStorage.removeItem(STORAGE_TOKEN_KEY)
  localStorage.removeItem(STORAGE_USER_KEY)
}

export const getToken = () => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(STORAGE_TOKEN_KEY)
}

export const getUser = () => {
  if (typeof window === 'undefined') return null
  const item = localStorage.getItem(STORAGE_USER_KEY)
  try {
    return item ? JSON.parse(item) : null
  } catch (error) {
    return null
  }
}
