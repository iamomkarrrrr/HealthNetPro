import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Card from '../../components/common/Card'
import Loader from '../../components/common/Loader'
import StatusBadge from '../../components/common/StatusBadge'
import { getAllDiseaseCases } from '../../api/diseaseCaseApi'

const DiseaseTrendsPage = () => {
  const [cases, setCases] = useState([])
  const [loading, setLoading] = useState(true)
  const [accessDenied, setAccessDenied] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    getAllDiseaseCases()
      .then(res => setCases(res.data?.data ?? []))
      .catch(err => {
        if (err?.response?.status === 403) setAccessDenied(true)
        else if (!err?.response) setError('Backend server is not reachable.')
        else setError(err?.response?.data?.message || 'Failed to load disease cases')
      })
      .finally(() => setLoading(false))
  }, [])

  // Frontend aggregations
  const total = cases.length
  const byStatus = cases.reduce((acc, c) => { acc[c.status] = (acc[c.status] || 0) + 1; return acc }, {})
  const byDisease = cases.reduce((acc, c) => { acc[c.diseaseType] = (acc[c.diseaseType] || 0) + 1; return acc }, {})
  const topDiseases = Object.entries(byDisease).sort((a, b) => b[1] - a[1])
  const recent = [...cases].sort((a, b) => new Date(b.diagnosisDate) - new Date(a.diagnosisDate)).slice(0, 10)

  if (loading) return <DashboardLayout><Loader message="Loading disease trends…" /></DashboardLayout>

  return (
    <DashboardLayout>
      <div className="mb-4">
        <h2 className="page-title">Disease Trends</h2>
        <p className="text-muted">Aggregated analytics from all reported disease cases. Read-only view.</p>
      </div>

      {accessDenied && (
        <div className="alert alert-warning">
          <strong>⚠️ Access Denied</strong>
          <p className="mb-0 mt-1">Disease trend data is currently restricted by backend permissions. EPIDEMIOLOGIST role requires read access to <code>GET /api/v1/disease-cases</code>.</p>
        </div>
      )}
      {error && <div className="alert alert-danger">{error}</div>}

      {!accessDenied && !error && (
        <>
          {/* Summary stat cards */}
          <div className="row g-4 mb-4">
            {[
              { label: 'Total Cases', value: total, color: '' },
              { label: 'Reported', value: byStatus['REPORTED'] ?? 0, color: 'text-primary' },
              { label: 'Under Treatment', value: byStatus['UNDER_TREATMENT'] ?? 0, color: 'text-warning' },
              { label: 'Recovered', value: byStatus['RECOVERED'] ?? 0, color: 'text-success' },
              { label: 'Closed', value: byStatus['CLOSED'] ?? 0, color: 'text-secondary' },
            ].map(({ label, value, color }) => (
              <div key={label} className="col-md-6 col-xl">
                <div className="card card-surface h-100">
                  <div className="card-body text-center">
                    <div className="text-muted small mb-1">{label}</div>
                    <h4 className={`mb-0 ${color}`}>{value}</h4>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="row g-4 mb-4">
            {/* Disease type breakdown */}
            <div className="col-lg-5">
              <Card title="Cases by Disease Type">
                {topDiseases.length === 0 ? (
                  <p className="text-muted small mb-0">No data available.</p>
                ) : (
                  <ul className="list-unstyled mb-0">
                    {topDiseases.map(([disease, count]) => (
                      <li key={disease} className="d-flex justify-content-between align-items-center py-2 border-bottom">
                        <span className="small">{disease}</span>
                        <div className="d-flex align-items-center gap-2">
                          <div className="bg-primary rounded" style={{ width: `${Math.min((count / total) * 120, 120)}px`, height: '6px' }} />
                          <span className="badge bg-primary">{count}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </Card>
            </div>

            {/* Status breakdown */}
            <div className="col-lg-4">
              <Card title="Cases by Status">
                {Object.keys(byStatus).length === 0 ? (
                  <p className="text-muted small mb-0">No data available.</p>
                ) : (
                  <ul className="list-unstyled mb-0">
                    {Object.entries(byStatus).map(([status, count]) => (
                      <li key={status} className="d-flex justify-content-between align-items-center py-2 border-bottom">
                        <StatusBadge status={status} />
                        <span className="fw-medium">{count}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </Card>
            </div>

            {/* Active rate */}
            <div className="col-lg-3">
              <Card title="Active Rate">
                <div className="text-center py-2">
                  <div className="display-6 fw-bold text-warning">
                    {total > 0 ? Math.round(((byStatus['REPORTED'] ?? 0) + (byStatus['UNDER_TREATMENT'] ?? 0)) / total * 100) : 0}%
                  </div>
                  <div className="text-muted small mt-1">Cases still active</div>
                </div>
                <div className="text-center py-2">
                  <div className="display-6 fw-bold text-success">
                    {total > 0 ? Math.round((byStatus['RECOVERED'] ?? 0) / total * 100) : 0}%
                  </div>
                  <div className="text-muted small mt-1">Recovery rate</div>
                </div>
              </Card>
            </div>
          </div>

          {/* Recent cases table */}
          <Card title="Recent Cases (Latest 10)">
            {recent.length === 0 ? (
              <p className="text-muted small mb-0">No cases found.</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>ID</th>
                      <th>Disease Type</th>
                      <th>Citizen ID</th>
                      <th>Doctor ID</th>
                      <th>Diagnosis Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recent.map(c => (
                      <tr key={c.id}>
                        <td className="fw-medium">#{c.id}</td>
                        <td>{c.diseaseType}</td>
                        <td>{c.citizenId}</td>
                        <td>{c.doctorId}</td>
                        <td>{c.diagnosisDate}</td>
                        <td><StatusBadge status={c.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </>
      )}
    </DashboardLayout>
  )
}

export default DiseaseTrendsPage
