import axiosClient from './axiosClient'

export const getAllUsers = () =>
  axiosClient.get('/api/v1/users')

export const getUserById = (id) =>
  axiosClient.get(`/api/v1/users/${id}`)

export const createUser = (data) =>
  axiosClient.post('/api/v1/users', data)

export const updateUser = (id, data) =>
  axiosClient.put(`/api/v1/users/${id}`, data)

export const updateUserStatus = (id, data) =>
  axiosClient.patch(`/api/v1/users/${id}/status`, data)
