import { useState, useEffect, useCallback } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Loader from '../../components/common/Loader'
import StatusBadge from '../../components/common/StatusBadge'
import useAuth from '../../hooks/useAuth'
import { getAuditsByOfficerId, getAuditsByStatus, createAudit, updateAudit } from '../../api/auditApi'

const STATUSES = ['OPEN', 'IN_REVIEW', 'CLOSED']
const SCOPES   = ['CASE', 'OUTBREAK', 'VACCINATION', 'COMPLIANCE']
const EMPTY    = { scope: 'CASE', findings: '', date: new Date().toISOString().slice(0, 10), status: 'OPEN' }

const AuditLogsPage = () => {
  const { user } = useAuth()
  const [audits, setAudits] = useState([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState('')

  // Filters
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [scopeFilter, setScopeFilter]   = useState('ALL')

  // Detail panel
  const [selected, setSelected] = useState(null)

  // Create / Edit form
  const [showForm, setShowForm]     = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [form, setForm]             = useState(EMPTY)
  const [saving, setSaving]         = useState(false)
  const [saveError, setSaveError]   = useState('')
  const [saveSuccess, setSaveSuccess] = useState('')

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchAudits = useCallback(() => {
    if (!user?.userId) return
    setLoading(true)
    setFetchError('')

    const call = statusFilter !== 'ALL'
      ? getAuditsByStatus(statusFilter)
      : getAuditsByOfficerId(user.userId)

    call
      .then(res => setAudits(res.data?.data ?? []))
      .catch(err => {
        if (err?.response?.status === 403)
          setFetchError('Access denied. Your role may not have permission to view audit logs.')
        else if (!err?.response)
          setFetchError('Backend server is not reachable.')
        else
          setFetchError(err?.response?.data?.message || 'Failed to load audit logs.')
      })
      .finally(() => setLoading(false))
  }, [user?.userId, statusFilter])

  useEffect(() => { fetchAudits() }, [fetchAudits])

  // ── Client-side scope filter ───────────────────────────────────────────────
  const filtered = audits.filter(a =>
    scopeFilter === 'ALL' || a.scope === scopeFilter
  )

  // ── Summary counts ─────────────────────────────────────────────────────────
  const openCount     = audits.filter(a => a.status === 'OPEN').length
  const reviewCount   = audits.filter(a => a.status === 'IN_REVIEW').length
  const closedCount   = audits.filter(a => a.status === 'CLOSED').length

  // ── Form helpers ───────────────────────────────────────────────────────────
  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const openCreate = () => {
    setEditTarget(null)
    setForm(EMPTY)
    setSaveError('')
    setSaveSuccess('')
    setSelected(null)
    setShowForm(true)
  }

  const openEdit = a => {
    setEditTarget(a)
    setForm({ scope: a.scope, findings: a.findings ?? '', date: a.date, status: a.status })
    setSaveError('')
    setSaveSuccess('')
    setSelected(null)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setSaveError('')
    setSaveSuccess('')
    if (!form.findings.trim()) { setSaveError('Findings are required.'); return }
    if (!form.date)            { setSaveError('Date is required.'); return }
    setSaving(true)
    try {
      if (editTarget) {
        await updateAudit(editTarget.id, {
          scope: form.scope, findings: form.findings, date: form.date, status: form.status,
        })
        setSaveSuccess('Audit record updated successfully.')
      } else {
        await createAudit({
          officerId: user.userId, scope: form.scope,
          findings: form.findings, date: form.date, status: form.status,
        })
        setSaveSuccess('Audit record created successfully.')
      }
      setForm(EMPTY)
      setShowForm(false)
      setEditTarget(null)
      fetchAudits()
    } catch (err) {
      if (err?.response?.status === 403)
        setSaveError('Access denied. Your role may not have permission to manage audit records.')
      else
        setSaveError(err?.response?.data?.message || 'Failed to save audit record.')
    } finally {
      setSaving(false)
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <DashboardLayout>
      {/* Page header */}
      <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-2">
        <div>
          <h2 className="page-title">Audit Logs</h2>
          <p className="text-muted mb-0">
            System-wide audit trail. Review, filter, and manage audit records.
          </p>
        </div>
        <Button onClick={openCreate}>+ New Audit</Button>
      </div>

      {/* Alerts */}
      {fetchError  && <div className="alert alert-warning">{fetchError}</div>}
      {saveError   && <div className="alert alert-danger py-2">{saveError}</div>}
      {saveSuccess && <div className="alert alert-success py-2">{saveSuccess}</div>}

      {/* Summary stat cards */}
      {!loading && !fetchError && (
        <div className="row g-3 mb-4">
          {[
            { label: 'Total Audits', value: audits.length,  color: '' },
            { label: 'Open',         value: openCount,      color: openCount   > 0 ? 'text-warning' : '' },
            { label: 'In Review',    value: reviewCount,    color: 'text-info' },
            { label: 'Closed',       value: closedCount,    color: 'text-success' },
          ].map(({ label, value, color }) => (
            <div key={label} className="col-6 col-xl-3">
              <div className="card card-surface text-center py-3">
                <div className={`fw-bold fs-3 ${color}`}>{value}</div>
                <div className="text-muted small">{label}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit form */}
      {showForm && (
        <Card
          title={editTarget ? `Edit Audit #${editTarget.id}` : 'Create Audit Record'}
          className="mb-4"
        >
          <form onSubmit={handleSubmit} noValidate>
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label">Scope</label>
                <select name="scope" className="form-select" value={form.scope} onChange={handleChange}>
                  {SCOPES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label">Date <span className="text-danger">*</span></label>
                <input
                  type="date" name="date"
                  className="form-control"
                  value={form.date}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Status</label>
                <select name="status" className="form-select" value={form.status} onChange={handleChange}>
                  {STATUSES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                </select>
              </div>
              <div className="col-12">
                <label className="form-label">Findings <span className="text-danger">*</span></label>
                <textarea
                  name="findings"
                  className="form-control"
                  rows={3}
                  value={form.findings}
                  onChange={handleChange}
                  placeholder="e.g. All vaccination records comply with policy. No irregularities found."
                />
              </div>
            </div>
            <div className="d-flex gap-2 mt-3">
              <Button type="submit" disabled={saving}>
                {saving ? 'Saving…' : editTarget ? 'Update Audit' : 'Create Audit'}
              </Button>
              <Button
                variant="outline-secondary"
                onClick={() => { setShowForm(false); setEditTarget(null) }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Filters */}
      <div className="d-flex gap-2 mb-3 flex-wrap align-items-center">
        <span className="text-muted small me-1">Status:</span>
        {['ALL', ...STATUSES].map(s => (
          <button
            key={s}
            className={`btn btn-sm ${statusFilter === s ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => setStatusFilter(s)}
          >
            {s.replace('_', ' ')}
          </button>
        ))}
        <span className="text-muted small ms-3 me-1">Scope:</span>
        {['ALL', ...SCOPES].map(s => (
          <button
            key={s}
            className={`btn btn-sm ${scopeFilter === s ? 'btn-dark' : 'btn-outline-secondary'}`}
            onClick={() => setScopeFilter(s)}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Main content — table + optional detail panel */}
      {loading ? (
        <Loader message="Loading audit logs…" />
      ) : filtered.length === 0 ? (
        <div className="alert alert-info">
          {audits.length === 0
            ? 'No audit logs available.'
            : 'No audit records match the selected filters.'}
        </div>
      ) : (
        <div className="row g-4">
          {/* Table */}
          <div className={selected ? 'col-lg-7' : 'col-12'}>
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Scope</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Findings</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(a => (
                    <tr
                      key={a.id}
                      className={selected?.id === a.id ? 'table-active' : ''}
                      style={{ cursor: 'pointer' }}
                      onClick={() => setSelected(selected?.id === a.id ? null : a)}
                    >
                      <td className="fw-medium">#{a.id}</td>
                      <td><StatusBadge status={a.scope} /></td>
                      <td className="text-muted small">{a.date}</td>
                      <td><StatusBadge status={a.status} /></td>
                      <td
                        className="text-muted small"
                        style={{ maxWidth: selected ? '160px' : '320px' }}
                      >
                        <span title={a.findings}>
                          {a.findings?.slice(0, selected ? 40 : 80)}
                          {a.findings?.length > (selected ? 40 : 80) ? '…' : ''}
                        </span>
                      </td>
                      <td onClick={e => e.stopPropagation()}>
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => openEdit(a)}
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="text-muted small mt-2">
              Showing {filtered.length} of {audits.length} audit record{audits.length !== 1 ? 's' : ''}
            </div>
          </div>

          {/* Detail panel */}
          {selected && (
            <div className="col-lg-5">
              <Card
                header={
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Audit #{selected.id}</h5>
                    <button
                      className="btn-close"
                      onClick={() => setSelected(null)}
                      aria-label="Close"
                    />
                  </div>
                }
              >
                <div className="row g-3 mb-3">
                  {[
                    ['Audit ID',   `#${selected.id}`],
                    ['Officer ID', `#${selected.officerId}`],
                    ['Scope',      <StatusBadge key="sc" status={selected.scope} />],
                    ['Status',     <StatusBadge key="st" status={selected.status} />],
                    ['Date',       selected.date],
                  ].map(([label, value]) => (
                    <div key={label} className="col-6">
                      <div className="text-muted small">{label}</div>
                      <div className="fw-medium">{value ?? '—'}</div>
                    </div>
                  ))}
                </div>

                <div className="border-top pt-3">
                  <div className="text-muted small mb-1">Findings</div>
                  <p
                    className="mb-0 small"
                    style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}
                  >
                    {selected.findings || 'No findings recorded.'}
                  </p>
                </div>

                <div className="mt-4">
                  <Button onClick={() => openEdit(selected)}>Edit This Audit</Button>
                </div>
              </Card>
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  )
}

export default AuditLogsPage
