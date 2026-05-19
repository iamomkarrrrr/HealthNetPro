import axiosClient from './axiosClient'

export const getDocumentsByCitizenId = (citizenId) =>
  axiosClient.get(`/api/v1/citizen-documents/citizen/${citizenId}`)

export const createCitizenDocument = (data) =>
  axiosClient.post('/api/v1/citizen-documents', data)
