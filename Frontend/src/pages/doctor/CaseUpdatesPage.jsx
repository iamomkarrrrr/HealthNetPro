import { useState, useEffect, useCallback, useRef } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Loader from '../../components/common/Loader'
import StatusBadge from '../../components/common/StatusBadge'
import useAuth from '../../hooks/useAuth'
import { getAllDiseaseCases } from '../../api/diseaseCaseApi'
import { getCaseUpdatesByCaseId, createCaseUpdate, updateCaseUpdate } from '../../api/caseUpdateApi'

const UPDATE_STATUSES = ['OBSERVED', 'FOLLOW_UP', 'STABLE', 'CRITICAL', 'CLOSED']
const EMPTY_FORM = { notes: '', date: new Date().toISOString().slice(0, 10), status: 'OBSERVED' }

const CaseUpdatesPage = () => {
  const { user } = useAuth()
  const [cases, setCases] = useState([])
  const [selectedCaseId, setSelectedCaseId] = useState('')
  const [updates, setUpdates] = useState([])
  const [loadingCases, setLoadingCases] = useState(true)
  const [loadingUpdates, setLoadingUpdates] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [saveSuccess, setSaveSuccess] = useState('')
  const [refreshingUpdates, setRefreshingUpdates] = useState(false)
  const [fetchError, setFetchError] = useState('')
  const successTimer = useRef(null)

  useEffect(() => {
    let mounted = true
    getAllDiseaseCases()
      .then(res => { if (mounted) setCases(res.data?.data ?? []) })
      .catch(err => { if (mounted) setFetchError(err?.response?.data?.message || 'Failed to load cases') })
      .finally(() => { if (mounted) setLoadingCases(false) })
    return () => { mounted = false }
  }, [])

  // Fetch updates when case changes — separate loading state, never blocks the list
  const fetchUpdates = useCallback((caseId) => {
    if (!caseId) return
    setLoadingUpdates(true)
    setFetchError('')
    getCaseUpdatesByCaseId(caseId)
      .then(res => setUpdates(res.data?.data ?? []))
      .catch(err => { setFetchError(err?.response?.data?.message || 'Failed to load case updates'); setUpdates([]) })
      .finally(() => setLoadingUpdates(false))
  }, [])

  useEffect(() => { fetchUpdates(selectedCaseId) }, [selectedCaseId, fetchUpdates])

  const showSuccess = (msg) => {
    setSaveSuccess(msg)
    clearTimeout(successTimer.current)
    successTimer.current = setTimeout(() => setSaveSuccess(''), 3000)
  }

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const openCreate = () => { setEditTarget(null); setForm(EMPTY_FORM); setSaveError(''); setSaveSuccess(''); setShowForm(true) }
  const openEdit = (u) => { setEditTarget(u); setForm({ notes: u.notes, date: u.date, status: u.status }); setSaveError(''); setSaveSuccess(''); setShowForm(true) }

  const handleSubmit = async e => {
    e.preventDefault()
    setSaveError('')
    setSaveSuccess('')
    if (!selectedCaseId) { setSaveError('Please select a case first.'); return }
    if (!form.notes.trim()) { setSaveError('Notes are required.'); return }
    if (!form.date) { setSaveError('Date is required.'); return }
    setSaving(true)
    try {
      if (editTarget) {
        const res = await updateCaseUpdate(editTarget.id, { notes: form.notes, date: form.date, status: form.status })
        const updated = res.data?.data ?? { ...editTarget, ...form }
        setUpdates(prev => prev.map(u => u.id === editTarget.id ? { ...u, ...updated } : u))
        showSuccess('Case update saved successfully.')
      } else {
        const res = await createCaseUpdate({
          caseId: Number(selectedCaseId),
          doctorId: user.userId,
          notes: form.notes,
          date: form.date,
          status: form.status,
        })
        const created = res.data?.data
        if (created) {
          setUpdates(prev => [created, ...prev])
        } else {
          // Background refresh without blocking UI — use subtle refreshing state
          setRefreshingUpdates(true)
          getCaseUpdatesByCaseId(selectedCaseId)
            .then(r => setUpdates(r.data?.data ?? []))
            .catch(() => {})
            .finally(() => setRefreshingUpdates(false))
        }
        showSuccess('Case update created successfully.')
      }
      setForm(EMPTY_FORM)
      setShowForm(false)
      setEditTarget(null)
    } catch (err) {
      setSaveError(err?.response?.data?.message || 'Failed to save case update')
    } finally {
      setSaving(false)
    }
  }

  const selectedCase = cases.find(c => String(c.id) === String(selectedCaseId))

  return (
    <DashboardLayout>
      <div className="mb-4">
        <h2 className="page-title">Case Updates</h2>
        <p className="text-muted">Track progress notes and timeline updates for disease cases.</p>
      </div>

      {fetchError  && <div className="alert alert-danger py-2">{fetchError}</div>}
      {saveError   && <div className="alert alert-danger py-2">{saveError}</div>}
      {saveSuccess && <div className="alert alert-success py-2">{saveSuccess}</div>}
      {refreshingUpdates && (
        <div className="text-muted small mb-2">
          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
          Refreshing updates…
        </div>
      )}

      <Card title="Select Case" className="mb-4">
        <div className="row g-3 align-items-end">
          <div className="col-md-6">
            <label className="form-label">Disease Case</label>
            {loadingCases ? <Loader message="Loading cases…" /> : (
              cases.length > 0 ? (
                <select className="form-select" value={selectedCaseId} onChange={e => { setSelectedCaseId(e.target.value); setShowForm(false) }}>
                  <option value="">— Select a case —</option>
                  {cases.map(c => <option key={c.id} value={c.id}>#{c.id} — {c.diseaseType} (Citizen #{c.citizenId}) [{c.status}]</option>)}
                </select>
              ) : (
                <input type="number" className="form-control" placeholder="Enter case ID manually" value={selectedCaseId} onChange={e => setSelectedCaseId(e.target.value)} />
              )
            )}
          </div>
          {selectedCase && (
            <div className="col-md-6">
              <div className="d-flex gap-2 align-items-center">
                <span className="text-muted small">Status:</span>
                <StatusBadge status={selectedCase.status} />
                <span className="text-muted small ms-2">Disease: <strong>{selectedCase.diseaseType}</strong></span>
              </div>
            </div>
          )}
        </div>
      </Card>

      {showForm && (
        <Card title={editTarget ? `Edit Update #${editTarget.id}` : 'Add Case Update'} className="mb-4">
          <form onSubmit={handleSubmit} noValidate>
            <div className="row g-3">
              <div className="col-12">
                <label className="form-label">Notes <span className="text-danger">*</span></label>
                <textarea name="notes" className="form-control" rows={3} value={form.notes} onChange={handleChange} placeholder="e.g. Patient fever reduced, continue hydration and medication" />
              </div>
              <div className="col-md-6">
                <label className="form-label">Date <span className="text-danger">*</span></label>
                <input type="date" name="date" className="form-control" value={form.date} onChange={handleChange} />
              </div>
              <div className="col-md-6">
                <label className="form-label">Status</label>
                <select name="status" className="form-select" value={form.status} onChange={handleChange}>
                  {UPDATE_STATUSES.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
                </select>
              </div>
            </div>
            <div className="d-flex gap-2 mt-3">
              <Button type="submit" disabled={saving}>{saving ? 'Saving…' : editTarget ? 'Save Changes' : 'Add Update'}</Button>
              <Button variant="outline-secondary" onClick={() => { setShowForm(false); setEditTarget(null) }}>Cancel</Button>
            </div>
          </form>
        </Card>
      )}

      {selectedCaseId && (
        <Card
          header={
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Updates for Case #{selectedCaseId}</h5>
              {!showForm && <Button onClick={openCreate}>+ Add Update</Button>}
            </div>
          }
        >
          {loadingUpdates ? <Loader message="Loading updates…" /> : updates.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-muted mb-3">No case updates found for this case.</p>
              <Button onClick={openCreate}>Add First Update</Button>
            </div>
          ) : (
            <ul className="list-unstyled mb-0">
              {updates.map(u => (
                <li key={u.id} className="py-3 border-bottom">
                  <div className="d-flex justify-content-between align-items-start">
                    <div className="flex-fill me-3">
                      <div className="d-flex align-items-center gap-2 mb-1">
                        <span className="fw-medium small">Update #{u.id}</span>
                        <StatusBadge status={u.status} />
                        <span className="text-muted" style={{ fontSize: '0.75rem' }}>{u.date}</span>
                      </div>
                      <p className="mb-0 small">{u.notes}</p>
                    </div>
                    <button className="btn btn-sm btn-outline-secondary flex-shrink-0" onClick={() => openEdit(u)}>Edit</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      )}

      {!selectedCaseId && !loadingCases && (
        <div className="alert alert-info">Select a case above to view and manage its updates.</div>
      )}
    </DashboardLayout>
  )
}

export default CaseUpdatesPage
