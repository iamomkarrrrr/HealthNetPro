import { useState, useEffect, useCallback } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Loader from '../../components/common/Loader'
import StatusBadge from '../../components/common/StatusBadge'
import {
  getComplianceRecordsByType,
  createComplianceRecord,
  updateComplianceRecord,
} from '../../api/complianceApi'

const TYPES   = ['CASE', 'OUTBREAK', 'VACCINATION']
const RESULTS = ['PASS', 'FAIL', 'WARNING', 'NON_COMPLIANT']
const EMPTY   = { entityId: '', type: 'CASE', result: 'PASS', date: new Date().toISOString().slice(0, 10), notes: '' }

const ComplianceRecordsPage = () => {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [typeFilter, setTypeFilter] = useState('CASE')
  const [resultFilter, setResultFilter] = useState('ALL')
  const [fetchError, setFetchError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [saveSuccess, setSaveSuccess] = useState('')

  const fetchRecords = useCallback(() => {
    setLoading(true)
    setFetchError('')
    getComplianceRecordsByType(typeFilter)
      .then(res => setRecords(res.data?.data ?? []))
      .catch(err => {
        if (err?.response?.status === 403) setFetchError('Access denied. Your role may not have permission to view compliance records.')
        else if (!err?.response) setFetchError('Backend server is not reachable.')
        else setFetchError(err?.response?.data?.message || 'Failed to load compliance records')
      })
      .finally(() => setLoading(false))
  }, [typeFilter])

  useEffect(() => { fetchRecords() }, [fetchRecords])

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const openCreate = () => {
    setEditTarget(null)
    setForm(EMPTY)
    setSaveError('')
    setSaveSuccess('')
    setShowForm(true)
  }

  const openEdit = r => {
    setEditTarget(r)
    setForm({ entityId: r.entityId, type: r.type, result: r.result, date: r.date, notes: r.notes ?? '' })
    setSaveError('')
    setSaveSuccess('')
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setSaveError('')
    setSaveSuccess('')
    if (!form.entityId) { setSaveError('Entity ID is required.'); return }
    if (!form.date)     { setSaveError('Date is required.'); return }
    setSaving(true)
    try {
      const payload = {
        entityId: Number(form.entityId),
        type: form.type,
        result: form.result,
        date: form.date,
        notes: form.notes,
      }
      if (editTarget) {
        await updateComplianceRecord(editTarget.id, payload)
        setSaveSuccess('Compliance record updated successfully.')
      } else {
        await createComplianceRecord(payload)
        setSaveSuccess('Compliance record created successfully.')
      }
      setForm(EMPTY)
      setShowForm(false)
      setEditTarget(null)
      fetchRecords()
    } catch (err) {
      if (err?.response?.status === 403) setSaveError('Access denied. Your role may not have permission to create compliance records.')
      else setSaveError(err?.response?.data?.message || 'Failed to save compliance record')
    } finally {
      setSaving(false)
    }
  }

  const filtered = resultFilter === 'ALL' ? records : records.filter(r => r.result === resultFilter)

  return (
    <DashboardLayout>
      <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-2">
        <div>
          <h2 className="page-title">Compliance Records</h2>
          <p className="text-muted mb-0">Create and manage compliance records for cases, outbreaks, and vaccination programs.</p>
        </div>
        <Button onClick={openCreate}>+ New Record</Button>
      </div>

      {fetchError && <div className="alert alert-warning">{fetchError}</div>}
      {saveError  && <div className="alert alert-danger py-2">{saveError}</div>}
      {saveSuccess && <div className="alert alert-success py-2">{saveSuccess}</div>}

      {/* Create / Edit form */}
      {showForm && (
        <Card title={editTarget ? `Edit Record #${editTarget.id}` : 'Create Compliance Record'} className="mb-4">
          <form onSubmit={handleSubmit} noValidate>
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label">Entity ID <span className="text-danger">*</span></label>
                <input
                  type="number"
                  name="entityId"
                  className="form-control"
                  value={form.entityId}
                  onChange={handleChange}
                  placeholder="e.g. 10"
                  disabled={!!editTarget}
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Type</label>
                <select name="type" className="form-select" value={form.type} onChange={handleChange} disabled={!!editTarget}>
                  {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label">Result</label>
                <select name="result" className="form-select" value={form.result} onChange={handleChange}>
                  {RESULTS.map(r => <option key={r} value={r}>{r.replace(/_/g, ' ')}</option>)}
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label">Date <span className="text-danger">*</span></label>
                <input type="date" name="date" className="form-control" value={form.date} onChange={handleChange} />
              </div>
              <div className="col-md-8">
                <label className="form-label">Notes</label>
                <input
                  type="text"
                  name="notes"
                  className="form-control"
                  value={form.notes}
                  onChange={handleChange}
                  placeholder="e.g. Case follows treatment protocol"
                />
              </div>
            </div>
            <div className="d-flex gap-2 mt-3">
              <Button type="submit" disabled={saving}>{saving ? 'Saving…' : editTarget ? 'Update Record' : 'Create Record'}</Button>
              <Button variant="outline-secondary" onClick={() => { setShowForm(false); setEditTarget(null) }}>Cancel</Button>
            </div>
          </form>
        </Card>
      )}

      {/* Type filter tabs */}
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
        {['ALL', ...RESULTS].map(r => (
          <button
            key={r}
            className={`btn btn-sm ${resultFilter === r ? 'btn-dark' : 'btn-outline-secondary'}`}
            onClick={() => setResultFilter(r)}
          >{r.replace(/_/g, ' ')}</button>
        ))}
      </div>

      {loading ? <Loader message="Loading records…" /> : filtered.length === 0 ? (
        <div className="alert alert-info">No compliance records found for the selected filters.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Entity ID</th>
                <th>Type</th>
                <th>Result</th>
                <th>Date</th>
                <th>Notes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r.id}>
                  <td className="fw-medium">#{r.id}</td>
                  <td>{r.entityId}</td>
                  <td><StatusBadge status={r.type} /></td>
                  <td><StatusBadge status={r.result} /></td>
                  <td>{r.date}</td>
                  <td className="text-muted small" style={{ maxWidth: '200px' }}>
                    <span title={r.notes}>{r.notes?.slice(0, 60)}{r.notes?.length > 60 ? '…' : ''}</span>
                  </td>
                  <td>
                    <button className="btn btn-sm btn-outline-primary" onClick={() => openEdit(r)}>Edit</button>
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

export default ComplianceRecordsPage
