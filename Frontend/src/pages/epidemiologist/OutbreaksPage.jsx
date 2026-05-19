import { useState, useEffect, useCallback } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Loader from '../../components/common/Loader'
import StatusBadge from '../../components/common/StatusBadge'
import { getAllOutbreaks, createOutbreak, updateOutbreak } from '../../api/outbreakApi'

const STATUSES = ['DETECTED', 'ACTIVE', 'CONTAINED', 'CLOSED']
const EMPTY = { diseaseType: '', location: '', startDate: new Date().toISOString().slice(0, 10), endDate: '', status: 'DETECTED' }

const OutbreaksPage = () => {
  const [outbreaks, setOutbreaks] = useState([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState('')
  const [filter, setFilter] = useState('ALL')
  const [showForm, setShowForm] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [saveSuccess, setSaveSuccess] = useState('')

  const fetchAll = useCallback(() => {
    setLoading(true)
    getAllOutbreaks()
      .then(res => setOutbreaks(res.data?.data ?? []))
      .catch(err => {
        if (err?.response?.status === 403) setFetchError('Access denied. Backend must allow EPIDEMIOLOGIST read access to GET /api/v1/outbreaks.')
        else if (!err?.response) setFetchError('Backend server is not reachable.')
        else setFetchError(err?.response?.data?.message || 'Failed to load outbreaks')
      })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const openCreate = () => {
    setEditTarget(null)
    setForm(EMPTY)
    setSaveError('')
    setSaveSuccess('')
    setShowForm(true)
  }

  const openEdit = o => {
    setEditTarget(o)
    setForm({ diseaseType: o.diseaseType, location: o.location, startDate: o.startDate, endDate: o.endDate ?? '', status: o.status })
    setSaveError('')
    setSaveSuccess('')
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const validate = () => {
    if (!form.diseaseType.trim()) return 'Disease type is required.'
    if (!form.location.trim()) return 'Location is required.'
    if (!form.startDate) return 'Start date is required.'
    if (['CONTAINED', 'CLOSED'].includes(form.status) && !form.endDate) return 'End date is required when status is CONTAINED or CLOSED.'
    return null
  }

  const handleSubmit = async e => {
    e.preventDefault()
    const err = validate()
    if (err) { setSaveError(err); return }
    setSaving(true)
    setSaveError('')
    setSaveSuccess('')
    try {
      const payload = { diseaseType: form.diseaseType, location: form.location, startDate: form.startDate, endDate: form.endDate || null, status: form.status }
      if (editTarget) {
        await updateOutbreak(editTarget.id, payload)
        setSaveSuccess('Outbreak updated successfully.')
      } else {
        await createOutbreak(payload)
        setSaveSuccess('Outbreak created successfully.')
      }
      setForm(EMPTY)
      setShowForm(false)
      setEditTarget(null)
      fetchAll()
    } catch (err) {
      if (err?.response?.status === 403) setSaveError('Access denied. Your role may not have permission to create/update outbreaks.')
      else setSaveError(err?.response?.data?.message || 'Failed to save outbreak')
    } finally {
      setSaving(false)
    }
  }

  const filtered = filter === 'ALL' ? outbreaks : outbreaks.filter(o => o.status === filter)
  const activeCount = outbreaks.filter(o => ['DETECTED', 'ACTIVE'].includes(o.status)).length

  return (
    <DashboardLayout>
      <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-2">
        <div>
          <h2 className="page-title">Outbreaks</h2>
          <p className="text-muted mb-0">Monitor, create, and update disease outbreak records.</p>
        </div>
        <Button onClick={openCreate}>+ New Outbreak</Button>
      </div>

      {fetchError && <div className="alert alert-warning">{fetchError}</div>}
      {saveError && <div className="alert alert-danger py-2">{saveError}</div>}
      {saveSuccess && <div className="alert alert-success py-2">{saveSuccess}</div>}

      {activeCount > 0 && (
        <div className="alert alert-danger d-flex align-items-center gap-2 mb-4">
          <span>⚠️</span>
          <strong>{activeCount} active outbreak{activeCount > 1 ? 's' : ''} require attention.</strong>
        </div>
      )}

      {/* Create / Edit form */}
      {showForm && (
        <Card title={editTarget ? `Edit Outbreak #${editTarget.id}` : 'Create New Outbreak'} className="mb-4">
          <form onSubmit={handleSubmit} noValidate>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Disease Type <span className="text-danger">*</span></label>
                <input type="text" name="diseaseType" className="form-control" value={form.diseaseType} onChange={handleChange} placeholder="e.g. Dengue" />
              </div>
              <div className="col-md-6">
                <label className="form-label">Location <span className="text-danger">*</span></label>
                <input type="text" name="location" className="form-control" value={form.location} onChange={handleChange} placeholder="e.g. Chennai" />
              </div>
              <div className="col-md-4">
                <label className="form-label">Start Date <span className="text-danger">*</span></label>
                <input type="date" name="startDate" className="form-control" value={form.startDate} onChange={handleChange} />
              </div>
              <div className="col-md-4">
                <label className="form-label">
                  End Date{' '}
                  {['CONTAINED', 'CLOSED'].includes(form.status) && <span className="text-danger">*</span>}
                  {!['CONTAINED', 'CLOSED'].includes(form.status) && <span className="text-muted small">(optional)</span>}
                </label>
                <input type="date" name="endDate" className="form-control" value={form.endDate} onChange={handleChange} />
              </div>
              <div className="col-md-4">
                <label className="form-label">Status <span className="text-danger">*</span></label>
                <select name="status" className="form-select" value={form.status} onChange={handleChange}>
                  {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="d-flex gap-2 mt-3">
              <Button type="submit" disabled={saving}>{saving ? 'Saving…' : editTarget ? 'Update Outbreak' : 'Create Outbreak'}</Button>
              <Button variant="outline-secondary" onClick={() => { setShowForm(false); setEditTarget(null) }}>Cancel</Button>
            </div>
          </form>
        </Card>
      )}

      {/* Filter tabs */}
      <div className="d-flex gap-2 mb-3 flex-wrap">
        {['ALL', ...STATUSES].map(s => (
          <button key={s} className={`btn btn-sm ${filter === s ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setFilter(s)}>{s}</button>
        ))}
      </div>

      {loading ? <Loader message="Loading outbreaks…" /> : filtered.length === 0 ? (
        <div className="alert alert-info">{filter === 'ALL' ? 'No outbreaks recorded yet.' : `No outbreaks with status "${filter}".`}</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Disease Type</th>
                <th>Location</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(o => (
                <tr key={o.id}>
                  <td className="fw-medium">#{o.id}</td>
                  <td>{o.diseaseType}</td>
                  <td>{o.location}</td>
                  <td>{o.startDate}</td>
                  <td>{o.endDate ?? '—'}</td>
                  <td><StatusBadge status={o.status} /></td>
                  <td><button className="btn btn-sm btn-outline-primary" onClick={() => openEdit(o)}>Edit</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  )
}

export default OutbreaksPage
