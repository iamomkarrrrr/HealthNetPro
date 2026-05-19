import axios from 'axios'
import { API_BASE_URL } from '../utils/constants'
import { getToken, removeAuthData } from '../utils/tokenStorage'

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

axiosClient.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      removeAuthData()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default axiosClient
