import { useState, useEffect, useCallback } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Loader from '../../components/common/Loader'
import StatusBadge from '../../components/common/StatusBadge'
import { getReportsByScope, getReportsByGeneratedDate } from '../../api/reportingApi'

const SCOPES = ['COMPLIANCE', 'CASE', 'OUTBREAK', 'VACCINATION']
const tryParse = str => { try { return JSON.parse(str) } catch { return null } }

const ReportsPage = () => {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(false)
  const [scopeFilter, setScopeFilter] = useState('COMPLIANCE')
  const [dateFilter, setDateFilter] = useState('')
  const [fetchError, setFetchError] = useState('')

  const fetchReports = useCallback(() => {
    setLoading(true)
    setFetchError('')
    const call = dateFilter
      ? getReportsByGeneratedDate(dateFilter)
      : getReportsByScope(scopeFilter)
    call
      .then(res => setReports(res.data?.data ?? []))
      .catch(err => {
        if (err?.response?.status === 403) setFetchError('Access denied. Your role may not have permission to view reports.')
        else if (!err?.response) setFetchError('Backend server is not reachable.')
        else setFetchError(err?.response?.data?.message || 'Failed to load reports')
        setReports([])
      })
      .finally(() => setLoading(false))
  }, [scopeFilter, dateFilter])

  useEffect(() => { fetchReports() }, [fetchReports])

  return (
    <DashboardLayout>
      <div className="mb-4">
        <h2 className="page-title">Reports</h2>
        <p className="text-muted">Review system-generated health and compliance reports. Read-only.</p>
      </div>

      {/* Filters */}
      <div className="row g-3 mb-4 align-items-end">
        <div className="col-auto">
          <label className="form-label small fw-medium">Filter by Scope</label>
          <div className="d-flex gap-2 flex-wrap">
            {SCOPES.map(s => (
              <button
                key={s}
                className={`btn btn-sm ${scopeFilter === s && !dateFilter ? 'btn-primary' : 'btn-outline-secondary'}`}
                onClick={() => { setScopeFilter(s); setDateFilter('') }}
              >{s}</button>
            ))}
          </div>
        </div>
        <div className="col-md-3">
          <label className="form-label small fw-medium">Filter by Date</label>
          <input
            type="date"
            className="form-control form-control-sm"
            value={dateFilter}
            onChange={e => setDateFilter(e.target.value)}
          />
        </div>
        {dateFilter && (
          <div className="col-auto">
            <button className="btn btn-sm btn-outline-secondary" onClick={() => setDateFilter('')}>Clear date</button>
          </div>
        )}
      </div>

      {fetchError && <div className="alert alert-warning">{fetchError}</div>}

      {loading ? <Loader message="Loading reports…" /> : reports.length === 0 ? (
        <div className="alert alert-info">No reports found for the selected filter.</div>
      ) : (
        <>
          <div className="text-muted small mb-3">{reports.length} report{reports.length !== 1 ? 's' : ''} found</div>
          <div className="row g-4">
            {reports.map(r => {
              const parsed = tryParse(r.metrics)
              return (
                <div key={r.id} className="col-md-6 col-xl-4">
                  <div className="card card-surface h-100">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div>
                          <div className="fw-medium">Report #{r.id}</div>
                          <div className="text-muted small">{r.generatedDate}</div>
                        </div>
                        <StatusBadge status={r.scope} />
                      </div>
                      {parsed ? (
                        <div className="row g-2">
                          {Object.entries(parsed).map(([k, v]) => (
                            <div key={k} className="col-6">
                              <div className="text-muted" style={{ fontSize: '0.7rem' }}>{k.replace(/([A-Z])/g, ' $1').trim()}</div>
                              <div className="fw-medium small">{String(v)}</div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <pre className="bg-light p-2 rounded small mb-0" style={{ fontSize: '0.7rem', whiteSpace: 'pre-wrap' }}>{r.metrics}</pre>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}
    </DashboardLayout>
  )
}

export default ReportsPage
