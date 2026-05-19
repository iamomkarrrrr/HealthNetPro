import axiosClient from './axiosClient'

export const createAudit = (data) =>
  axiosClient.post('/api/v1/audits', data)

export const getAuditsByOfficerId = (officerId) =>
  axiosClient.get(`/api/v1/audits/officer/${officerId}`)

export const getAuditsByStatus = (status) =>
  axiosClient.get(`/api/v1/audits/status/${status}`)

export const updateAudit = (id, data) =>
  axiosClient.put(`/api/v1/audits/${id}`, data)
