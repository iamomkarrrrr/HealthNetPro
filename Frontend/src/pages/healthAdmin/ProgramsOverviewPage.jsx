import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Card from '../../components/common/Card'
import Loader from '../../components/common/Loader'
import StatusBadge from '../../components/common/StatusBadge'
import { getVaccinationPrograms } from '../../api/vaccinationApi'
import { getAllDiseaseCases } from '../../api/diseaseCaseApi'
import { getAllOutbreaks } from '../../api/outbreakApi'
import { getReportsByScope } from '../../api/reportingApi'

const ProgramsOverviewPage = () => {
  const [programs, setPrograms] = useState([])
  const [cases, setCases] = useState([])
  const [outbreaks, setOutbreaks] = useState([])
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.allSettled([
      getVaccinationPrograms(),
      getAllDiseaseCases(),
      getAllOutbreaks(),
      getReportsByScope('VACCINATION'),
    ]).then(([vp, dc, ob, rp]) => {
      if (vp.status === 'fulfilled') setPrograms(vp.value.data?.data ?? [])
      if (dc.status === 'fulfilled') setCases(dc.value.data?.data ?? [])
      if (ob.status === 'fulfilled') setOutbreaks(ob.value.data?.data ?? [])
      if (rp.status === 'fulfilled') setReports(rp.value.data?.data ?? [])
    }).finally(() => setLoading(false))
  }, [])

  const activePrograms = programs.filter(p => p.status === 'ACTIVE')
  const upcomingPrograms = programs.filter(p => p.status === 'UPCOMING')
  const completedPrograms = programs.filter(p => p.status === 'COMPLETED')
  const activeOutbreaks = outbreaks.filter(o => ['DETECTED', 'ACTIVE'].includes(o.status))
  const activeCases = cases.filter(c => ['REPORTED', 'UNDER_TREATMENT'].includes(c.status))

  const SUMMARY = [
    { label: 'Active Programs', value: activePrograms.length, color: 'text-success' },
    { label: 'Upcoming Programs', value: upcomingPrograms.length, color: 'text-primary' },
    { label: 'Completed Programs', value: completedPrograms.length, color: 'text-secondary' },
    { label: 'Active Outbreaks', value: activeOutbreaks.length, color: activeOutbreaks.length > 0 ? 'text-danger' : 'text-success' },
    { label: 'Active Disease Cases', value: activeCases.length, color: activeCases.length > 0 ? 'text-warning' : '' },
    { label: 'Vaccination Reports', value: reports.length, color: '' },
  ]

  return (
    <DashboardLayout>
      <div className="mb-4">
        <h2 className="page-title">Programs Overview</h2>
        <p className="text-muted">High-level overview of public health programs and operational status.</p>
      </div>

      {loading ? <Loader message="Loading programs overview…" /> : (
        <>
          <div className="row g-4 mb-4">
            {SUMMARY.map(({ label, value, color }) => (
              <div key={label} className="col-md-6 col-xl-4">
                <div className="card card-surface h-100">
                  <div className="card-body text-center">
                    <div className="text-muted small mb-1">{label}</div>
                    <h3 className={`mb-0 ${color}`}>{value}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="row g-4 mb-4">
            <div className="col-lg-6">
              <Card
                header={
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Vaccination Programs</h5>
                    <Link to="/health-admin/vaccination-programs" className="btn btn-sm btn-outline-primary">Manage</Link>
                  </div>
                }
              >
                {programs.length === 0 ? (
                  <p className="text-muted small mb-0">No vaccination programs found.</p>
                ) : (
                  <ul className="list-unstyled mb-0">
                    {programs.slice(0, 6).map(p => (
                      <li key={p.id} className="d-flex justify-content-between align-items-center py-2 border-bottom">
                        <div>
                          <div className="small fw-medium">{p.title}</div>
                          <div className="text-muted" style={{ fontSize: '0.75rem' }}>Start: {p.startDate}{p.endDate ? ` · End: ${p.endDate}` : ''}</div>
                        </div>
                        <StatusBadge status={p.status} />
                      </li>
                    ))}
                  </ul>
                )}
              </Card>
            </div>
            <div className="col-lg-6">
              <Card title="Active Outbreaks">
                {activeOutbreaks.length === 0 ? (
                  <div className="alert alert-success py-2 mb-0">✅ No active outbreaks at this time.</div>
                ) : (
                  <ul className="list-unstyled mb-0">
                    {activeOutbreaks.map(o => (
                      <li key={o.id} className="d-flex justify-content-between align-items-center py-2 border-bottom">
                        <div>
                          <div className="small fw-medium text-danger">{o.diseaseType}</div>
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

          <div className="row g-4">
            <div className="col-lg-6">
              <Card title="Active Disease Cases">
                {activeCases.length === 0 ? (
                  <p className="text-muted small mb-0">No active disease cases.</p>
                ) : (
                  <ul className="list-unstyled mb-0">
                    {activeCases.slice(0, 5).map(c => (
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
              <Card
                header={
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Recent Vaccination Reports</h5>
                    <Link to="/health-admin/reports" className="btn btn-sm btn-outline-primary">View all</Link>
                  </div>
                }
              >
                {reports.length === 0 ? (
                  <p className="text-muted small mb-0">No vaccination reports found.</p>
                ) : (
                  <ul className="list-unstyled mb-0">
                    {reports.slice(0, 4).map(r => (
                      <li key={r.id} className="d-flex justify-content-between align-items-center py-2 border-bottom">
                        <div>
                          <div className="small fw-medium">Report #{r.id}</div>
                          <div className="text-muted" style={{ fontSize: '0.75rem' }}>{r.generatedDate}</div>
                        </div>
                        <StatusBadge status={r.scope} />
                      </li>
                    ))}
                  </ul>
                )}
              </Card>
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  )
}

export default ProgramsOverviewPage
