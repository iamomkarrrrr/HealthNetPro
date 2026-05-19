import { useState, useEffect, useCallback, useRef } from 'react'
import { getNotificationsByUserId, markNotificationRead } from '../api/notificationApi'
import useAuth from './useAuth'

const POLL_INTERVAL_MS = 30_000 // 30 seconds

const sortNotifications = (data) =>
  [...data].sort((a, b) => {
    if (a.status === 'UNREAD' && b.status !== 'UNREAD') return -1
    if (a.status !== 'UNREAD' && b.status === 'UNREAD') return 1
    return new Date(b.createdDate) - new Date(a.createdDate)
  })

const useNotifications = () => {
  const { user, isAuthenticated } = useAuth()
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const intervalRef = useRef(null)

  const fetchNotifications = useCallback(async () => {
    if (!user?.userId || !isAuthenticated) return
    try {
      const res = await getNotificationsByUserId(user.userId)
      const data = res.data?.data ?? []
      setNotifications(sortNotifications(data))
      setError(null)
    } catch (err) {
      // Silent on poll failures — only set error on first load
      if (!notifications.length) {
        setError(err?.response?.data?.message || 'Failed to load notifications')
      }
    }
  }, [user?.userId, isAuthenticated]) // eslint-disable-line react-hooks/exhaustive-deps

  // Initial fetch + start polling
  useEffect(() => {
    if (!user?.userId || !isAuthenticated) return

    setLoading(true)
    fetchNotifications().finally(() => setLoading(false))

    intervalRef.current = setInterval(fetchNotifications, POLL_INTERVAL_MS)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [user?.userId, isAuthenticated]) // eslint-disable-line react-hooks/exhaustive-deps

  const markAsRead = useCallback(async (id) => {
    try {
      await markNotificationRead(id)
      setNotifications(prev =>
        sortNotifications(prev.map(n => n.id === id ? { ...n, status: 'READ' } : n))
      )
    } catch {
      // silent — badge stays UNREAD
    }
  }, [])

  const markAllAsRead = useCallback(async () => {
    const unreadIds = notifications.filter(n => n.status === 'UNREAD').map(n => n.id)
    await Promise.allSettled(unreadIds.map(id => markNotificationRead(id)))
    setNotifications(prev =>
      sortNotifications(prev.map(n => ({ ...n, status: 'READ' })))
    )
  }, [notifications])

  const unreadCount = notifications.filter(n => n.status === 'UNREAD').length
  const unread      = notifications.filter(n => n.status === 'UNREAD')
  const read        = notifications.filter(n => n.status === 'READ')

  return {
    notifications,
    unread,
    read,
    unreadCount,
    loading,
    error,
    refresh: fetchNotifications,
    markAsRead,
    markAllAsRead,
  }
}

export default useNotifications
