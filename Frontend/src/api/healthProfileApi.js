import axiosClient from './axiosClient'

export const getHealthProfileByCitizenId = (citizenId) =>
  axiosClient.get(`/api/v1/health-profiles/citizen/${citizenId}`)

export const createHealthProfile = (data) =>
  axiosClient.post('/api/v1/health-profiles', data)

export const updateHealthProfile = (id, data) =>
  axiosClient.put(`/api/v1/health-profiles/${id}`, data)
