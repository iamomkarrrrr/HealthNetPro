import axiosClient from './axiosClient'

export const login = async (payload) => {
  const response = await axiosClient.post('/api/v1/auth/login', payload)
  return response.data
}

export const registerCitizen = async (payload) => {
  const response = await axiosClient.post('/api/v1/users/register', payload)
  return response.data
}

export const forgotPassword = async (payload) => {
  const response = await axiosClient.post('/api/v1/auth/forgot-password', payload)
  return response.data
}

export const verifyOtp = async (payload) => {
  const response = await axiosClient.post('/api/v1/auth/verify-reset-otp', payload)
  return response.data
}

export const resetPassword = async (payload) => {
  const response = await axiosClient.post('/api/v1/auth/reset-password', payload)
  return response.data
}
