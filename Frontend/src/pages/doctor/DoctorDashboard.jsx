import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Card from '../../components/common/Card'
import Loader from '../../components/common/Loader'
import StatusBadge from '../../components/common/StatusBadge'
import useAuth from '../../hooks/useAuth'
import { getAllDiseaseCases } from '../../api/diseaseCaseApi'
import { getAllCitizens } from '../../api/citizenApi'
import { getAllOutbreaks } from '../../api/outbreakApi'
import { getNotificationsByUserId } from '../../api/notificationApi'

const DoctorDashboard = () => {
  const { user } = useAuth()
  const [cases, setCases] = useState([])
  const [citizens, setCitizens] = useState([])
  const [outbreaks, setOutbreaks] = useState([])
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.userId) return
    Promise.allSettled([
      getAllDiseaseCases(),
      getAllCitizens(),
      getAllOutbreaks(),
      getNotificationsByUserId(user.userId),
    ]).then(([c, p, o, n]) => {
      if (c.status === 'fulfilled') setCases(c.value.data?.data ?? [])
      if (p.status === 'fulfilled') setCitizens(p.value.data?.data ?? [])
      if (o.status === 'fulfilled') setOutbreaks(o.value.data?.data ?? [])
      if (n.status === 'fulfilled') setNotifications(n.value.data?.data ?? [])
    }).finally(() => setLoading(false))
  }, [user?.userId])

  const myCases = cases.filter(c => String(c.doctorId) === String(user?.userId))
  const activeCases = myCases.filter(c => ['REPORTED', 'UNDER_TREATMENT'].includes(c.status))
  const unread = notifications.filter(n => n.status === 'UNREAD')
  const activeOutbreaks = outbreaks.filter(o => ['DETECTED', 'ACTIVE'].includes(o.status))

  const QUICK_ACTIONS = [
    { label: 'Report New Case', to: '/doctor/disease-cases', desc: 'Create a new disease case report.' },
    { label: 'Manage Patient Records', to: '/doctor/patient-records', desc: 'Open patient charts and update profiles.' },
    { label: 'Case Updates', to: '/doctor/case-updates', desc: 'Review the latest case progress notes.' },
    { label: 'Citizen Health Lookup', to: '/doctor/patient-records', desc: 'Search citizen records and health history.' },
    { label: 'Outbreak Updates', to: '/doctor/outbreak-updates', desc: 'Track recent outbreak alerts and trends.' },
    { label: 'Notifications', to: '/doctor/notifications', desc: `${unread.length} unread alert(s).` },
  ]

  return (
    <DashboardLayout>
      <div className="mb-4">
        <h2 className="page-title">Doctor Dashboard</h2>
        <p className="text-muted">
          Welcome, <strong>{user?.name}</strong>. Review patient cases, coordinate care, and manage outbreak responses.
        </p>
      </div>

      {/* Stat cards */}
      {loading ? <Loader message="Loading dashboard…" /> : (
        <>
          <div className="row g-4 mb-4">
            <div className="col-md-6 col-xl-3">
              <div className="card card-surface h-100">
                <div className="card-body">
                  <div className="text-muted small mb-1">My Active Cases</div>
                  <h4 className="mb-1 text-primary">{activeCases.length}</h4>
                  <div className="text-muted small">Reported or under treatment</div>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-xl-3">
              <div className="card card-surface h-100">
                <div className="card-body">
                  <div className="text-muted small mb-1">Total My Cases</div>
                  <h4 className="mb-1">{myCases.length}</h4>
                  <div className="text-muted small">All cases assigned to you</div>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-xl-3">
              <div className="card card-surface h-100">
                <div className="card-body">
                  <div className="text-muted small mb-1">Patients</div>
                  <h4 className="mb-1">{citizens.length}</h4>
                  <div className="text-muted small">Registered citizens</div>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-xl-3">
              <div className="card card-surface h-100">
                <div className="card-body">
                  <div className="text-muted small mb-1">Unread Notifications</div>
                  <h4 className={`mb-1 ${unread.length > 0 ? 'text-warning' : ''}`}>{unread.length}</h4>
                  <div className="text-muted small">Pending alerts</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick action cards */}
          <div className="row g-4 mb-4">
            {QUICK_ACTIONS.map(({ label, to, desc }) => (
              <div key={to + label} className="col-md-6 col-xl-4">
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

          {/* Bottom row */}
          <div className="row g-4">
            <div className="col-lg-6">
              <Card title="Active Cases Overview">
                {activeCases.length === 0 ? (
                  <p className="text-muted small mb-0">No active cases assigned to you.</p>
                ) : (
                  <ul className="list-unstyled mb-0">
                    {activeCases.slice(0, 5).map(c => (
                      <li key={c.id} className="d-flex justify-content-between align-items-center py-2 border-bottom">
                        <div>
                          <div className="small fw-medium">{c.diseaseType}</div>
                          <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                            Citizen #{c.citizenId} · {c.diagnosisDate}
                          </div>
                        </div>
                        <StatusBadge status={c.status} />
                      </li>
                    ))}
                  </ul>
                )}
                <div className="mt-3">
                  <Link to="/doctor/disease-cases" className="btn btn-sm btn-outline-primary">View all cases</Link>
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
                          <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                            {n.category} · {n.createdDate?.slice(0, 10)}
                          </div>
                        </div>
                        <StatusBadge status={n.status} />
                      </li>
                    ))}
                  </ul>
                )}
                <div className="mt-3">
                  <Link to="/doctor/notifications" className="btn btn-sm btn-outline-primary">View all</Link>
                </div>
              </Card>
            </div>
          </div>

          {/* Outbreak preview */}
          {activeOutbreaks.length > 0 && (
            <div className="row g-4 mt-0">
              <div className="col-12">
                <div className="alert alert-danger d-flex align-items-center gap-2">
                  <span className="fs-5">⚠️</span>
                  <div>
                    <strong>{activeOutbreaks.length} active outbreak{activeOutbreaks.length > 1 ? 's' : ''} detected.</strong>{' '}
                    {activeOutbreaks.map(o => o.diseaseType).join(', ')}.{' '}
                    <Link to="/doctor/outbreak-updates" className="alert-link">View details →</Link>
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

export default DoctorDashboard
