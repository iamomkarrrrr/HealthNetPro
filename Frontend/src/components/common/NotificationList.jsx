import Card from './Card'
import Loader from './Loader'
import { getCategoryBadgeClass } from '../../utils/notificationNavigation'

const formatDate = (iso) => {
  if (!iso) return ''
  return iso.slice(0, 16).replace('T', ' ')
}

const NotificationItem = ({ n, onMarkRead, marking, showMarkRead = true }) => {
  const isUnread = n.status === 'UNREAD'
  return (
    <li
      className={`d-flex justify-content-between align-items-start py-3 border-bottom ${isUnread ? 'bg-primary bg-opacity-10 rounded px-2' : ''}`}
    >
      <div className="me-3 flex-fill">
        <div className={`small ${isUnread ? 'fw-semibold' : 'text-muted'}`}>{n.message}</div>
        <div className="d-flex align-items-center gap-2 mt-1 flex-wrap">
          <span className={`badge ${getCategoryBadgeClass(n.category)}`} style={{ fontSize: '0.65rem' }}>
            {n.category}
          </span>
          <span className="text-muted" style={{ fontSize: '0.72rem' }}>{formatDate(n.createdDate)}</span>
        </div>
      </div>
      {showMarkRead && isUnread && (
        <button
          className="btn btn-sm btn-outline-primary flex-shrink-0"
          disabled={marking === n.id}
          onClick={() => onMarkRead(n.id)}
        >
          {marking === n.id ? '…' : 'Mark Read'}
        </button>
      )}
      {!isUnread && (
        <span className="badge bg-secondary flex-shrink-0" style={{ fontSize: '0.65rem' }}>READ</span>
      )}
    </li>
  )
}

/**
 * Shared notification list used by all role-specific notification pages.
 * Accepts data from useNotifications hook.
 */
const NotificationList = ({ notifications, unread, read, loading, error, markAsRead, marking }) => {
  if (loading) return <Loader message="Loading notifications…" />

  if (error) return <div className="alert alert-danger py-2">{error}</div>

  if (notifications.length === 0) {
    return (
      <div className="alert alert-info d-flex align-items-center gap-2">
        <span>✅</span>
        <span>You're all caught up. No new notifications.</span>
      </div>
    )
  }

  return (
    <>
      {unread.length > 0 && (
        <Card title={`Unread (${unread.length})`} className="mb-4">
          <ul className="list-unstyled mb-0">
            {unread.map(n => (
              <NotificationItem key={n.id} n={n} onMarkRead={markAsRead} marking={marking} />
            ))}
          </ul>
        </Card>
      )}

      {read.length > 0 && (
        <Card title="Read">
          <ul className="list-unstyled mb-0">
            {read.map(n => (
              <NotificationItem key={n.id} n={n} onMarkRead={markAsRead} marking={marking} showMarkRead={false} />
            ))}
          </ul>
        </Card>
      )}
    </>
  )
}

export default NotificationList
