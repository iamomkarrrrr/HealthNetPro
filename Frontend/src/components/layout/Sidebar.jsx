import { NavLink } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import { getRoleLabel } from '../../utils/roles'
import {
  ADMIN, CITIZEN, DOCTOR, HEALTH_WORKER,
  EPIDEMIOLOGIST, HEALTH_ADMINISTRATOR,
  COMPLIANCE_OFFICER, AUDITOR, GOVERNMENT_AUDITOR,
} from '../../utils/roles'

const HEALTH_ADMIN_MENU = [
  { label: 'Dashboard',            to: '/health-admin/dashboard' },
  { label: 'Users',                to: '/health-admin/users' },
  { label: 'Staff Management',     to: '/health-admin/staff' },
  { label: 'Citizen Management',   to: '/health-admin/citizens' },
  { label: 'Vaccination Programs', to: '/health-admin/vaccination-programs' },
  { label: 'Immunizations',        to: '/health-admin/immunizations' },
  { label: 'Reports',              to: '/health-admin/reports' },
  { label: 'Audit Logs',           to: '/health-admin/audit-logs' },
  { label: 'Operations Overview',  to: '/health-admin/operations-overview' },
  { label: 'Notifications',        to: '/health-admin/notifications' },
]

const MENUS = {
  [CITIZEN]: [
    { label: 'Dashboard',             to: '/citizen/dashboard' },
    { label: 'My Profile',            to: '/citizen/profile' },
    { label: 'Health Profile',        to: '/citizen/health-profile' },
    { label: 'Documents',             to: '/citizen/documents' },
    { label: 'Vaccination Records',   to: '/citizen/vaccination-records' },
    { label: 'Vaccination Schedules', to: '/citizen/vaccination-schedules' },
    { label: 'Outbreak Alerts',       to: '/citizen/outbreak-alerts' },
    { label: 'Notifications',         to: '/citizen/notifications' },
    { label: 'Report Health Concern', to: '/citizen/report-health-concern' },
  ],
  [DOCTOR]: [
    { label: 'Dashboard',        to: '/doctor/dashboard' },
    { label: 'Disease Cases',    to: '/doctor/disease-cases' },
    { label: 'Case Updates',     to: '/doctor/case-updates' },
    { label: 'Patient Records',  to: '/doctor/patient-records' },
    { label: 'Outbreak Updates', to: '/doctor/outbreak-updates' },
    { label: 'Notifications',    to: '/doctor/notifications' },
  ],
  [EPIDEMIOLOGIST]: [
    { label: 'Dashboard',           to: '/epidemiologist/dashboard' },
    { label: 'Outbreaks',           to: '/epidemiologist/outbreaks' },
    { label: 'Epidemiology Data',   to: '/epidemiologist/epidemiology-data' },
    { label: 'Disease Trends',      to: '/epidemiologist/disease-trends' },
    { label: 'Reports',             to: '/epidemiologist/reports' },
    { label: 'Compliance Tracking', to: '/epidemiologist/compliance-tracking' },
    { label: 'Notifications',       to: '/epidemiologist/notifications' },
  ],
  [HEALTH_ADMINISTRATOR]: HEALTH_ADMIN_MENU,
  [ADMIN]: HEALTH_ADMIN_MENU,
  [COMPLIANCE_OFFICER]: [
    { label: 'Dashboard',          to: '/compliance/dashboard' },
    { label: 'Compliance Records', to: '/compliance/records' },
    { label: 'Entity Review',      to: '/compliance/entity-review' },
    { label: 'Reports',            to: '/compliance/reports' },
    { label: 'Notifications',      to: '/compliance/notifications' },
  ],
  [AUDITOR]: [
    { label: 'Dashboard',         to: '/auditor/dashboard' },
    { label: 'Audits',            to: '/auditor/audits' },
    { label: 'Compliance Review', to: '/auditor/compliance-review' },
    { label: 'Reports',           to: '/auditor/reports' },
    { label: 'System Overview',   to: '/auditor/system-overview' },
    { label: 'Notifications',     to: '/auditor/notifications' },
  ],
}
MENUS[HEALTH_WORKER]      = MENUS[DOCTOR]
MENUS[GOVERNMENT_AUDITOR] = MENUS[AUDITOR]

const CrossIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <rect x="9" y="2" width="6" height="20" rx="2" fill="white" />
    <rect x="2" y="9" width="20" height="6" rx="2" fill="white" />
  </svg>
)

const Sidebar = () => {
  const { user } = useAuth()
  const links = MENUS[user?.role] ?? []
  const initial = (user?.name || user?.email || 'U').charAt(0).toUpperCase()

  return (
    <aside className="hn-sidebar">
      {/* Brand */}
      <div className="hn-sidebar-brand">
        <div className="hn-sidebar-logo">
          <CrossIcon />
        </div>
        <div>
          <div className="hn-sidebar-brand-name">HealthNet</div>
          <div className="hn-sidebar-brand-sub">{getRoleLabel(user?.role)}</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="hn-sidebar-nav">
        <div className="hn-sidebar-section-label">Navigation</div>
        {links.map(({ label, to }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `hn-nav-link${isActive ? ' active' : ''}`}
          >
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User footer */}
      <div className="hn-sidebar-footer">
        <div className="hn-sidebar-user">
          <div className="hn-sidebar-avatar">{initial}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="hn-sidebar-user-name">{user?.name || user?.email}</div>
            <div className="hn-sidebar-user-role">{getRoleLabel(user?.role)}</div>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
