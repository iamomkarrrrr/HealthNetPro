import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useNotifications from '../../hooks/useNotifications'
import useAuth from '../../hooks/useAuth'
import { getNotificationPath, getNotificationPagePath } from '../../utils/notificationNavigation'

const formatDate = (iso) => {
  if (!iso) return ''
  const diffMins = Math.floor((Date.now() - new Date(iso)) / 60000)
  if (diffMins < 1)  return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`
  const diffHrs = Math.floor(diffMins / 60)
  if (diffHrs < 24)  return `${diffHrs}h ago`
  return iso.slice(0, 10)
}

const BellIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
)

const CATEGORY_COLORS = {
  CASE:        { bg: '#dbeafe', color: '#1d4ed8' },
  OUTBREAK:    { bg: '#fee2e2', color: '#b91c1c' },
  VACCINATION: { bg: '#d1fae5', color: '#065f46' },
  COMPLIANCE:  { bg: '#ede9fe', color: '#5b21b6' },
  AUDIT:       { bg: '#f1f5f9', color: '#334155' },
}

const NotificationDropdown = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { notifications, unreadCount, markAsRead, refresh } = useNotifications()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleClick = async (n) => {
    if (n.status === 'UNREAD') await markAsRead(n.id)
    setOpen(false)
    navigate(getNotificationPath(n.category, user?.role))
  }

  const preview = notifications.slice(0, 6)

  return (
    <div style={{ position: 'relative' }} ref={ref}>
      <button
        type="button"
        onClick={() => { setOpen(o => !o); if (!open) refresh() }}
        aria-label="Notifications"
        style={{
          width: '36px', height: '36px', borderRadius: '50%',
          border: '1.5px solid #e2e8f0', background: '#ffffff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', position: 'relative', color: '#475569',
          transition: 'all 0.18s',
        }}
      >
        <BellIcon />
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute', top: '-3px', right: '-3px',
            background: '#ef4444', color: '#fff',
            borderRadius: '999px', fontSize: '10px', fontWeight: '800',
            padding: '1px 5px', minWidth: '16px', textAlign: 'center', lineHeight: '14px',
            border: '2px solid #fff',
          }}>
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div style={{
          position: 'absolute', right: 0, top: 'calc(100% + 8px)',
          width: '340px', zIndex: 1050,
          background: '#ffffff', borderRadius: '16px',
          border: '1px solid rgba(0,0,0,0.08)',
          boxShadow: '0 16px 40px rgba(0,0,0,0.12)',
          display: 'flex', flexDirection: 'column',
          maxHeight: '480px', overflow: 'hidden',
        }}>
          {/* Header */}
          <div style={{ padding: '14px 16px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: '800', fontSize: '14px', color: '#0f172a' }}>Notifications</span>
            {unreadCount > 0 && (
              <span style={{ background: '#fee2e2', color: '#b91c1c', borderRadius: '999px', fontSize: '11px', fontWeight: '700', padding: '2px 8px' }}>
                {unreadCount} unread
              </span>
            )}
          </div>

          {/* List */}
          <div style={{ overflowY: 'auto', flex: 1 }}>
            {preview.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px 16px', color: '#94a3b8', fontSize: '13px' }}>
                ✅ You&apos;re all caught up!
              </div>
            ) : preview.map(n => {
              const isUnread = n.status === 'UNREAD'
              const cat = CATEGORY_COLORS[n.category] ?? { bg: '#f1f5f9', color: '#334155' }
              return (
                <div
                  key={n.id}
                  onClick={() => handleClick(n)}
                  style={{
                    padding: '12px 16px',
                    borderBottom: '1px solid #f8fafc',
                    cursor: 'pointer',
                    background: isUnread ? 'linear-gradient(135deg, rgba(13,110,253,0.06), rgba(96,165,250,0.04))' : '#ffffff',
                    display: 'flex', gap: '10px', alignItems: 'flex-start',
                    transition: 'background 0.15s',
                  }}
                >
                  <div style={{ width: 8, height: 8, borderRadius: '50%', marginTop: 6, flexShrink: 0, background: isUnread ? '#3182ce' : '#cbd5e1' }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: isUnread ? '700' : '500', color: isUnread ? '#0f172a' : '#64748b', lineHeight: 1.4 }}>
                      {n.message}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '5px' }}>
                      <span style={{ fontSize: '10px', fontWeight: '700', padding: '2px 7px', borderRadius: '999px', background: cat.bg, color: cat.color }}>
                        {n.category}
                      </span>
                      <span style={{ fontSize: '11px', color: '#94a3b8' }}>{formatDate(n.createdDate)}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Footer */}
          <div style={{ padding: '10px 16px', borderTop: '1px solid #f1f5f9' }}>
            <button
              type="button"
              onClick={() => { setOpen(false); navigate(getNotificationPagePath(user?.role)) }}
              style={{
                width: '100%', height: '36px', borderRadius: '9px',
                border: '1.5px solid #e2e8f0', background: '#ffffff',
                fontSize: '13px', fontWeight: '700', color: '#475569',
                cursor: 'pointer', transition: 'all 0.18s',
              }}
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
