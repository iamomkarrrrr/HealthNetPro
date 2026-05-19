import { useState, useEffect, useCallback } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Loader from '../../components/common/Loader'
import StatusBadge from '../../components/common/StatusBadge'
import { getReportsByScope, getReportsByGeneratedDate, createReport } from '../../api/reportingApi'

const SCOPES = ['VACCINATION', 'CASE', 'OUTBREAK', 'COMPLIANCE']
const SAMPLE = '{"totalPrograms": 8, "activePrograms": 3, "immunizationsGiven": 25000}'
const tryParse = str => { try { return JSON.parse(str) } catch { return null } }

const ReportsPage = () => {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(false)
  const [scopeFilter, setScopeFilter] = useState('VACCINATION')
  const [dateFilter, setDateFilter] = useState('')
  const [fetchError, setFetchError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ scope: 'VACCINATION', metrics: SAMPLE, generatedDate: new Date().toISOString().slice(0, 10) })
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [saveSuccess, setSaveSuccess] = useState('')

  const fetchReports = useCallback(() => {
    setLoading(true)
    setFetchError('')
    const call = dateFilter ? getReportsByGeneratedDate(dateFilter) : getReportsByScope(scopeFilter)
    call
      .then(res => setReports(res.data?.data ?? []))
      .catch(err => {
        if (err?.response?.status === 403) setFetchError('Access denied. Your role may not have permission to view reports.')
        else setFetchError(err?.response?.data?.message || 'Failed to load reports')
        setReports([])
      })
      .finally(() => setLoading(false))
  }, [scopeFilter, dateFilter])

  useEffect(() => { fetchReports() }, [fetchReports])

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setSaveError('')
    setSaveSuccess('')
    if (!form.metrics.trim()) { setSaveError('Metrics are required.'); return }
    if (!form.generatedDate) { setSaveError('Generated date is required.'); return }
    setSaving(true)
    try {
      await createReport({ scope: form.scope, metrics: form.metrics, generatedDate: form.generatedDate })
      setSaveSuccess('Report created successfully.')
      setForm({ scope: 'VACCINATION', metrics: SAMPLE, generatedDate: new Date().toISOString().slice(0, 10) })
      setShowForm(false)
      fetchReports()
    } catch (err) {
      if (err?.response?.status === 403) setSaveError('Access denied. Your role may not have permission to create reports.')
      else setSaveError(err?.response?.data?.message || 'Failed to create report')
    } finally {
      setSaving(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-2">
        <div>
          <h2 className="page-title">Reports</h2>
          <p className="text-muted mb-0">View and generate health administration reports.</p>
        </div>
        <Button onClick={() => { setShowForm(!showForm); setSaveError(''); setSaveSuccess('') }}>
          {showForm ? 'Cancel' : '+ Create Report'}
        </Button>
      </div>

      {saveError && <div className="alert alert-danger py-2">{saveError}</div>}
      {saveSuccess && <div className="alert alert-success py-2">{saveSuccess}</div>}

      {showForm && (
        <Card title="Create Report" className="mb-4">
          <form onSubmit={handleSubmit} noValidate>
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label">Scope</label>
                <select name="scope" className="form-select" value={form.scope} onChange={handleChange}>
                  {SCOPES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label">Generated Date <span className="text-danger">*</span></label>
                <input type="date" name="generatedDate" className="form-control" value={form.generatedDate} onChange={handleChange} />
              </div>
              <div className="col-12">
                <label className="form-label">Metrics JSON <span className="text-danger">*</span></label>
                <textarea name="metrics" className="form-control font-monospace" rows={3} value={form.metrics} onChange={handleChange} placeholder={SAMPLE} />
              </div>
            </div>
            <div className="d-flex gap-2 mt-3">
              <Button type="submit" disabled={saving}>{saving ? 'Creating…' : 'Create Report'}</Button>
              <Button variant="outline-secondary" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </form>
        </Card>
      )}

      <div className="row g-3 mb-4 align-items-end">
        <div className="col-auto">
          <label className="form-label small">Filter by Scope</label>
          <div className="d-flex gap-2 flex-wrap">
            {SCOPES.map(s => (
              <button
                key={s}
                className={`btn btn-sm ${scopeFilter === s && !dateFilter ? 'btn-primary' : 'btn-outline-secondary'}`}
                onClick={() => { setScopeFilter(s); setDateFilter('') }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        <div className="col-md-3">
          <label className="form-label small">Filter by Date</label>
          <input type="date" className="form-control form-control-sm" value={dateFilter} onChange={e => setDateFilter(e.target.value)} />
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
      )}
    </DashboardLayout>
  )
}

export default ReportsPage
