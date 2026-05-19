import { useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Loader from '../../components/common/Loader'
import StatusBadge from '../../components/common/StatusBadge'
import { getComplianceRecordsByEntityId } from '../../api/complianceApi'

const EntityReviewPage = () => {
  const [entityId, setEntityId] = useState('')
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [error, setError] = useState('')

  const handleSearch = async e => {
    e.preventDefault()
    if (!entityId.trim()) { setError('Entity ID is required.'); return }
    setError('')
    setLoading(true)
    setSearched(false)
    try {
      const res = await getComplianceRecordsByEntityId(entityId)
      setRecords(res.data?.data ?? [])
      setSearched(true)
    } catch (err) {
      if (err?.response?.status === 403) setError('Access denied. Your role may not have permission to view entity records.')
      else if (err?.response?.status === 404) { setRecords([]); setSearched(true) }
      else if (!err?.response) setError('Backend server is not reachable.')
      else setError(err?.response?.data?.message || 'Failed to load records for this entity')
    } finally {
      setLoading(false)
    }
  }

  const passCount    = records.filter(r => r.result === 'PASS').length
  const failCount    = records.filter(r => ['FAIL', 'NON_COMPLIANT'].includes(r.result)).length
  const warningCount = records.filter(r => r.result === 'WARNING').length

  return (
    <DashboardLayout>
      <div className="mb-4">
        <h2 className="page-title">Entity Review</h2>
        <p className="text-muted">Review all compliance records associated with a specific entity ID.</p>
      </div>

      {/* Search form */}
      <Card className="mb-4">
        <form onSubmit={handleSearch} noValidate>
          <div className="row g-3 align-items-end">
            <div className="col-md-5">
              <label className="form-label fw-medium">Entity ID</label>
              <input
                type="number"
                className="form-control"
                placeholder="Enter entity ID (e.g. 10)"
                value={entityId}
                onChange={e => { setEntityId(e.target.value); setError('') }}
                min="1"
              />
              {error && <div className="text-danger small mt-1">{error}</div>}
            </div>
            <div className="col-auto">
              <Button type="submit" disabled={loading}>
                {loading ? 'Searching…' : 'Search'}
              </Button>
            </div>
            {searched && (
              <div className="col-auto">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => { setEntityId(''); setRecords([]); setSearched(false); setError('') }}
                >
                  Clear
                </button>
              </div>
            )}
          </div>
        </form>
      </Card>

      {loading && <Loader message="Fetching compliance records…" />}

      {/* Summary badges */}
      {searched && !loading && records.length > 0 && (
        <div className="row g-3 mb-4">
          {[
            { label: 'Total Records', value: records.length, color: '' },
            { label: 'Passed',        value: passCount,      color: 'text-success' },
            { label: 'Failed / Non-Compliant', value: failCount, color: failCount > 0 ? 'text-danger' : '' },
            { label: 'Warnings',      value: warningCount,   color: warningCount > 0 ? 'text-warning' : '' },
          ].map(({ label, value, color }) => (
            <div key={label} className="col-md-3">
              <div className="card card-surface text-center py-3">
                <div className={`fw-bold fs-4 ${color}`}>{value}</div>
                <div className="text-muted small">{label}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Results */}
      {searched && !loading && (
        records.length === 0 ? (
          <div className="alert alert-info">
            No compliance records found for entity ID <strong>{entityId}</strong>.
          </div>
        ) : (
          <Card title={`Compliance Records for Entity #${entityId}`}>
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Type</th>
                    <th>Result</th>
                    <th>Date</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map(r => (
                    <tr key={r.id}>
                      <td className="fw-medium">#{r.id}</td>
                      <td><StatusBadge status={r.type} /></td>
                      <td><StatusBadge status={r.result} /></td>
                      <td>{r.date}</td>
                      <td className="text-muted small">{r.notes ?? '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )
      )}

      {!searched && !loading && (
        <div className="alert alert-secondary">
          Enter an entity ID above to review its compliance history.
        </div>
      )}
    </DashboardLayout>
  )
}

export default EntityReviewPage
