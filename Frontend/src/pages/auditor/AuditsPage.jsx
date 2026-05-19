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

const AuditsPage = () => {
  const { user } = useAuth()
  const [audits, setAudits] = useState([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [showForm, setShowForm] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [saveSuccess, setSaveSuccess] = useState('')

  const fetchAudits = useCallback(() => {
    if (!user?.userId) return
    setLoading(true)
    setFetchError('')
    getAuditsByOfficerId(user.userId)
      .then(res => setAudits(res.data?.data ?? []))
      .catch(err => {
        if (err?.response?.status === 403) setFetchError('Access denied. Your role may not have permission to view audits.')
        else if (!err?.response) setFetchError('Backend server is not reachable.')
        else setFetchError(err?.response?.data?.message || 'Failed to load audits')
      })
      .finally(() => setLoading(false))
  }, [user?.userId])

  useEffect(() => { fetchAudits() }, [fetchAudits])

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const openCreate = () => {
    setEditTarget(null)
    setForm(EMPTY)
    setSaveError('')
    setSaveSuccess('')
    setShowForm(true)
  }

  const openEdit = a => {
    setEditTarget(a)
    setForm({ scope: a.scope, findings: a.findings ?? '', date: a.date, status: a.status })
    setSaveError('')
    setSaveSuccess('')
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setSaveError('')
    setSaveSuccess('')
    if (!form.findings.trim()) { setSaveError('Findings are required.'); return }
    if (!form.date) { setSaveError('Date is required.'); return }
    setSaving(true)
    try {
      if (editTarget) {
        await updateAudit(editTarget.id, { scope: form.scope, findings: form.findings, date: form.date, status: form.status })
        setSaveSuccess('Audit updated successfully.')
      } else {
        await createAudit({ officerId: user.userId, scope: form.scope, findings: form.findings, date: form.date, status: form.status })
        setSaveSuccess('Audit created successfully.')
      }
      setForm(EMPTY)
      setShowForm(false)
      setEditTarget(null)
      fetchAudits()
    } catch (err) {
      if (err?.response?.status === 403) setSaveError('Access denied. Your role may not have permission to manage audits.')
      else setSaveError(err?.response?.data?.message || 'Failed to save audit')
    } finally {
      setSaving(false)
    }
  }

  const filtered = statusFilter === 'ALL' ? audits : audits.filter(a => a.status === statusFilter)

  return (
    <DashboardLayout>
      <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-2">
        <div>
          <h2 className="page-title">Audits</h2>
          <p className="text-muted mb-0">Review and manage audit records for system governance.</p>
        </div>
        <Button onClick={openCreate}>+ New Audit</Button>
      </div>

      {fetchError && <div className="alert alert-warning">{fetchError}</div>}
      {saveError  && <div className="alert alert-danger py-2">{saveError}</div>}
      {saveSuccess && <div className="alert alert-success py-2">{saveSuccess}</div>}

      {/* Create / Edit form */}
      {showForm && (
        <Card title={editTarget ? `Edit Audit #${editTarget.id}` : 'Create Audit Record'} className="mb-4">
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
                <input type="date" name="date" className="form-control" value={form.date} onChange={handleChange} />
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
                  placeholder="e.g. All immunization records comply with policy. No irregularities found."
                />
              </div>
            </div>
            <div className="d-flex gap-2 mt-3">
              <Button type="submit" disabled={saving}>{saving ? 'Saving…' : editTarget ? 'Update Audit' : 'Create Audit'}</Button>
              <Button variant="outline-secondary" onClick={() => { setShowForm(false); setEditTarget(null) }}>Cancel</Button>
            </div>
          </form>
        </Card>
      )}

      {/* Status filter */}
      <div className="d-flex gap-2 mb-3 flex-wrap align-items-center">
        <span className="text-muted small me-1">Status:</span>
        {['ALL', ...STATUSES].map(s => (
          <button
            key={s}
            className={`btn btn-sm ${statusFilter === s ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => setStatusFilter(s)}
          >{s.replace('_', ' ')}</button>
        ))}
      </div>

      {loading ? <Loader message="Loading audits…" /> : filtered.length === 0 ? (
        <div className="alert alert-info">
          {statusFilter === 'ALL' ? 'No audit records found.' : `No audits with status "${statusFilter}".`}
        </div>
      ) : (
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
                <tr key={a.id}>
                  <td className="fw-medium">#{a.id}</td>
                  <td><StatusBadge status={a.scope} /></td>
                  <td>{a.date}</td>
                  <td><StatusBadge status={a.status} /></td>
                  <td className="text-muted small" style={{ maxWidth: '280px' }}>
                    <span title={a.findings}>{a.findings?.slice(0, 80)}{a.findings?.length > 80 ? '…' : ''}</span>
                  </td>
                  <td>
                    <button className="btn btn-sm btn-outline-primary" onClick={() => openEdit(a)}>Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  )
}

export default AuditsPage
