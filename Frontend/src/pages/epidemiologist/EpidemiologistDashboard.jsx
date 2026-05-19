import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Card from '../../components/common/Card'
import Loader from '../../components/common/Loader'
import StatusBadge from '../../components/common/StatusBadge'
import useAuth from '../../hooks/useAuth'
import { getAllOutbreaks } from '../../api/outbreakApi'
import { getAllDiseaseCases } from '../../api/diseaseCaseApi'
import { getNotificationsByUserId } from '../../api/notificationApi'
import { getComplianceRecordsByType } from '../../api/complianceApi'

const EpidemiologistDashboard = () => {
  const { user } = useAuth()
  const [outbreaks, setOutbreaks] = useState([])
  const [cases, setCases] = useState([])
  const [notifications, setNotifications] = useState([])
  const [compliance, setCompliance] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.userId) return
    Promise.allSettled([
      getAllOutbreaks(),
      getAllDiseaseCases(),
      getNotificationsByUserId(user.userId),
      getComplianceRecordsByType('OUTBREAK'),
    ]).then(([ob, cs, nt, co]) => {
      if (ob.status === 'fulfilled') setOutbreaks(ob.value.data?.data ?? [])
      if (cs.status === 'fulfilled') setCases(cs.value.data?.data ?? [])
      if (nt.status === 'fulfilled') setNotifications(nt.value.data?.data ?? [])
      if (co.status === 'fulfilled') setCompliance(co.value.data?.data ?? [])
    }).finally(() => setLoading(false))
  }, [user?.userId])

  const activeOutbreaks = outbreaks.filter(o => ['DETECTED', 'ACTIVE'].includes(o.status))
  const resolvedOutbreaks = outbreaks.filter(o => ['CONTAINED', 'CLOSED'].includes(o.status))
  const unread = notifications.filter(n => n.status === 'UNREAD')

  // Disease type frequency map
  const diseaseFreq = cases.reduce((acc, c) => {
    acc[c.diseaseType] = (acc[c.diseaseType] || 0) + 1
    return acc
  }, {})
  const topDiseases = Object.entries(diseaseFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  const QUICK_ACTIONS = [
    { label: 'Manage Outbreaks', to: '/epidemiologist/outbreaks', desc: 'Create and update outbreak records.' },
    { label: 'Epidemiology Data', to: '/epidemiologist/epidemiology-data', desc: 'Add and analyze outbreak metrics.' },
    { label: 'Disease Trends', to: '/epidemiologist/disease-trends', desc: 'View aggregated disease case analytics.' },
    { label: 'Reports', to: '/epidemiologist/reports', desc: 'Browse outbreak and case reports.' },
    { label: 'Compliance Tracking', to: '/epidemiologist/compliance-tracking', desc: 'View outbreak compliance records.' },
    { label: 'Notifications', to: '/epidemiologist/notifications', desc: `${unread.length} unread alert(s).` },
  ]

  return (
    <DashboardLayout>
      <div className="mb-4">
        <h2 className="page-title">Epidemiologist Console</h2>
        <p className="text-muted">
          Welcome, <strong>{user?.name}</strong>. Monitor disease trends, outbreak patterns, and compliance status.
        </p>
      </div>

      {loading ? <Loader message="Loading dashboard…" /> : (
        <>
          {/* Stat cards */}
          <div className="row g-4 mb-4">
            <div className="col-md-6 col-xl-3">
              <div className="card card-surface h-100">
                <div className="card-body">
                  <div className="text-muted small mb-1">Active Outbreaks</div>
                  <h4 className={`mb-1 ${activeOutbreaks.length > 0 ? 'text-danger' : 'text-success'}`}>
                    {activeOutbreaks.length}
                  </h4>
                  <div className="text-muted small">Detected or active</div>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-xl-3">
              <div className="card card-surface h-100">
                <div className="card-body">
                  <div className="text-muted small mb-1">Contained / Closed</div>
                  <h4 className="mb-1 text-success">{resolvedOutbreaks.length}</h4>
                  <div className="text-muted small">Resolved outbreaks</div>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-xl-3">
              <div className="card card-surface h-100">
                <div className="card-body">
                  <div className="text-muted small mb-1">Total Disease Cases</div>
                  <h4 className="mb-1">{cases.length}</h4>
                  <div className="text-muted small">All reported cases</div>
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

          {/* Quick actions */}
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

          {/* Bottom row */}
          <div className="row g-4">
            {/* Recent outbreaks */}
            <div className="col-lg-5">
              <Card title="Recent Outbreaks">
                {outbreaks.length === 0 ? (
                  <p className="text-muted small mb-0">No outbreaks recorded.</p>
                ) : (
                  <ul className="list-unstyled mb-0">
                    {outbreaks.slice(0, 5).map(o => (
                      <li key={o.id} className="d-flex justify-content-between align-items-center py-2 border-bottom">
                        <div>
                          <div className="small fw-medium">{o.diseaseType}</div>
                          <div className="text-muted" style={{ fontSize: '0.75rem' }}>📍 {o.location}</div>
                        </div>
                        <StatusBadge status={o.status} />
                      </li>
                    ))}
                  </ul>
                )}
                <div className="mt-3">
                  <Link to="/epidemiologist/outbreaks" className="btn btn-sm btn-outline-primary">View all</Link>
                </div>
              </Card>
            </div>

            {/* Top disease types */}
            <div className="col-lg-4">
              <Card title="Top Disease Types">
                {topDiseases.length === 0 ? (
                  <p className="text-muted small mb-0">No case data available.</p>
                ) : (
                  <ul className="list-unstyled mb-0">
                    {topDiseases.map(([disease, count]) => (
                      <li key={disease} className="d-flex justify-content-between py-2 border-bottom">
                        <span className="small">{disease}</span>
                        <span className="badge bg-primary">{count}</span>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="mt-3">
                  <Link to="/epidemiologist/disease-trends" className="btn btn-sm btn-outline-primary">View trends</Link>
                </div>
              </Card>
            </div>

            {/* Recent notifications */}
            <div className="col-lg-3">
              <Card title="Notifications">
                {unread.length === 0 ? (
                  <p className="text-muted small mb-0">No unread notifications.</p>
                ) : (
                  <ul className="list-unstyled mb-0">
                    {unread.slice(0, 4).map(n => (
                      <li key={n.id} className="py-2 border-bottom">
                        <div className="small text-truncate">{n.message}</div>
                        <div className="text-muted" style={{ fontSize: '0.7rem' }}>{n.category}</div>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="mt-3">
                  <Link to="/epidemiologist/notifications" className="btn btn-sm btn-outline-primary">View all</Link>
                </div>
              </Card>
            </div>
          </div>

          {/* Active outbreak alert banner */}
          {activeOutbreaks.length > 0 && (
            <div className="row g-4 mt-0">
              <div className="col-12">
                <div className="alert alert-danger d-flex align-items-center gap-2 mb-0">
                  <span className="fs-5">⚠️</span>
                  <div>
                    <strong>{activeOutbreaks.length} active outbreak{activeOutbreaks.length > 1 ? 's' : ''}:</strong>{' '}
                    {activeOutbreaks.map(o => `${o.diseaseType} (${o.location})`).join(' · ')}.{' '}
                    <Link to="/epidemiologist/outbreaks" className="alert-link">Manage →</Link>
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

export default EpidemiologistDashboard
