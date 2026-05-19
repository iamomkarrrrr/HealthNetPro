import { useState, useEffect, useCallback } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Card from '../../components/common/Card'
import Loader from '../../components/common/Loader'
import StatusBadge from '../../components/common/StatusBadge'
import { getComplianceRecordsByType } from '../../api/complianceApi'

const TYPES = ['OUTBREAK', 'CASE', 'VACCINATION']

const ComplianceTrackingPage = () => {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [accessDenied, setAccessDenied] = useState(false)
  const [error, setError] = useState('')
  const [typeFilter, setTypeFilter] = useState('OUTBREAK')

  const fetchRecords = useCallback(() => {
    setLoading(true)
    setAccessDenied(false)
    setError('')
    getComplianceRecordsByType(typeFilter)
      .then(res => setRecords(res.data?.data ?? []))
      .catch(err => {
        if (err?.response?.status === 403) {
          setAccessDenied(true)
          setRecords([])
        } else if (!err?.response) {
          setError('Backend server is not reachable.')
        } else {
          setError(err?.response?.data?.message || 'Failed to load compliance records')
        }
      })
      .finally(() => setLoading(false))
  }, [typeFilter])

  useEffect(() => { fetchRecords() }, [fetchRecords])

  return (
    <DashboardLayout>
      <div className="mb-4">
        <h2 className="page-title">Compliance Tracking</h2>
        <p className="text-muted">View compliance records for outbreaks and cases. Read-only.</p>
      </div>

      {/* 403 message with backend fix note */}
      {accessDenied && (
        <div className="alert alert-warning">
          <h6 className="alert-heading">⚠️ Access Restricted</h6>
          <p className="mb-1">Compliance tracking is currently restricted by backend permissions.</p>
          <p className="mb-0 small">
            <strong>Backend fix required:</strong> Add <code>'EPIDEMIOLOGIST'</code> to{' '}
            <code>@PreAuthorize</code> on <code>GET /api/v1/compliance-records/type/{'{type}'}</code>{' '}
            in <code>ComplianceRecordController.java</code>.
          </p>
        </div>
      )}

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Type filter */}
      <div className="d-flex gap-2 mb-4 flex-wrap">
        {TYPES.map(t => (
          <button
            key={t}
            className={`btn btn-sm ${typeFilter === t ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => setTypeFilter(t)}
          >
            {t}
          </button>
        ))}
      </div>

      {!accessDenied && !error && (
        loading ? <Loader message="Loading compliance records…" /> : records.length === 0 ? (
          <div className="alert alert-info">No compliance records found for type "{typeFilter}".</div>
        ) : (
          <Card title={`${typeFilter} Compliance Records`}>
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Entity ID</th>
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
                      <td>{r.entityId}</td>
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
    </DashboardLayout>
  )
}

export default ComplianceTrackingPage
