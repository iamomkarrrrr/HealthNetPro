import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Card from '../../components/common/Card'
import Loader from '../../components/common/Loader'
import ErrorMessage from '../../components/common/ErrorMessage'
import StatusBadge from '../../components/common/StatusBadge'
import { getVaccinationPrograms } from '../../api/vaccinationApi'

const VaccinationSchedulesPage = () => {
  const [programs, setPrograms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('ALL')

  useEffect(() => {
    getVaccinationPrograms()
      .then(res => setPrograms(res.data?.data ?? []))
      .catch(err => setError(err?.response?.data?.message || 'Failed to load vaccination programs'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = filter === 'ALL' ? programs : programs.filter(p => p.status === filter)

  if (loading) return <DashboardLayout><Loader message="Loading vaccination schedules…" /></DashboardLayout>

  return (
    <DashboardLayout>
      <div className="mb-4">
        <h2 className="page-title">Vaccination Schedules</h2>
        <p className="text-muted">Browse active and upcoming vaccination programs in your area.</p>
      </div>

      {error && <ErrorMessage message={error} />}

      {/* Filter tabs */}
      <div className="d-flex gap-2 mb-4">
        {['ALL', 'UPCOMING', 'ACTIVE', 'COMPLETED'].map(f => (
          <button
            key={f}
            className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="alert alert-info">No vaccination programs found for the selected filter.</div>
      )}

      <div className="row g-4">
        {filtered.map(p => (
          <div key={p.id} className="col-md-6 col-xl-4">
            <Card>
              <div className="d-flex justify-content-between align-items-start mb-2">
                <h6 className="mb-0">{p.title}</h6>
                <StatusBadge status={p.status} />
              </div>
              <p className="text-muted small mb-3">{p.description}</p>
              <div className="d-flex gap-3 text-muted small">
                <span>🗓 Start: {p.startDate}</span>
                {p.endDate && <span>End: {p.endDate}</span>}
              </div>
              <div className="mt-2 text-muted small">
                <span className="fw-medium">Vaccine:</span> {p.vaccineType}
              </div>
            </Card>
          </div>
        ))}
      </div>
    </DashboardLayout>
  )
}

export default VaccinationSchedulesPage
