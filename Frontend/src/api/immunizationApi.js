import axiosClient from './axiosClient'

export const getImmunizationsByCitizenId = (citizenId) =>
  axiosClient.get(`/api/v1/immunizations/citizen/${citizenId}`)

export const createImmunization = (data) =>
  axiosClient.post('/api/v1/immunizations', data)

export const updateImmunization = (id, data) =>
  axiosClient.put(`/api/v1/immunizations/${id}`, data)
