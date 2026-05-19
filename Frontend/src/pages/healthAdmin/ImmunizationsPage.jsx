import { useState, useEffect, useCallback } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Loader from '../../components/common/Loader'
import StatusBadge from '../../components/common/StatusBadge'
import { getAllCitizens } from '../../api/citizenApi'
import { getImmunizationsByCitizenId, createImmunization, updateImmunization } from '../../api/immunizationApi'

const IMM_STATUSES = ['GIVEN', 'PENDING', 'MISSED']
const EMPTY_FORM = { vaccineType: '', date: new Date().toISOString().slice(0, 10), status: 'GIVEN' }

const ImmunizationsPage = () => {
  const [citizens, setCitizens] = useState([])
  const [selectedCitizenId, setSelectedCitizenId] = useState('')
  const [immunizations, setImmunizations] = useState([])
  const [loadingCitizens, setLoadingCitizens] = useState(true)
  const [loadingImm, setLoadingImm] = useState(false)
  const [fetchError, setFetchError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [saveSuccess, setSaveSuccess] = useState('')

  useEffect(() => {
    getAllCitizens()
      .then(res => setCitizens(res.data?.data ?? []))
      .catch(() => {})
      .finally(() => setLoadingCitizens(false))
  }, [])

  const fetchImmunizations = useCallback(() => {
    if (!selectedCitizenId) return
    setLoadingImm(true)
    setFetchError('')
    getImmunizationsByCitizenId(selectedCitizenId)
      .then(res => setImmunizations(res.data?.data ?? []))
      .catch(err => {
        if (err?.response?.status === 403) setFetchError('Access denied. Backend permissions required.')
        else setFetchError(err?.response?.data?.message || 'Failed to load immunizations')
        setImmunizations([])
      })
      .finally(() => setLoadingImm(false))
  }, [selectedCitizenId])

  useEffect(() => { fetchImmunizations() }, [fetchImmunizations])

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const openCreate = () => {
    setEditTarget(null)
    setForm(EMPTY_FORM)
    setSaveError('')
    setSaveSuccess('')
    setShowForm(true)
  }

  const openEdit = imm => {
    setEditTarget(imm)
    setForm({ vaccineType: imm.vaccineType, date: imm.date, status: imm.status })
    setSaveError('')
    setSaveSuccess('')
    setShowForm(true)
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setSaveError('')
    setSaveSuccess('')
    if (!form.vaccineType.trim()) { setSaveError('Vaccine type is required.'); return }
    if (!form.date) { setSaveError('Date is required.'); return }
    setSaving(true)
    try {
      if (editTarget) {
        await updateImmunization(editTarget.id, { vaccineType: form.vaccineType, date: form.date, status: form.status })
        setSaveSuccess('Immunization updated successfully.')
      } else {
        await createImmunization({ citizenId: Number(selectedCitizenId), vaccineType: form.vaccineType, date: form.date, status: form.status })
        setSaveSuccess('Immunization created successfully.')
      }
      setForm(EMPTY_FORM)
      setShowForm(false)
      setEditTarget(null)
      fetchImmunizations()
    } catch (err) {
      if (err?.response?.status === 403) setSaveError('Access denied. Your role may not have permission to manage immunizations.')
      else setSaveError(err?.response?.data?.message || 'Failed to save immunization')
    } finally {
      setSaving(false)
    }
  }

  const selectedCitizen = citizens.find(c => String(c.id) === String(selectedCitizenId))

  const summary = IMM_STATUSES.map(s => ({ status: s, count: immunizations.filter(i => i.status === s).length }))

  return (
    <DashboardLayout>
      <div className="mb-4">
        <h2 className="page-title">Immunizations</h2>
        <p className="text-muted">Monitor and manage citizen immunization records.</p>
      </div>

      {saveError && <div className="alert alert-danger py-2">{saveError}</div>}
      {saveSuccess && <div className="alert alert-success py-2">{saveSuccess}</div>}

      <Card title="Select Citizen" className="mb-4">
        <div className="row g-3 align-items-end">
          <div className="col-md-6">
            <label className="form-label">Citizen</label>
            {loadingCitizens ? <Loader message="Loading citizens…" /> : citizens.length > 0 ? (
              <select className="form-select" value={selectedCitizenId} onChange={e => { setSelectedCitizenId(e.target.value); setShowForm(false) }}>
                <option value="">— Select a citizen —</option>
                {citizens.map(c => <option key={c.id} value={c.id}>{c.name} (ID: {c.id})</option>)}
              </select>
            ) : (
              <input type="number" className="form-control" placeholder="Enter citizen ID" value={selectedCitizenId} onChange={e => setSelectedCitizenId(e.target.value)} />
            )}
          </div>
          {selectedCitizen && (
            <div className="col-md-6 d-flex align-items-center gap-2">
              <StatusBadge status={selectedCitizen.status} />
              <span className="text-muted small">{selectedCitizen.gender} · DOB: {selectedCitizen.dob}</span>
            </div>
          )}
        </div>
      </Card>

      {showForm && (
        <Card title={editTarget ? `Edit Immunization #${editTarget.id}` : 'Add Immunization'} className="mb-4">
          <form onSubmit={handleSubmit} noValidate>
            <div className="row g-3">
              <div className="col-md-5">
                <label className="form-label">Vaccine Type <span className="text-danger">*</span></label>
                <input type="text" name="vaccineType" className="form-control" value={form.vaccineType} onChange={handleChange} placeholder="e.g. COVID-19 Booster" />
              </div>
              <div className="col-md-4">
                <label className="form-label">Date <span className="text-danger">*</span></label>
                <input type="date" name="date" className="form-control" value={form.date} onChange={handleChange} />
              </div>
              <div className="col-md-3">
                <label className="form-label">Status</label>
                <select name="status" className="form-select" value={form.status} onChange={handleChange}>
                  {IMM_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="d-flex gap-2 mt-3">
              <Button type="submit" disabled={saving}>{saving ? 'Saving…' : editTarget ? 'Update' : 'Add Immunization'}</Button>
              <Button variant="outline-secondary" onClick={() => { setShowForm(false); setEditTarget(null) }}>Cancel</Button>
            </div>
          </form>
        </Card>
      )}

      {selectedCitizenId && (
        <Card
          header={
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Immunizations for Citizen #{selectedCitizenId}</h5>
              {!showForm && <Button onClick={openCreate}>+ Add Immunization</Button>}
            </div>
          }
        >
          {fetchError && <div className="alert alert-warning py-2">{fetchError}</div>}

          {immunizations.length > 0 && (
            <div className="row g-3 mb-4">
              {summary.map(({ status, count }) => (
                <div key={status} className="col-md-4">
                  <div className="card card-surface text-center py-3">
                    <div className="fw-bold fs-4">{count}</div>
                    <StatusBadge status={status} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {loadingImm ? <Loader message="Loading immunizations…" /> : immunizations.length === 0 && !fetchError ? (
            <div className="text-center py-4">
              <p className="text-muted mb-3">No immunization records found for this citizen.</p>
              <Button onClick={openCreate}>Add First Immunization</Button>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Vaccine Type</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {immunizations.map(i => (
                    <tr key={i.id}>
                      <td className="fw-medium">#{i.id}</td>
                      <td>{i.vaccineType}</td>
                      <td>{i.date}</td>
                      <td><StatusBadge status={i.status} /></td>
                      <td><button className="btn btn-sm btn-outline-primary" onClick={() => openEdit(i)}>Edit</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}

      {!selectedCitizenId && !loadingCitizens && (
        <div className="alert alert-info">Select a citizen above to view and manage immunization records.</div>
      )}
    </DashboardLayout>
  )
}

export default ImmunizationsPage
