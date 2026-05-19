import axiosClient from './axiosClient'

export const getCaseUpdatesByCaseId = (caseId) =>
  axiosClient.get(`/api/v1/case-updates/case/${caseId}`)

export const createCaseUpdate = (data) =>
  axiosClient.post('/api/v1/case-updates', data)

export const updateCaseUpdate = (id, data) =>
  axiosClient.put(`/api/v1/case-updates/${id}`, data)
