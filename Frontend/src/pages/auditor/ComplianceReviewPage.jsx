import { useState, useEffect, useCallback } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Card from '../../components/common/Card'
import Loader from '../../components/common/Loader'
import StatusBadge from '../../components/common/StatusBadge'
import { getComplianceRecordsByType } from '../../api/complianceApi'

const TYPES   = ['CASE', 'OUTBREAK', 'VACCINATION']
const RESULTS = ['ALL', 'PASS', 'FAIL', 'WARNING', 'NON_COMPLIANT']

const ComplianceReviewPage = () => {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState('')
  const [typeFilter, setTypeFilter] = useState('CASE')
  const [resultFilter, setResultFilter] = useState('ALL')

  const fetchRecords = useCallback(() => {
    setLoading(true)
    setFetchError('')
    getComplianceRecordsByType(typeFilter)
      .then(res => setRecords(res.data?.data ?? []))
      .catch(err => {
        if (err?.response?.status === 403) setFetchError('Access denied. Compliance records require appropriate backend permissions.')
        else if (!err?.response) setFetchError('Backend server is not reachable.')
        else setFetchError(err?.response?.data?.message || 'Failed to load compliance records')
      })
      .finally(() => setLoading(false))
  }, [typeFilter])

  useEffect(() => { fetchRecords() }, [fetchRecords])

  const filtered = resultFilter === 'ALL' ? records : records.filter(r => r.result === resultFilter)

  const passCount        = records.filter(r => r.result === 'PASS').length
  const failCount        = records.filter(r => ['FAIL', 'NON_COMPLIANT'].includes(r.result)).length
  const warningCount     = records.filter(r => r.result === 'WARNING').length
  const complianceRate   = records.length > 0 ? Math.round((passCount / records.length) * 100) : 0

  return (
    <DashboardLayout>
      <div className="mb-4">
        <h2 className="page-title">Compliance Review</h2>
        <p className="text-muted">Audit compliance records across cases, outbreaks, and vaccination programs. Read-only.</p>
      </div>

      {fetchError && <div className="alert alert-warning">{fetchError}</div>}

      {/* Summary cards */}
      {!loading && !fetchError && records.length > 0 && (
        <div className="row g-3 mb-4">
          {[
            { label: 'Total Records',    value: records.length, color: '' },
            { label: 'Passed',           value: passCount,      color: 'text-success' },
            { label: 'Issues (Fail/NC)', value: failCount,      color: failCount > 0 ? 'text-danger' : 'text-success' },
            { label: 'Warnings',         value: warningCount,   color: warningCount > 0 ? 'text-warning' : '' },
            { label: 'Compliance Rate',  value: `${complianceRate}%`, color: complianceRate >= 80 ? 'text-success' : 'text-danger' },
          ].map(({ label, value, color }) => (
            <div key={label} className="col-md-6 col-xl">
              <div className="card card-surface text-center py-3">
                <div className={`fw-bold fs-4 ${color}`}>{value}</div>
                <div className="text-muted small">{label}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Non-compliance alert */}
      {!loading && failCount > 0 && (
        <div className="alert alert-danger d-flex align-items-center gap-2 mb-4">
          <span className="fs-5">⚠️</span>
          <strong>{failCount} non-compliant record{failCount > 1 ? 's' : ''} detected for type "{typeFilter}".</strong>
        </div>
      )}

      {/* Filters */}
      <div className="d-flex gap-2 mb-3 flex-wrap align-items-center">
        <span className="text-muted small me-1">Type:</span>
        {TYPES.map(t => (
          <button
            key={t}
            className={`btn btn-sm ${typeFilter === t ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => setTypeFilter(t)}
          >{t}</button>
        ))}
        <span className="text-muted small ms-3 me-1">Result:</span>
        {RESULTS.map(r => (
          <button
            key={r}
            className={`btn btn-sm ${resultFilter === r ? 'btn-dark' : 'btn-outline-secondary'}`}
            onClick={() => setResultFilter(r)}
          >{r.replace(/_/g, ' ')}</button>
        ))}
      </div>

      {loading ? <Loader message="Loading compliance records…" /> : filtered.length === 0 ? (
        <div className="alert alert-info">No compliance records found for the selected filters.</div>
      ) : (
        <Card title={`${typeFilter} Compliance Records (${filtered.length})`}>
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
                {filtered.map(r => (
                  <tr key={r.id} className={['FAIL', 'NON_COMPLIANT'].includes(r.result) ? 'table-danger' : r.result === 'WARNING' ? 'table-warning' : ''}>
                    <td className="fw-medium">#{r.id}</td>
                    <td>{r.entityId}</td>
                    <td><StatusBadge status={r.type} /></td>
                    <td><StatusBadge status={r.result} /></td>
                    <td>{r.date}</td>
                    <td className="text-muted small" style={{ maxWidth: '240px' }}>
                      <span title={r.notes}>{r.notes?.slice(0, 70)}{r.notes?.length > 70 ? '…' : ''}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </DashboardLayout>
  )
}

export default ComplianceReviewPage
