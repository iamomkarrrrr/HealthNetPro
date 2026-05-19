import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Card from '../../components/common/Card'
import Loader from '../../components/common/Loader'
import StatusBadge from '../../components/common/StatusBadge'
import { getAllDiseaseCases } from '../../api/diseaseCaseApi'
import { getAllOutbreaks } from '../../api/outbreakApi'
import { getVaccinationPrograms } from '../../api/vaccinationApi'
import { getAllCitizens } from '../../api/citizenApi'

const OperationsOverviewPage = () => {
  const [cases, setCases] = useState([])
  const [outbreaks, setOutbreaks] = useState([])
  const [programs, setPrograms] = useState([])
  const [citizens, setCitizens] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.allSettled([
      getAllDiseaseCases(),
      getAllOutbreaks(),
      getVaccinationPrograms(),
      getAllCitizens(),
    ]).then(([dc, ob, vp, ci]) => {
      if (dc.status === 'fulfilled') setCases(dc.value.data?.data ?? [])
      if (ob.status === 'fulfilled') setOutbreaks(ob.value.data?.data ?? [])
      if (vp.status === 'fulfilled') setPrograms(vp.value.data?.data ?? [])
      if (ci.status === 'fulfilled') setCitizens(ci.value.data?.data ?? [])
    }).finally(() => setLoading(false))
  }, [])

  const activeCases = cases.filter(c => ['REPORTED', 'UNDER_TREATMENT'].includes(c.status))
  const recoveredCases = cases.filter(c => c.status === 'RECOVERED')
  const activeOutbreaks = outbreaks.filter(o => ['DETECTED', 'ACTIVE'].includes(o.status))
  const containedOutbreaks = outbreaks.filter(o => ['CONTAINED', 'CLOSED'].includes(o.status))
  const activePrograms = programs.filter(p => ['ACTIVE', 'UPCOMING'].includes(p.status))
  const completedPrograms = programs.filter(p => p.status === 'COMPLETED')

  const SUMMARY = [
    { label: 'Total Citizens', value: citizens.length, color: '', link: '/health-admin/citizens' },
    { label: 'Active Cases', value: activeCases.length, color: activeCases.length > 0 ? 'text-warning' : '', link: null },
    { label: 'Recovered Cases', value: recoveredCases.length, color: 'text-success', link: null },
    { label: 'Active Outbreaks', value: activeOutbreaks.length, color: activeOutbreaks.length > 0 ? 'text-danger' : 'text-success', link: null },
    { label: 'Contained / Closed Outbreaks', value: containedOutbreaks.length, color: 'text-success', link: null },
    { label: 'Active Vax Programs', value: activePrograms.length, color: 'text-primary', link: '/health-admin/vaccination-programs' },
    { label: 'Completed Vax Programs', value: completedPrograms.length, color: 'text-secondary', link: '/health-admin/vaccination-programs' },
  ]

  const recentCases = [...cases].sort((a, b) => new Date(b.diagnosisDate) - new Date(a.diagnosisDate)).slice(0, 5)
  const recentOutbreaks = [...outbreaks].sort((a, b) => new Date(b.startDate) - new Date(a.startDate)).slice(0, 5)

  return (
    <DashboardLayout>
      <div className="mb-4">
        <h2 className="page-title">Operations Overview</h2>
        <p className="text-muted">Administrative operational health summary. Read-only view.</p>
      </div>

      {loading ? <Loader message="Loading operations data…" /> : (
        <>
          {activeOutbreaks.length > 0 && (
            <div className="alert alert-danger d-flex align-items-center gap-2 mb-4">
              <span className="fs-5">⚠️</span>
              <div>
                <strong>{activeOutbreaks.length} active outbreak{activeOutbreaks.length > 1 ? 's' : ''}:</strong>{' '}
                {activeOutbreaks.map(o => `${o.diseaseType} (${o.location})`).join(' · ')}.
              </div>
            </div>
          )}

          <div className="row g-4 mb-4">
            {SUMMARY.map(({ label, value, color, link }) => (
              <div key={label} className="col-md-6 col-xl-3">
                <div className="card card-surface h-100">
                  <div className="card-body">
                    <div className="text-muted small mb-1">{label}</div>
                    <h4 className={`mb-0 ${color}`}>{value}</h4>
                    {link && <Link to={link} className="small text-primary">View →</Link>}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="row g-4 mb-4">
            <div className="col-lg-6">
              <Card title="Recent Disease Cases">
                {recentCases.length === 0 ? (
                  <p className="text-muted small mb-0">No disease cases found.</p>
                ) : (
                  <ul className="list-unstyled mb-0">
                    {recentCases.map(c => (
                      <li key={c.id} className="d-flex justify-content-between align-items-center py-2 border-bottom">
                        <div>
                          <div className="small fw-medium">{c.diseaseType}</div>
                          <div className="text-muted" style={{ fontSize: '0.75rem' }}>Citizen #{c.citizenId} · {c.diagnosisDate}</div>
                        </div>
                        <StatusBadge status={c.status} />
                      </li>
                    ))}
                  </ul>
                )}
              </Card>
            </div>
            <div className="col-lg-6">
              <Card title="Recent Outbreaks">
                {recentOutbreaks.length === 0 ? (
                  <p className="text-muted small mb-0">No outbreaks found.</p>
                ) : (
                  <ul className="list-unstyled mb-0">
                    {recentOutbreaks.map(o => (
                      <li key={o.id} className="d-flex justify-content-between align-items-center py-2 border-bottom">
                        <div>
                          <div className="small fw-medium">{o.diseaseType}</div>
                          <div className="text-muted" style={{ fontSize: '0.75rem' }}>📍 {o.location} · {o.startDate}</div>
                        </div>
                        <StatusBadge status={o.status} />
                      </li>
                    ))}
                  </ul>
                )}
              </Card>
            </div>
          </div>

          <Card title="Active Vaccination Programs">
            {activePrograms.length === 0 ? (
              <p className="text-muted small mb-0">No active or upcoming vaccination programs.</p>
            ) : (
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
                    {activePrograms.map(p => (
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
            )}
          </Card>
        </>
      )}
    </DashboardLayout>
  )
}

export default OperationsOverviewPage
