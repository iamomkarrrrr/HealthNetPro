import axiosClient from './axiosClient'

export const createReport = (data) =>
  axiosClient.post('/api/v1/reports', data)

export const getReportsByScope = (scope) =>
  axiosClient.get(`/api/v1/reports/scope/${scope}`)

export const getReportsByGeneratedDate = (generatedDate) =>
  axiosClient.get(`/api/v1/reports/date/${generatedDate}`)

// Note: PUT /api/v1/reports/{id} is ADMIN only — kept for completeness
export const updateReport = (id, data) =>
  axiosClient.put(`/api/v1/reports/${id}`, data)
