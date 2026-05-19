import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useNotifications from '../../hooks/useNotifications'
import useAuth from '../../hooks/useAuth'
import { getNotificationPath, getNotificationPagePath, getCategoryBadgeClass } from '../../utils/notificationNavigation'

const formatDate = (iso) => {
  if (!iso) return ''
  const d = new Date(iso)
  const now = new Date()
  const diffMs = now - d
  const diffMins = Math.floor(diffMs / 60000)
  if (diffMins < 1)  return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`
  const diffHrs = Math.floor(diffMins / 60)
  if (diffHrs < 24)  return `${diffHrs}h ago`
  return iso.slice(0, 10)
}

const NotificationDropdown = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { notifications, unreadCount, markAsRead, refresh } = useNotifications()
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleNotificationClick = async (n) => {
    if (n.status === 'UNREAD') await markAsRead(n.id)
    setOpen(false)
    navigate(getNotificationPath(n.category, user?.role))
  }

  const handleViewAll = () => {
    setOpen(false)
    navigate(getNotificationPagePath(user?.role))
  }

  // Show latest 6 — unread first (already sorted by hook)
  const preview = notifications.slice(0, 6)

  return (
    <div className="position-relative" ref={dropdownRef}>
      {/* Bell button */}
      <button
        type="button"
        className="btn btn-outline-secondary position-relative p-2"
        onClick={() => { setOpen(o => !o); if (!open) refresh() }}
        aria-label="Notifications"
        style={{ borderRadius: '50%' }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
          <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zm.995-14.901a1 1 0 1 0-1.99 0A5.002 5.002 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901z"/>
        </svg>
        {unreadCount > 0 && (
          <span
            className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
            style={{ fontSize: '0.65rem', minWidth: '18px' }}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="card shadow position-absolute end-0 mt-2"
          style={{ width: '340px', zIndex: 1050, maxHeight: '480px', display: 'flex', flexDirection: 'column' }}
        >
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center px-3 py-2 border-bottom">
            <span className="fw-semibold">Notifications</span>
            {unreadCount > 0 && (
              <span className="badge bg-danger rounded-pill">{unreadCount} unread</span>
            )}
          </div>

          {/* List */}
          <div style={{ overflowY: 'auto', flex: 1 }}>
            {preview.length === 0 ? (
              <div className="text-center text-muted small py-4">
                ✅ You're all caught up!
              </div>
            ) : (
              <ul className="list-unstyled mb-0">
                {preview.map(n => {
                  const isUnread = n.status === 'UNREAD'
                  return (
                    <li
                      key={n.id}
                      className={`px-3 py-2 border-bottom ${isUnread ? 'bg-primary bg-opacity-10' : ''}`}
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleNotificationClick(n)}
                    >
                      <div className="d-flex align-items-start gap-2">
                        {/* Unread dot */}
                        <div className="flex-shrink-0 mt-1">
                          {isUnread
                            ? <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#0d6efd', display: 'inline-block' }} />
                            : <span style={{ width: 8, height: 8, display: 'inline-block' }} />
                          }
                        </div>
                        <div className="flex-fill" style={{ minWidth: 0 }}>
                          <div className={`small ${isUnread ? 'fw-semibold' : 'text-muted'}`} style={{ lineHeight: 1.3 }}>
                            {n.message}
                          </div>
                          <div className="d-flex align-items-center gap-2 mt-1">
                            <span className={`badge ${getCategoryBadgeClass(n.category)}`} style={{ fontSize: '0.6rem' }}>
                              {n.category}
                            </span>
                            <span className="text-muted" style={{ fontSize: '0.68rem' }}>
                              {formatDate(n.createdDate)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>

          {/* Footer */}
          <div className="px-3 py-2 border-top text-center">
            <button
              type="button"
              className="btn btn-sm btn-outline-primary w-100"
              onClick={handleViewAll}
            >
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default NotificationDropdown
