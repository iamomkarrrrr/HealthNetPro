import { useState, useEffect, useCallback } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Loader from '../../components/common/Loader'
import StatusBadge from '../../components/common/StatusBadge'
import { getAllOutbreaks, createOutbreak } from '../../api/outbreakApi'

const OUTBREAK_STATUSES = ['DETECTED', 'ACTIVE', 'CONTAINED', 'CLOSED']
const EMPTY_FORM = { diseaseType: '', location: '', startDate: new Date().toISOString().slice(0, 10), endDate: '', status: 'DETECTED' }

const OutbreakUpdatesPage = () => {
  const [outbreaks, setOutbreaks] = useState([])
  const [loading, setLoading] = useState(true)
  const [accessDenied, setAccessDenied] = useState(false)
  const [fetchError, setFetchError] = useState('')
  const [filter, setFilter] = useState('ALL')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [saveSuccess, setSaveSuccess] = useState('')
  const [createDenied, setCreateDenied] = useState(false)

  const fetchOutbreaks = useCallback(() => {
    setLoading(true)
    getAllOutbreaks()
      .then(res => setOutbreaks(res.data?.data ?? []))
      .catch(err => {
        console.error('[OutbreakUpdatesPage]', err?.response ?? err)
        if (err?.response?.status === 403) setAccessDenied(true)
        else if (!err?.response) setFetchError('Backend server is not reachable.')
        else setFetchError(err?.response?.data?.message || 'Failed to load outbreaks')
      })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { fetchOutbreaks() }, [fetchOutbreaks])

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setSaveError('')
    setSaveSuccess('')
    setCreateDenied(false)
    if (!form.diseaseType.trim() || !form.location.trim() || !form.startDate) {
      setSaveError('Disease type, location, and start date are required.')
      return
    }
    setSaving(true)
    try {
      await createOutbreak({
        diseaseType: form.diseaseType,
        location: form.location,
        startDate: form.startDate,
        endDate: form.endDate || null,
        status: form.status,
      })
      setSaveSuccess('Suspected outbreak reported successfully.')
      setForm(EMPTY_FORM)
      setShowForm(false)
      fetchOutbreaks()
    } catch (err) {
      if (err?.response?.status === 403) {
        setCreateDenied(true)
      } else {
        setSaveError(err?.response?.data?.message || 'Failed to report outbreak')
      }
    } finally {
      setSaving(false)
    }
  }

  const active = outbreaks.filter(o => ['DETECTED', 'ACTIVE'].includes(o.status))
  const filtered = filter === 'ALL' ? outbreaks : outbreaks.filter(o => o.status === filter)

  return (
    <DashboardLayout>
      <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-2">
        <div>
          <h2 className="page-title">Outbreak Updates</h2>
          <p className="text-muted mb-0">Monitor disease outbreaks and report suspected cases.</p>
        </div>
        {!accessDenied && (
          <Button onClick={() => { setShowForm(!showForm); setSaveError(''); setSaveSuccess('') }}>
            {showForm ? 'Cancel' : '+ Report Suspected Outbreak'}
          </Button>
        )}
      </div>

      {/* 403 read access denied */}
      {accessDenied && (
        <div className="alert alert-warning">
          <h6 className="alert-heading">⚠️ Access Denied</h6>
          <p className="mb-1">DOCTOR role does not have read permission for outbreak data.</p>
          <p className="mb-0 small">
            <strong>Backend fix:</strong> Add <code>'DOCTOR'</code> to{' '}
            <code>@PreAuthorize</code> on <code>GET /api/v1/outbreaks</code> in{' '}
            <code>OutbreakController.java</code>.
          </p>
        </div>
      )}

      {fetchError && <div className="alert alert-danger py-2">{fetchError}</div>}
      {saveError && <div className="alert alert-danger py-2">{saveError}</div>}
      {saveSuccess && <div className="alert alert-success py-2">{saveSuccess}</div>}

      {/* Create denied message */}
      {createDenied && (
        <div className="alert alert-warning">
          Your role currently does not have permission to create outbreaks. Please contact Admin or Epidemiologist.
        </div>
      )}

      {/* Report form */}
      {showForm && !accessDenied && (
        <Card title="Report Suspected Outbreak" className="mb-4">
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
                <label className="form-label">End Date <span className="text-muted small">(optional)</span></label>
                <input type="date" name="endDate" className="form-control" value={form.endDate} onChange={handleChange} />
              </div>
              <div className="col-md-4">
                <label className="form-label">Status</label>
                <select name="status" className="form-select" value={form.status} onChange={handleChange}>
                  {OUTBREAK_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="d-flex gap-2 mt-3">
              <Button type="submit" disabled={saving}>{saving ? 'Submitting…' : 'Submit Report'}</Button>
              <Button variant="outline-secondary" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </form>
        </Card>
      )}

      {!accessDenied && !fetchError && (
        <>
          {/* Active alert banner */}
          {active.length > 0 && (
            <div className="alert alert-danger d-flex align-items-center gap-2 mb-4">
              <span className="fs-5">⚠️</span>
              <strong>{active.length} active outbreak{active.length > 1 ? 's' : ''} detected.</strong>
            </div>
          )}

          {/* Filter tabs */}
          <div className="d-flex gap-2 mb-4 flex-wrap">
            {['ALL', ...OUTBREAK_STATUSES].map(f => (
              <button
                key={f}
                className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-outline-secondary'}`}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>

          {loading ? <Loader message="Loading outbreaks…" /> : filtered.length === 0 ? (
            <div className="alert alert-info">No outbreaks found for the selected filter.</div>
          ) : (
            <div className="row g-4">
              {filtered.map(o => {
                const isActive = ['DETECTED', 'ACTIVE'].includes(o.status)
                return (
                  <div key={o.id} className="col-md-6 col-xl-4">
                    <div className={`card card-surface h-100 ${isActive ? 'border-danger' : ''}`}>
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <h6 className={`mb-0 ${isActive ? 'text-danger' : ''}`}>{o.diseaseType}</h6>
                          <StatusBadge status={o.status} />
                        </div>
                        <div className="text-muted small mb-2">📍 {o.location}</div>
                        <div className="text-muted small">
                          <span>Start: {o.startDate}</span>
                          {o.endDate && <span className="ms-3">End: {o.endDate}</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}
    </DashboardLayout>
  )
}

export default OutbreakUpdatesPage
