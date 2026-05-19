import axiosClient from './axiosClient'

export const getAllDiseaseCases = () =>
  axiosClient.get('/api/v1/disease-cases')

export const getDiseaseCaseById = (id) =>
  axiosClient.get(`/api/v1/disease-cases/${id}`)

export const createDiseaseCase = (data) =>
  axiosClient.post('/api/v1/disease-cases', data)

export const updateDiseaseCase = (id, data) =>
  axiosClient.put(`/api/v1/disease-cases/${id}`, data)
