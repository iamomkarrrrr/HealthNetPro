import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Card from '../../components/common/Card'
import Loader from '../../components/common/Loader'
import StatusBadge from '../../components/common/StatusBadge'
import useAuth from '../../hooks/useAuth'
import { getAllUsers } from '../../api/userApi'
import { getAllCitizens } from '../../api/citizenApi'
import { getVaccinationPrograms } from '../../api/vaccinationApi'
import { getAllDiseaseCases } from '../../api/diseaseCaseApi'
import { getAllOutbreaks } from '../../api/outbreakApi'
import { getNotificationsByUserId } from '../../api/notificationApi'

const HealthAdminDashboard = () => {
  const { user } = useAuth()
  const [users, setUsers] = useState([])
  const [citizens, setCitizens] = useState([])
  const [vaccinationPrograms, setVaccinationPrograms] = useState([])
  const [cases, setCases] = useState([])
  const [outbreaks, setOutbreaks] = useState([])
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.userId) return
    Promise.allSettled([
      getAllUsers(),
      getAllCitizens(),
      getVaccinationPrograms(),
      getAllDiseaseCases(),
      getAllOutbreaks(),
      getNotificationsByUserId(user.userId),
    ]).then(([u, c, vp, dc, ob, nt]) => {
      if (u.status === 'fulfilled') setUsers(u.value.data?.data ?? [])
      if (c.status === 'fulfilled') setCitizens(c.value.data?.data ?? [])
      if (vp.status === 'fulfilled') setVaccinationPrograms(vp.value.data?.data ?? [])
      if (dc.status === 'fulfilled') setCases(dc.value.data?.data ?? [])
      if (ob.status === 'fulfilled') setOutbreaks(ob.value.data?.data ?? [])
      if (nt.status === 'fulfilled') setNotifications(nt.value.data?.data ?? [])
    }).finally(() => setLoading(false))
  }, [user?.userId])

  const staffUsers = users.filter(u => u.role !== 'CITIZEN')
  const activeVaxPrograms = vaccinationPrograms.filter(v => ['ACTIVE', 'UPCOMING'].includes(v.status))
  const activeCases = cases.filter(c => ['REPORTED', 'UNDER_TREATMENT'].includes(c.status))
  const activeOutbreaks = outbreaks.filter(o => ['DETECTED', 'ACTIVE'].includes(o.status))
  const unread = notifications.filter(n => n.status === 'UNREAD')

  const STATS = [
    { label: 'Staff Users', value: staffUsers.length, color: 'text-primary', desc: 'Non-citizen accounts' },
    { label: 'Citizens', value: citizens.length, color: '', desc: 'Registered citizens' },
    { label: 'Active Vax Programs', value: activeVaxPrograms.length, color: 'text-success', desc: 'Active or upcoming' },
    { label: 'Active Cases', value: activeCases.length, color: activeCases.length > 0 ? 'text-warning' : '', desc: 'Reported or under treatment' },
    { label: 'Active Outbreaks', value: activeOutbreaks.length, color: activeOutbreaks.length > 0 ? 'text-danger' : 'text-success', desc: 'Detected or active' },
    { label: 'Unread Notifications', value: unread.length, color: unread.length > 0 ? 'text-warning' : '', desc: 'Pending alerts' },
  ]

  const QUICK_ACTIONS = [
    { label: 'Staff Management', to: '/health-admin/staff', desc: 'View and manage staff accounts.' },
    { label: 'Vaccination Programs', to: '/health-admin/vaccination-programs', desc: 'Create and update vaccination programs.' },
    { label: 'Citizen Overview', to: '/health-admin/citizens', desc: 'Browse and search citizen records.' },
    { label: 'Reports', to: '/health-admin/reports', desc: 'View and generate health reports.' },
    { label: 'Operations Overview', to: '/health-admin/operations-overview', desc: 'Operational health summary.' },
    { label: 'Notifications', to: '/health-admin/notifications', desc: `${unread.length} unread alert(s).` },
  ]

  return (
    <DashboardLayout>
      <div className="mb-4">
        <h2 className="page-title">Health Administrator Panel</h2>
        <p className="text-muted">
          Welcome, <strong>{user?.name}</strong>. Oversee programs, staff, and public health operations.
        </p>
      </div>

      {loading ? <Loader message="Loading dashboard…" /> : (
        <>
          <div className="row g-4 mb-4">
            {STATS.map(({ label, value, color, desc }) => (
              <div key={label} className="col-md-6 col-xl-4">
                <div className="card card-surface h-100">
                  <div className="card-body">
                    <div className="text-muted small mb-1">{label}</div>
                    <h4 className={`mb-1 ${color}`}>{value}</h4>
                    <div className="text-muted small">{desc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="row g-4 mb-4">
            {QUICK_ACTIONS.map(({ label, to, desc }) => (
              <div key={to} className="col-md-6 col-xl-4">
                <Link to={to} className="text-decoration-none">
                  <div className="card card-surface h-100 border-0 shadow-sm">
                    <div className="card-body">
                      <h6 className="text-primary mb-1">{label}</h6>
                      <p className="text-muted small mb-0">{desc}</p>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          <div className="row g-4">
            <div className="col-lg-6">
              <Card title="Active Vaccination Programs">
                {activeVaxPrograms.length === 0 ? (
                  <p className="text-muted small mb-0">No active or upcoming programs.</p>
                ) : (
                  <ul className="list-unstyled mb-0">
                    {activeVaxPrograms.slice(0, 5).map(v => (
                      <li key={v.id} className="d-flex justify-content-between align-items-center py-2 border-bottom">
                        <div>
                          <div className="small fw-medium">{v.title}</div>
                          <div className="text-muted" style={{ fontSize: '0.75rem' }}>Start: {v.startDate}</div>
                        </div>
                        <StatusBadge status={v.status} />
                      </li>
                    ))}
                  </ul>
                )}
                <div className="mt-3">
                  <Link to="/health-admin/vaccination-programs" className="btn btn-sm btn-outline-primary">View all</Link>
                </div>
              </Card>
            </div>
            <div className="col-lg-6">
              <Card title="Recent Notifications">
                {unread.length === 0 ? (
                  <p className="text-muted small mb-0">No unread notifications.</p>
                ) : (
                  <ul className="list-unstyled mb-0">
                    {unread.slice(0, 5).map(n => (
                      <li key={n.id} className="d-flex justify-content-between align-items-start py-2 border-bottom">
                        <div>
                          <div className="small">{n.message}</div>
                          <div className="text-muted" style={{ fontSize: '0.75rem' }}>{n.category} · {n.createdDate?.slice(0, 10)}</div>
                        </div>
                        <StatusBadge status={n.status} />
                      </li>
                    ))}
                  </ul>
                )}
                <div className="mt-3">
                  <Link to="/health-admin/notifications" className="btn btn-sm btn-outline-primary">View all</Link>
                </div>
              </Card>
            </div>
          </div>

          {activeOutbreaks.length > 0 && (
            <div className="row g-4 mt-0">
              <div className="col-12">
                <div className="alert alert-danger d-flex align-items-center gap-2 mb-0">
                  <span className="fs-5">⚠️</span>
                  <div>
                    <strong>{activeOutbreaks.length} active outbreak{activeOutbreaks.length > 1 ? 's' : ''}:</strong>{' '}
                    {activeOutbreaks.map(o => `${o.diseaseType} (${o.location})`).join(' · ')}.{' '}
                    <Link to="/health-admin/operations-overview" className="alert-link">View operations →</Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </DashboardLayout>
  )
}

export default HealthAdminDashboard
