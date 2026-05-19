import { useLocation } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import NotificationDropdown from '../common/NotificationDropdown'
import { getRoleLabel } from '../../utils/roles'

const ROUTE_TITLES = {
  '/citizen/dashboard':            'Dashboard',
  '/citizen/profile':              'My Profile',
  '/citizen/health-profile':       'Health Profile',
  '/citizen/documents':            'Documents',
  '/citizen/vaccination-records':  'Vaccination Records',
  '/citizen/vaccination-schedules':'Vaccination Schedules',
  '/citizen/outbreak-alerts':      'Outbreak Alerts',
  '/citizen/notifications':        'Notifications',
  '/citizen/report-health-concern':'Report Health Concern',
  '/doctor/dashboard':             'Dashboard',
  '/doctor/disease-cases':         'Disease Cases',
  '/doctor/case-updates':          'Case Updates',
  '/doctor/patient-records':       'Patient Records',
  '/doctor/outbreak-updates':      'Outbreak Updates',
  '/doctor/notifications':         'Notifications',
  '/epidemiologist/dashboard':     'Dashboard',
  '/epidemiologist/outbreaks':     'Outbreaks',
  '/epidemiologist/epidemiology-data': 'Epidemiology Data',
  '/epidemiologist/disease-trends':'Disease Trends',
  '/epidemiologist/reports':       'Reports',
  '/epidemiologist/compliance-tracking': 'Compliance Tracking',
  '/epidemiologist/notifications': 'Notifications',
  '/health-admin/dashboard':       'Dashboard',
  '/health-admin/users':           'User Management',
  '/health-admin/staff':           'Staff Management',
  '/health-admin/citizens':        'Citizen Management',
  '/health-admin/vaccination-programs': 'Vaccination Programs',
  '/health-admin/immunizations':   'Immunizations',
  '/health-admin/reports':         'Reports',
  '/health-admin/audit-logs':      'Audit Logs',
  '/health-admin/operations-overview': 'Operations Overview',
  '/health-admin/notifications':   'Notifications',
  '/compliance/dashboard':         'Dashboard',
  '/compliance/records':           'Compliance Records',
  '/compliance/entity-review':     'Entity Review',
  '/compliance/reports':           'Reports',
  '/compliance/notifications':     'Notifications',
  '/auditor/dashboard':            'Dashboard',
  '/auditor/audits':               'Audits',
  '/auditor/compliance-review':    'Compliance Review',
  '/auditor/reports':              'Reports',
  '/auditor/system-overview':      'System Overview',
  '/auditor/notifications':        'Notifications',
}

const LogoutIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
)

const Topbar = () => {
  const { user, logout } = useAuth()
  const location = useLocation()
  const title = ROUTE_TITLES[location.pathname] ?? 'HealthNet'
  const initial = (user?.name || user?.email || 'U').charAt(0).toUpperCase()

  return (
    <header className="hn-topbar">
      <div className="hn-topbar-left">
        <div className="hn-topbar-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
            <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
          </svg>
        </div>
        <div>
          <div className="hn-topbar-title">{title}</div>
          <div className="hn-topbar-sub">HealthNet Portal</div>
        </div>
      </div>

      <div className="hn-topbar-right">
        <div style={{ textAlign: 'right' }}>
          <div className="hn-topbar-user-name">{user?.name || user?.email}</div>
          <div className="hn-topbar-user-role">{getRoleLabel(user?.role)}</div>
        </div>
        <div className="hn-topbar-avatar">{initial}</div>
        <NotificationDropdown />
        <button type="button" className="hn-logout-btn" onClick={logout}>
          <LogoutIcon /> Logout
        </button>
      </div>
    </header>
  )
}

export default Topbar
