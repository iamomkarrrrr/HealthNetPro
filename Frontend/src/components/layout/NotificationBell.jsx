import { useState } from 'react'

const NotificationBell = () => {
  const [open, setOpen] = useState(false)
  const unreadCount = 3

  return (
    <div className="position-relative">
      <button type="button" className="btn btn-outline-secondary rounded-circle p-2" onClick={() => setOpen(!open)}>
        <span aria-hidden="true">🔔</span>
        <span className="visually-hidden">Notifications</span>
      </button>
      {unreadCount > 0 && (
        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">{unreadCount}</span>
      )}
      {open && (
        <div className="card shadow-sm position-absolute end-0 mt-2" style={{ minWidth: '240px', zIndex: 20 }}>
          <div className="card-body p-3">
            <h6 className="mb-3">Recent alerts</h6>
            <div className="text-muted small">No notifications are loaded yet.</div>
            <div className="mt-3 text-end">
              <button type="button" className="btn btn-sm btn-outline-primary">View all</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default NotificationBell
