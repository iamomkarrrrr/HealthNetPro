import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Card from '../../components/common/Card'
import Loader from '../../components/common/Loader'
import ErrorMessage from '../../components/common/ErrorMessage'
import StatusBadge from '../../components/common/StatusBadge'
import useCitizen from '../../hooks/useCitizen'
import { getImmunizationsByCitizenId } from '../../api/immunizationApi'

const VaccinationRecordsPage = () => {
  const { citizenId, loading: citizenLoading } = useCitizen()
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!citizenId) return
    setLoading(true)
    getImmunizationsByCitizenId(citizenId)
      .then(res => setRecords(res.data?.data ?? []))
      .catch(err => setError(err?.response?.data?.message || 'Failed to load vaccination records'))
      .finally(() => setLoading(false))
  }, [citizenId])

  if (citizenLoading || loading) return <DashboardLayout><Loader message="Loading vaccination records…" /></DashboardLayout>

  return (
    <DashboardLayout>
      <div className="mb-4">
        <h2 className="page-title">Vaccination Records</h2>
        <p className="text-muted">Your immunization history on record.</p>
      </div>

      {error && <ErrorMessage message={error} />}

      {!citizenId && (
        <div className="alert alert-warning">Please create your citizen profile first.</div>
      )}

      {citizenId && records.length === 0 && !error && (
        <div className="alert alert-info">No vaccination records found for your profile.</div>
      )}

      {records.length > 0 && (
        <>
          {/* Summary */}
          <div className="row g-3 mb-4">
            {['GIVEN', 'PENDING', 'MISSED'].map(status => (
              <div key={status} className="col-md-4">
                <div className="card card-surface text-center py-3">
                  <div className="fw-bold fs-4">{records.filter(r => r.status === status).length}</div>
                  <StatusBadge status={status} />
                </div>
              </div>
            ))}
          </div>

          {/* Records table */}
          <Card title="Immunization History">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Vaccine</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map(r => (
                    <tr key={r.id}>
                      <td className="fw-medium">{r.vaccineType}</td>
                      <td className="text-muted">{r.date}</td>
                      <td><StatusBadge status={r.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </DashboardLayout>
  )
}

export default VaccinationRecordsPage
