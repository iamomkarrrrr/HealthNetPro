import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Card from '../../components/common/Card'
import Loader from '../../components/common/Loader'
import StatusBadge from '../../components/common/StatusBadge'
import useAuth from '../../hooks/useAuth'
import { getAuditsByOfficerId } from '../../api/auditApi'
import { getComplianceRecordsByType } from '../../api/complianceApi'
import { getReportsByScope } from '../../api/reportingApi'
import { getAllOutbreaks } from '../../api/outbreakApi'
import { getAllDiseaseCases } from '../../api/diseaseCaseApi'
import { getVaccinationPrograms } from '../../api/vaccinationApi'
import { getNotificationsByUserId } from '../../api/notificationApi'

const COMPLIANCE_TYPES = ['CASE', 'OUTBREAK', 'VACCINATION']

const AuditorDashboard = () => {
  const { user } = useAuth()
  const [audits, setAudits] = useState([])
  const [compliance, setCompliance] = useState([])
  const [reports, setReports] = useState([])
  const [outbreaks, setOutbreaks] = useState([])
  const [cases, setCases] = useState([])
  const [programs, setPrograms] = useState([])
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.userId) return
    Promise.allSettled([
      getAuditsByOfficerId(user.userId),
      ...COMPLIANCE_TYPES.map(t => getComplianceRecordsByType(t)),
      getReportsByScope('COMPLIANCE'),
      getAllOutbreaks(),
      getAllDiseaseCases(),
      getVaccinationPrograms(),
      getNotificationsByUserId(user.userId),
    ]).then(([auditRes, caseComp, outbreakComp, vacComp, reportRes, obRes, caseRes, progRes, notifRes]) => {
      if (auditRes.status === 'fulfilled') setAudits(auditRes.value.data?.data ?? [])
      const allCompliance = []
      if (caseComp.status === 'fulfilled') allCompliance.push(...(caseComp.value.data?.data ?? []))
      if (outbreakComp.status === 'fulfilled') allCompliance.push(...(outbreakComp.value.data?.data ?? []))
      if (vacComp.status === 'fulfilled') allCompliance.push(...(vacComp.value.data?.data ?? []))
      setCompliance(allCompliance)
      if (reportRes.status === 'fulfilled') setReports(reportRes.value.data?.data ?? [])
      if (obRes.status === 'fulfilled') setOutbreaks(obRes.value.data?.data ?? [])
      if (caseRes.status === 'fulfilled') setCases(caseRes.value.data?.data ?? [])
      if (progRes.status === 'fulfilled') setPrograms(progRes.value.data?.data ?? [])
      if (notifRes.status === 'fulfilled') setNotifications(notifRes.value.data?.data ?? [])
    }).finally(() => setLoading(false))
  }, [user?.userId])

  const openAudits      = audits.filter(a => a.status === 'OPEN')
  const inReviewAudits  = audits.filter(a => a.status === 'IN_REVIEW')
  const compIssues      = compliance.filter(r => ['FAIL', 'NON_COMPLIANT'].includes(r.result))
  const activeOutbreaks = outbreaks.filter(o => ['DETECTED', 'ACTIVE'].includes(o.status))
  const activeCases     = cases.filter(c => ['REPORTED', 'UNDER_TREATMENT'].includes(c.status))
  const unread          = notifications.filter(n => n.status === 'UNREAD')
  const recentAudits    = [...audits].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5)
  const recentReports   = [...reports].sort((a, b) => new Date(b.generatedDate) - new Date(a.generatedDate)).slice(0, 4)

  const STATS = [
    { label: 'Total Audits',         value: audits.length,         color: '',             to: '/auditor/audits' },
    { label: 'Open Audits',          value: openAudits.length,     color: openAudits.length > 0 ? 'text-warning' : '', to: '/auditor/audits' },
    { label: 'In Review',            value: inReviewAudits.length, color: 'text-info',    to: '/auditor/audits' },
    { label: 'Compliance Issues',    value: compIssues.length,     color: compIssues.length > 0 ? 'text-danger' : 'text-success', to: '/auditor/compliance-review' },
    { label: 'Active Outbreaks',     value: activeOutbreaks.length,color: activeOutbreaks.length > 0 ? 'text-danger' : 'text-success', to: '/auditor/system-overview' },
    { label: 'Active Cases',         value: activeCases.length,    color: activeCases.length > 0 ? 'text-warning' : '', to: '/auditor/system-overview' },
    { label: 'Vaccination Programs', value: programs.length,       color: 'text-primary', to: '/auditor/system-overview' },
    { label: 'Unread Notifications', value: unread.length,         color: unread.length > 0 ? 'text-warning' : '', to: '/auditor/notifications' },
  ]

  const QUICK_ACTIONS = [
    { label: 'Audits',            to: '/auditor/audits',            desc: `${openAudits.length} open audit(s) pending review.` },
    { label: 'Compliance Review', to: '/auditor/compliance-review', desc: `${compIssues.length} compliance issue(s) flagged.` },
    { label: 'Reports',           to: '/auditor/reports',           desc: 'Browse system-wide health reports.' },
    { label: 'System Overview',   to: '/auditor/system-overview',   desc: 'Full governance health summary.' },
    { label: 'Notifications',     to: '/auditor/notifications',     desc: `${unread.length} unread alert(s).` },
  ]

  return (
    <DashboardLayout>
      <div className="mb-4">
        <h2 className="page-title">Government Auditor Console</h2>
        <p className="text-muted">
          Welcome, <strong>{user?.name}</strong>. Review system compliance, audit records, and governance metrics.
        </p>
      </div>

      {loading ? <Loader message="Loading governance dashboard…" /> : (
        <>
          {/* Stat cards */}
          <div className="row g-3 mb-4">
            {STATS.map(({ label, value, color, to }) => (
              <div key={label} className="col-md-6 col-xl-3">
                <Link to={to} className="text-decoration-none">
                  <div className="card card-surface h-100">
                    <div className="card-body">
                      <div className="text-muted small mb-1">{label}</div>
                      <h4 className={`mb-0 ${color}`}>{value}</h4>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          {/* Quick actions */}
          <div className="row g-4 mb-4">
            {QUICK_ACTIONS.map(({ label, to, desc }) => (
              <div key={to} className="col-md-6 col-xl">
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
            {/* Recent audits */}
            <div className="col-lg-5">
              <Card title="Recent Audits">
                {recentAudits.length === 0 ? (
                  <p className="text-muted small mb-0">No audits found.</p>
                ) : (
                  <ul className="list-unstyled mb-0">
                    {recentAudits.map(a => (
                      <li key={a.id} className="d-flex justify-content-between align-items-start py-2 border-bottom">
                        <div>
                          <div className="small fw-medium">{a.scope} Audit</div>
                          <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                            {a.date} · {a.findings?.slice(0, 45)}{a.findings?.length > 45 ? '…' : ''}
                          </div>
                        </div>
                        <StatusBadge status={a.status} />
                      </li>
                    ))}
                  </ul>
                )}
                <div className="mt-3">
                  <Link to="/auditor/audits" className="btn btn-sm btn-outline-primary">View all audits</Link>
                </div>
              </Card>
            </div>

            {/* Non-compliant records */}
            <div className="col-lg-4">
              <Card title="Compliance Issues">
                {compIssues.length === 0 ? (
                  <div className="alert alert-success py-2 mb-0">✅ No compliance issues found.</div>
                ) : (
                  <ul className="list-unstyled mb-0">
                    {compIssues.slice(0, 5).map(r => (
                      <li key={r.id} className="d-flex justify-content-between align-items-center py-2 border-bottom">
                        <div>
                          <div className="small fw-medium">Entity #{r.entityId} — {r.type}</div>
                          <div className="text-muted" style={{ fontSize: '0.75rem' }}>{r.date}</div>
                        </div>
                        <StatusBadge status={r.result} />
                      </li>
                    ))}
                  </ul>
                )}
                <div className="mt-3">
                  <Link to="/auditor/compliance-review" className="btn btn-sm btn-outline-danger">Review →</Link>
                </div>
              </Card>
            </div>

            {/* Recent reports */}
            <div className="col-lg-3">
              <Card title="Recent Reports">
                {recentReports.length === 0 ? (
                  <p className="text-muted small mb-0">No reports found.</p>
                ) : (
                  <ul className="list-unstyled mb-0">
                    {recentReports.map(r => (
                      <li key={r.id} className="py-2 border-bottom">
                        <div className="small fw-medium">Report #{r.id}</div>
                        <div className="d-flex justify-content-between align-items-center mt-1">
                          <div className="text-muted" style={{ fontSize: '0.75rem' }}>{r.generatedDate}</div>
                          <StatusBadge status={r.scope} />
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="mt-3">
                  <Link to="/auditor/reports" className="btn btn-sm btn-outline-primary">View all</Link>
                </div>
              </Card>
            </div>
          </div>

          {/* Active outbreak alert */}
          {activeOutbreaks.length > 0 && (
            <div className="row g-4 mt-0">
              <div className="col-12">
                <div className="alert alert-danger d-flex align-items-center gap-2 mb-0">
                  <span className="fs-5">⚠️</span>
                  <div>
                    <strong>{activeOutbreaks.length} active outbreak{activeOutbreaks.length > 1 ? 's' : ''} under surveillance:</strong>{' '}
                    {activeOutbreaks.map(o => `${o.diseaseType} (${o.location})`).join(' · ')}.{' '}
                    <Link to="/auditor/system-overview" className="alert-link">View system overview →</Link>
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

export default AuditorDashboard
