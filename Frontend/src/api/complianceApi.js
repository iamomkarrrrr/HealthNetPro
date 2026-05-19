import axiosClient from './axiosClient'

export const createComplianceRecord = (data) =>
  axiosClient.post('/api/v1/compliance-records', data)

export const getComplianceRecordsByType = (type) =>
  axiosClient.get(`/api/v1/compliance-records/type/${type}`)

export const getComplianceRecordsByEntityId = (entityId) =>
  axiosClient.get(`/api/v1/compliance-records/entity/${entityId}`)

export const updateComplianceRecord = (id, data) =>
  axiosClient.put(`/api/v1/compliance-records/${id}`, data)
