import axiosClient from './axiosClient'

export const createEpidemiologyData = (data) =>
  axiosClient.post('/api/v1/epidemiology-data', data)

export const getEpidemiologyDataByOutbreakId = (outbreakId) =>
  axiosClient.get(`/api/v1/epidemiology-data/outbreak/${outbreakId}`)

export const updateEpidemiologyData = (id, data) =>
  axiosClient.put(`/api/v1/epidemiology-data/${id}`, data)
