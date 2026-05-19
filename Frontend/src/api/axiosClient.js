import axios from 'axios'
import { API_BASE_URL } from '../utils/constants'
import { getToken, removeAuthData } from '../utils/tokenStorage'

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  // Do not set a fixed Content-Type globally. Let axios/browser determine it
  // per-request (important for FormData multipart uploads).
  timeout: 15000, // 15 seconds timeout to avoid indefinite hanging requests
})

axiosClient.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    // If sending FormData, remove any forced Content-Type so browser can add boundary
    if (config.data && typeof FormData !== 'undefined' && config.data instanceof FormData && config.headers) {
      delete config.headers['Content-Type']
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
