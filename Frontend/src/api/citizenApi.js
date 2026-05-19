import axiosClient from './axiosClient'

// Citizen self-service (CITIZEN role — uses JWT)
export const getMyCitizen = () =>
  axiosClient.get('/api/v1/citizens/me')

export const createMyCitizen = (data) =>
  axiosClient.post('/api/v1/citizens/profile', data)

export const updateMyCitizen = (data) =>
  axiosClient.put('/api/v1/citizens/me', data)

// Staff access (DOCTOR, ADMIN, etc.)
export const getAllCitizens = () =>
  axiosClient.get('/api/v1/citizens')

export const getCitizenById = (id) =>
  axiosClient.get(`/api/v1/citizens/${id}`)

export const updateCitizen = (id, data) =>
  axiosClient.put(`/api/v1/citizens/${id}`, data)
