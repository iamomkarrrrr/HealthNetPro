import axiosClient from './axiosClient'

export const getNotificationsByUserId = (userId) =>
  axiosClient.get(`/api/v1/notifications/user/${userId}`)

export const markNotificationRead = (id) =>
  axiosClient.patch(`/api/v1/notifications/${id}/status`, { status: 'READ' })
