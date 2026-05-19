import { useState, useEffect, useRef } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Loader from '../../components/common/Loader'
import StatusBadge from '../../components/common/StatusBadge'
import { getVaccinationPrograms, createVaccinationProgram, updateVaccinationProgram } from '../../api/vaccinationApi'

const STATUSES = ['UPCOMING', 'ACTIVE', 'COMPLETED']
const EMPTY = { title: '', description: '', vaccineType: '', startDate: new Date().toISOString().slice(0, 10), endDate: '', status: 'UPCOMING' }

const VaccinationProgramsPage = () => {
  const [programs, setPrograms] = useState([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState('')
  const [filter, setFilter] = useState('ALL')
  const [showForm, setShowForm] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [saveSuccess, setSaveSuccess] = useState('')
  const [refreshing, setRefreshing] = useState(false)

  const successTimer = useRef(null)
  const showSuccess = (msg) => {
    setSaveSuccess(msg)
    clearTimeout(successTimer.current)
    successTimer.current = setTimeout(() => setSaveSuccess(''), 3000)
  }

  useEffect(() => {
    let mounted = true
    setLoading(true)
    getVaccinationPrograms()
      .then(res => { if (mounted) setPrograms(res.data?.data ?? []) })
      .catch(err => {
        if (!mounted) return
        if (err?.response?.status === 403) setFetchError('Access denied. Backend permissions required.')
        else setFetchError(err?.response?.data?.message || 'Failed to load vaccination programs')
      })
      .finally(() => { if (mounted) setLoading(false) })
    return () => { mounted = false }
  }, [])

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const openCreate = () => {
    setEditTarget(null)
    setForm(EMPTY)
    setSaveError('')
    setSaveSuccess('')
    setShowForm(true)
  }

  const openEdit = p => {
    setEditTarget(p)
    setForm({ title: p.title, description: p.description ?? '', vaccineType: p.vaccineType ?? '', startDate: p.startDate, endDate: p.endDate ?? '', status: p.status })
    setSaveError('')
    setSaveSuccess('')
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const validate = () => {
    if (!form.title.trim()) return 'Title is required.'
    if (!form.description.trim()) return 'Description is required.'
    if (!form.startDate) return 'Start date is required.'
    if (form.status === 'COMPLETED' && !form.endDate) return 'End date is required for COMPLETED programs.'
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
      const payload = { title: form.title, description: form.description, vaccineType: form.vaccineType || null, startDate: form.startDate, endDate: form.endDate || null, status: form.status }
      if (editTarget) {
        const res = await updateVaccinationProgram(editTarget.id, payload)
        const updated = res.data?.data ?? { ...editTarget, ...payload }
        setPrograms(prev => prev.map(p => p.id === editTarget.id ? { ...p, ...updated } : p))
        showSuccess('Program updated successfully.')
      } else {
        const res = await createVaccinationProgram(payload)
        const created = res.data?.data
        if (created) {
          setPrograms(prev => [created, ...prev])
        } else {
          // Background refresh without blocking UI
          setRefreshing(true)
          getVaccinationPrograms()
            .then(r => setPrograms(r.data?.data ?? []))
            .catch(() => {})
            .finally(() => setRefreshing(false))
        }
        showSuccess('Program created successfully.')
      }
      setForm(EMPTY)
      setShowForm(false)
      setEditTarget(null)
    } catch (err) {
      if (err?.response?.status === 403) setSaveError('Access denied. Your role may not have permission to manage vaccination programs.')
      else setSaveError(err?.response?.data?.message || 'Failed to save program')
    } finally {
      setSaving(false)
    }
  }

  const filtered = filter === 'ALL' ? programs : programs.filter(p => p.status === filter)

  return (
    <DashboardLayout>
      <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-2">
        <div>
          <h2 className="page-title">Vaccination Programs</h2>
          <p className="text-muted mb-0">Create and manage public vaccination programs.</p>
        </div>
        <Button onClick={openCreate}>+ New Program</Button>
      </div>

      {fetchError && <div className="alert alert-warning">{fetchError}</div>}
      {saveError && <div className="alert alert-danger py-2">{saveError}</div>}
      {saveSuccess && <div className="alert alert-success py-2">{saveSuccess}</div>}
      {refreshing && (
        <div className="text-muted small mb-2">
          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
          Refreshing programs…
        </div>
      )}

      {showForm && (
        <Card title={editTarget ? `Edit Program #${editTarget.id}` : 'Create Vaccination Program'} className="mb-4">
          <form onSubmit={handleSubmit} noValidate>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Title <span className="text-danger">*</span></label>
                <input type="text" name="title" className="form-control" value={form.title} onChange={handleChange} placeholder="e.g. COVID-19 Booster Drive" />
              </div>
              <div className="col-md-6">
                <label className="form-label">Vaccine Type</label>
                <input type="text" name="vaccineType" className="form-control" value={form.vaccineType} onChange={handleChange} placeholder="e.g. COVID-19 Booster" />
              </div>
              <div className="col-12">
                <label className="form-label">Description <span className="text-danger">*</span></label>
                <textarea name="description" className="form-control" rows={2} value={form.description} onChange={handleChange} placeholder="Program description" />
              </div>
              <div className="col-md-4">
                <label className="form-label">Start Date <span className="text-danger">*</span></label>
                <input type="date" name="startDate" className="form-control" value={form.startDate} onChange={handleChange} />
              </div>
              <div className="col-md-4">
                <label className="form-label">
                  End Date {form.status === 'COMPLETED' && <span className="text-danger">*</span>}
                  {form.status !== 'COMPLETED' && <span className="text-muted small">(optional)</span>}
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
              <Button type="submit" disabled={saving}>{saving ? 'Saving…' : editTarget ? 'Update Program' : 'Create Program'}</Button>
              <Button variant="outline-secondary" onClick={() => { setShowForm(false); setEditTarget(null) }}>Cancel</Button>
            </div>
          </form>
        </Card>
      )}

      <div className="d-flex gap-2 mb-3 flex-wrap">
        {['ALL', ...STATUSES].map(s => (
          <button key={s} className={`btn btn-sm ${filter === s ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setFilter(s)}>{s}</button>
        ))}
      </div>

      {loading ? <Loader message="Loading programs…" /> : filtered.length === 0 ? (
        <div className="alert alert-info">{filter === 'ALL' ? 'No vaccination programs found.' : `No programs with status "${filter}".`}</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Vaccine Type</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id}>
                  <td className="fw-medium">#{p.id}</td>
                  <td>
                    <div className="fw-medium">{p.title}</div>
                    <div className="text-muted small">{p.description}</div>
                  </td>
                  <td className="text-muted small">{p.vaccineType ?? '—'}</td>
                  <td>{p.startDate}</td>
                  <td>{p.endDate ?? '—'}</td>
                  <td><StatusBadge status={p.status} /></td>
                  <td><button className="btn btn-sm btn-outline-primary" onClick={() => openEdit(p)}>Edit</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  )
}

export default VaccinationProgramsPage
