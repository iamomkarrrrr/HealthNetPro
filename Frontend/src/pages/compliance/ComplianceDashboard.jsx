import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Card from '../../components/common/Card'
import Loader from '../../components/common/Loader'
import StatusBadge from '../../components/common/StatusBadge'
import useAuth from '../../hooks/useAuth'
import { getComplianceRecordsByType } from '../../api/complianceApi'
import { getNotificationsByUserId } from '../../api/notificationApi'

const TYPES = ['CASE', 'OUTBREAK', 'VACCINATION']

const ComplianceDashboard = () => {
  const { user } = useAuth()
  const [records, setRecords] = useState([])
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.userId) return
    Promise.allSettled([
      ...TYPES.map(t => getComplianceRecordsByType(t)),
      getNotificationsByUserId(user.userId),
    ]).then(([caseRes, outbreakRes, vacRes, notifRes]) => {
      const all = []
      if (caseRes.status === 'fulfilled') all.push(...(caseRes.value.data?.data ?? []))
      if (outbreakRes.status === 'fulfilled') all.push(...(outbreakRes.value.data?.data ?? []))
      if (vacRes.status === 'fulfilled') all.push(...(vacRes.value.data?.data ?? []))
      setRecords(all)
      if (notifRes.status === 'fulfilled') setNotifications(notifRes.value.data?.data ?? [])
    }).finally(() => setLoading(false))
  }, [user?.userId])

  const passCount       = records.filter(r => r.result === 'PASS').length
  const failCount       = records.filter(r => ['FAIL', 'NON_COMPLIANT'].includes(r.result)).length
  const warningCount    = records.filter(r => r.result === 'WARNING').length
  const unread          = notifications.filter(n => n.status === 'UNREAD')
  const recent          = [...records].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 6)

  const STATS = [
    { label: 'Total Records',        value: records.length,  color: '' },
    { label: 'Passed',               value: passCount,       color: 'text-success' },
    { label: 'Failed / Non-Compliant', value: failCount,     color: failCount > 0 ? 'text-danger' : '' },
    { label: 'Warnings',             value: warningCount,    color: warningCount > 0 ? 'text-warning' : '' },
    { label: 'Unread Notifications', value: unread.length,   color: unread.length > 0 ? 'text-warning' : '' },
  ]

  const QUICK_ACTIONS = [
    { label: 'Compliance Records', to: '/compliance/records',       desc: 'Create and manage compliance records.' },
    { label: 'Entity Review',      to: '/compliance/entity-review', desc: 'Review compliance by entity ID.' },
    { label: 'Reports',            to: '/compliance/reports',       desc: 'Browse compliance and case reports.' },
    { label: 'Notifications',      to: '/compliance/notifications', desc: `${unread.length} unread alert(s).` },
  ]

  return (
    <DashboardLayout>
      <div className="mb-4">
        <h2 className="page-title">Compliance Officer Console</h2>
        <p className="text-muted">
          Welcome, <strong>{user?.name}</strong>. Monitor regulatory compliance, track records, and support audit readiness.
        </p>
      </div>

      {loading ? <Loader message="Loading dashboard…" /> : (
        <>
          {/* Stat cards */}
          <div className="row g-4 mb-4">
            {STATS.map(({ label, value, color }) => (
              <div key={label} className="col-md-6 col-xl">
                <div className="card card-surface h-100">
                  <div className="card-body">
                    <div className="text-muted small mb-1">{label}</div>
                    <h4 className={`mb-0 ${color}`}>{value}</h4>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick actions */}
          <div className="row g-4 mb-4">
            {QUICK_ACTIONS.map(({ label, to, desc }) => (
              <div key={to} className="col-md-6 col-xl-3">
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
            <div className="col-lg-7">
              <Card title="Recent Compliance Records">
                {recent.length === 0 ? (
                  <p className="text-muted small mb-0">No compliance records found.</p>
                ) : (
                  <ul className="list-unstyled mb-0">
                    {recent.map(r => (
                      <li key={r.id} className="d-flex justify-content-between align-items-center py-2 border-bottom">
                        <div>
                          <div className="small fw-medium">Entity #{r.entityId} — {r.type}</div>
                          <div className="text-muted" style={{ fontSize: '0.75rem' }}>{r.date} · {r.notes?.slice(0, 50)}{r.notes?.length > 50 ? '…' : ''}</div>
                        </div>
                        <StatusBadge status={r.result} />
                      </li>
                    ))}
                  </ul>
                )}
                <div className="mt-3">
                  <Link to="/compliance/records" className="btn btn-sm btn-outline-primary">View all records</Link>
                </div>
              </Card>
            </div>
            <div className="col-lg-5">
              <Card title="Recent Notifications">
                {unread.length === 0 ? (
                  <p className="text-muted small mb-0">No unread notifications.</p>
                ) : (
                  <ul className="list-unstyled mb-0">
                    {unread.slice(0, 5).map(n => (
                      <li key={n.id} className="py-2 border-bottom">
                        <div className="small">{n.message}</div>
                        <div className="text-muted" style={{ fontSize: '0.75rem' }}>{n.category} · {n.createdDate?.slice(0, 10)}</div>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="mt-3">
                  <Link to="/compliance/notifications" className="btn btn-sm btn-outline-primary">View all</Link>
                </div>
              </Card>
            </div>
          </div>

          {/* Non-compliance alert */}
          {failCount > 0 && (
            <div className="row g-4 mt-0">
              <div className="col-12">
                <div className="alert alert-danger d-flex align-items-center gap-2 mb-0">
                  <span className="fs-5">⚠️</span>
                  <div>
                    <strong>{failCount} non-compliant record{failCount > 1 ? 's' : ''} require attention.</strong>{' '}
                    <Link to="/compliance/records" className="alert-link">Review records →</Link>
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

export default ComplianceDashboard
