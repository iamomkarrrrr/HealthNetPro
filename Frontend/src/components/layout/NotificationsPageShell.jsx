import { useState } from 'react'
import DashboardLayout from '../layout/DashboardLayout'
import NotificationList from '../common/NotificationList'
import useNotifications from '../../hooks/useNotifications'

/**
 * Shared shell for all role-specific notification pages.
 * Consumes the global useNotifications hook — no duplicate API calls.
 */
const NotificationsPageShell = () => {
  const { notifications, unread, read, loading, error, markAsRead } = useNotifications()
  const [marking, setMarking] = useState(null)

  const handleMarkRead = async (id) => {
    setMarking(id)
    await markAsRead(id)
    setMarking(null)
  }

  return (
    <DashboardLayout>
      <div className="mb-4">
        <h2 className="page-title">Notifications</h2>
        <p className="text-muted">
          {loading ? 'Loading…' : unread.length > 0
            ? <><strong className="text-warning">{unread.length} unread</strong> notification{unread.length !== 1 ? 's' : ''}.</>
            : 'All notifications are read.'}
        </p>
      </div>

      <NotificationList
        notifications={notifications}
        unread={unread}
        read={read}
        loading={loading}
        error={error}
        markAsRead={handleMarkRead}
        marking={marking}
      />
    </DashboardLayout>
  )
}

export default NotificationsPageShell
