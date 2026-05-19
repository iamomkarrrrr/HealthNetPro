import axiosClient from './axiosClient'

export const getVaccinationPrograms = () =>
  axiosClient.get('/api/v1/vaccination-programs')

export const getVaccinationProgramById = (id) =>
  axiosClient.get(`/api/v1/vaccination-programs/${id}`)

export const createVaccinationProgram = (data) =>
  axiosClient.post('/api/v1/vaccination-programs', data)

export const updateVaccinationProgram = (id, data) =>
  axiosClient.put(`/api/v1/vaccination-programs/${id}`, data)
