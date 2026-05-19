import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Card from '../../components/common/Card'
import Loader from '../../components/common/Loader'
import StatusBadge from '../../components/common/StatusBadge'
import { getAllDiseaseCases } from '../../api/diseaseCaseApi'
import { getAllOutbreaks } from '../../api/outbreakApi'
import { getVaccinationPrograms } from '../../api/vaccinationApi'

const SystemOverviewPage = () => {
  const [cases, setCases] = useState([])
  const [outbreaks, setOutbreaks] = useState([])
  const [programs, setPrograms] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.allSettled([
      getAllDiseaseCases(),
      getAllOutbreaks(),
      getVaccinationPrograms(),
    ]).then(([caseRes, obRes, progRes]) => {
      if (caseRes.status === 'fulfilled') setCases(caseRes.value.data?.data ?? [])
      if (obRes.status === 'fulfilled') setOutbreaks(obRes.value.data?.data ?? [])
      if (progRes.status === 'fulfilled') setPrograms(progRes.value.data?.data ?? [])
    }).finally(() => setLoading(false))
  }, [])

  // Case metrics
  const totalCases      = cases.length
  const activeCases     = cases.filter(c => ['REPORTED', 'UNDER_TREATMENT'].includes(c.status))
  const recoveredCases  = cases.filter(c => c.status === 'RECOVERED')
  const closedCases     = cases.filter(c => c.status === 'CLOSED')
  const recoveryRate    = totalCases > 0 ? Math.round((recoveredCases.length / totalCases) * 100) : 0
  const activeRate      = totalCases > 0 ? Math.round((activeCases.length / totalCases) * 100) : 0

  // Disease type breakdown
  const diseaseFreq = cases.reduce((acc, c) => {
    acc[c.diseaseType] = (acc[c.diseaseType] || 0) + 1
    return acc
  }, {})
  const topDiseases = Object.entries(diseaseFreq).sort((a, b) => b[1] - a[1]).slice(0, 6)

  // Outbreak metrics
  const activeOutbreaks    = outbreaks.filter(o => ['DETECTED', 'ACTIVE'].includes(o.status))
  const containedOutbreaks = outbreaks.filter(o => o.status === 'CONTAINED')
  const closedOutbreaks    = outbreaks.filter(o => o.status === 'CLOSED')
  const recentOutbreaks    = [...outbreaks].sort((a, b) => new Date(b.startDate) - new Date(a.startDate)).slice(0, 5)

  // Vaccination metrics
  const activePrograms    = programs.filter(p => p.status === 'ACTIVE')
  const upcomingPrograms  = programs.filter(p => p.status === 'UPCOMING')
  const completedPrograms = programs.filter(p => p.status === 'COMPLETED')

  const CASE_STATS = [
    { label: 'Total Cases',      value: totalCases,            color: '' },
    { label: 'Active',           value: activeCases.length,    color: activeCases.length > 0 ? 'text-warning' : '' },
    { label: 'Recovered',        value: recoveredCases.length, color: 'text-success' },
    { label: 'Closed',           value: closedCases.length,    color: 'text-secondary' },
    { label: 'Recovery Rate',    value: `${recoveryRate}%`,    color: recoveryRate >= 70 ? 'text-success' : 'text-warning' },
    { label: 'Active Rate',      value: `${activeRate}%`,      color: activeRate > 30 ? 'text-danger' : 'text-success' },
  ]

  const OUTBREAK_STATS = [
    { label: 'Total Outbreaks',  value: outbreaks.length,          color: '' },
    { label: 'Active',           value: activeOutbreaks.length,    color: activeOutbreaks.length > 0 ? 'text-danger' : 'text-success' },
    { label: 'Contained',        value: containedOutbreaks.length, color: 'text-warning' },
    { label: 'Closed',           value: closedOutbreaks.length,    color: 'text-success' },
  ]

  const VAX_STATS = [
    { label: 'Total Programs',   value: programs.length,           color: '' },
    { label: 'Active',           value: activePrograms.length,     color: 'text-success' },
    { label: 'Upcoming',         value: upcomingPrograms.length,   color: 'text-primary' },
    { label: 'Completed',        value: completedPrograms.length,  color: 'text-secondary' },
  ]

  return (
    <DashboardLayout>
      <div className="mb-4">
        <h2 className="page-title">System Overview</h2>
        <p className="text-muted">Governance-level health system analytics. Read-only surveillance view.</p>
      </div>

      {loading ? <Loader message="Loading system data…" /> : (
        <>
          {/* Active outbreak alert */}
          {activeOutbreaks.length > 0 && (
            <div className="alert alert-danger d-flex align-items-center gap-2 mb-4">
              <span className="fs-5">⚠️</span>
              <div>
                <strong>{activeOutbreaks.length} active outbreak{activeOutbreaks.length > 1 ? 's' : ''} under surveillance:</strong>{' '}
                {activeOutbreaks.map(o => `${o.diseaseType} (${o.location})`).join(' · ')}.
              </div>
            </div>
          )}

          {/* ── Disease Cases ── */}
          <h5 className="fw-semibold mb-3 border-bottom pb-2">🦠 Disease Case Surveillance</h5>
          <div className="row g-3 mb-4">
            {CASE_STATS.map(({ label, value, color }) => (
              <div key={label} className="col-md-6 col-xl-2">
                <div className="card card-surface text-center py-3">
                  <div className={`fw-bold fs-4 ${color}`}>{value}</div>
                  <div className="text-muted small">{label}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="row g-4 mb-4">
            {/* Disease type breakdown */}
            <div className="col-lg-6">
              <Card title="Cases by Disease Type">
                {topDiseases.length === 0 ? (
                  <p className="text-muted small mb-0">No case data available.</p>
                ) : (
                  <ul className="list-unstyled mb-0">
                    {topDiseases.map(([disease, count]) => (
                      <li key={disease} className="d-flex justify-content-between align-items-center py-2 border-bottom">
                        <span className="small">{disease}</span>
                        <div className="d-flex align-items-center gap-2">
                          <div
                            className="bg-primary rounded"
                            style={{ width: `${Math.min((count / totalCases) * 120, 120)}px`, height: '6px' }}
                          />
                          <span className="badge bg-primary">{count}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </Card>
            </div>

            {/* Case status breakdown */}
            <div className="col-lg-6">
              <Card title="Cases by Status">
                {cases.length === 0 ? (
                  <p className="text-muted small mb-0">No case data available.</p>
                ) : (
                  <ul className="list-unstyled mb-0">
                    {Object.entries(
                      cases.reduce((acc, c) => { acc[c.status] = (acc[c.status] || 0) + 1; return acc }, {})
                    ).map(([status, count]) => (
                      <li key={status} className="d-flex justify-content-between align-items-center py-2 border-bottom">
                        <StatusBadge status={status} />
                        <span className="fw-medium">{count}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </Card>
            </div>
          </div>

          {/* ── Outbreaks ── */}
          <h5 className="fw-semibold mb-3 border-bottom pb-2">🌍 Outbreak Surveillance</h5>
          <div className="row g-3 mb-4">
            {OUTBREAK_STATS.map(({ label, value, color }) => (
              <div key={label} className="col-md-6 col-xl-3">
                <div className="card card-surface text-center py-3">
                  <div className={`fw-bold fs-4 ${color}`}>{value}</div>
                  <div className="text-muted small">{label}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="row g-4 mb-4">
            <div className="col-12">
              <Card title="Recent Outbreaks">
                {recentOutbreaks.length === 0 ? (
                  <p className="text-muted small mb-0">No outbreaks recorded.</p>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>ID</th>
                          <th>Disease Type</th>
                          <th>Location</th>
                          <th>Start Date</th>
                          <th>End Date</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentOutbreaks.map(o => (
                          <tr key={o.id} className={['DETECTED', 'ACTIVE'].includes(o.status) ? 'table-danger' : ''}>
                            <td className="fw-medium">#{o.id}</td>
                            <td className="fw-medium">{o.diseaseType}</td>
                            <td className="text-muted small">📍 {o.location}</td>
                            <td>{o.startDate}</td>
                            <td>{o.endDate ?? '—'}</td>
                            <td><StatusBadge status={o.status} /></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </Card>
            </div>
          </div>

          {/* ── Vaccination Programs ── */}
          <h5 className="fw-semibold mb-3 border-bottom pb-2">💉 Vaccination Program Status</h5>
          <div className="row g-3 mb-4">
            {VAX_STATS.map(({ label, value, color }) => (
              <div key={label} className="col-md-6 col-xl-3">
                <div className="card card-surface text-center py-3">
                  <div className={`fw-bold fs-4 ${color}`}>{value}</div>
                  <div className="text-muted small">{label}</div>
                </div>
              </div>
            ))}
          </div>

          {programs.length > 0 && (
            <Card title="Vaccination Programs">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>ID</th>
                      <th>Title</th>
                      <th>Vaccine Type</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {programs.map(p => (
                      <tr key={p.id}>
                        <td className="fw-medium">#{p.id}</td>
                        <td>{p.title}</td>
                        <td className="text-muted small">{p.vaccineType ?? '—'}</td>
                        <td>{p.startDate}</td>
                        <td>{p.endDate ?? '—'}</td>
                        <td><StatusBadge status={p.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </>
      )}
    </DashboardLayout>
  )
}

export default SystemOverviewPage
