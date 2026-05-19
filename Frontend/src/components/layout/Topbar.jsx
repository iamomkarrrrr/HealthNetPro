import useAuth from '../../hooks/useAuth'
import NotificationDropdown from '../common/NotificationDropdown'
import Badge from '../common/Badge'
import { getRoleLabel } from '../../utils/roles'

const Topbar = () => {
  const { user, logout } = useAuth()
  return (
    <div className="d-flex align-items-center justify-content-between py-3 px-3 bg-white border-bottom shadow-sm">
      <div>
        <div className="text-muted small">Welcome back,</div>
        <div className="fw-bold">{user?.name || user?.fullName || user?.email}</div>
      </div>
      <div className="d-flex align-items-center gap-3">
        <Badge variant="info">{getRoleLabel(user?.role)}</Badge>
        <NotificationDropdown />
        <button type="button" className="btn btn-outline-secondary" onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  )
}

export default Topbar
