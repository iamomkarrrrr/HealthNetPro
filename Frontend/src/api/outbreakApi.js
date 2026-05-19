import axiosClient from './axiosClient'

export const getAllOutbreaks = () =>
  axiosClient.get('/api/v1/outbreaks')

export const getOutbreakById = (id) =>
  axiosClient.get(`/api/v1/outbreaks/${id}`)

export const createOutbreak = (data) =>
  axiosClient.post('/api/v1/outbreaks', data)

export const updateOutbreak = (id, data) =>
  axiosClient.put(`/api/v1/outbreaks/${id}`, data)

// alias used by citizen pages
export const getOutbreaks = getAllOutbreaks
