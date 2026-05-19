import { useState, useEffect, useCallback } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Loader from '../../components/common/Loader'
import StatusBadge from '../../components/common/StatusBadge'
import useAuth from '../../hooks/useAuth'
import { getAllDiseaseCases, createDiseaseCase, updateDiseaseCase } from '../../api/diseaseCaseApi'
import { getAllCitizens } from '../../api/citizenApi'

const CASE_STATUSES = ['REPORTED', 'UNDER_TREATMENT', 'RECOVERED', 'CLOSED']
const EMPTY_FORM = { citizenId: '', diseaseType: '', diagnosisDate: '', status: 'REPORTED' }

const DiseaseCasesPage = () => {
  const { user } = useAuth()
  const [cases, setCases] = useState([])
  const [citizens, setCitizens] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editTarget, setEditTarget] = useState(null) // case object being edited
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [saveSuccess, setSaveSuccess] = useState('')
  const [fetchError, setFetchError] = useState('')
  const [filterStatus, setFilterStatus] = useState('ALL')

  const fetchAll = useCallback(() => {
    setLoading(true)
    Promise.allSettled([getAllDiseaseCases(), getAllCitizens()])
      .then(([c, p]) => {
        if (c.status === 'fulfilled') setCases(c.value.data?.data ?? [])
        else setFetchError(c.reason?.response?.data?.message || 'Failed to load cases')
        if (p.status === 'fulfilled') setCitizens(p.value.data?.data ?? [])
      })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const openCreate = () => {
    setEditTarget(null)
    setForm(EMPTY_FORM)
    setSaveError('')
    setSaveSuccess('')
    setShowForm(true)
  }

  const openEdit = (c) => {
    setEditTarget(c)
    setForm({
      citizenId: String(c.citizenId),
      diseaseType: c.diseaseType,
      diagnosisDate: c.diagnosisDate,
      status: c.status,
    })
    setSaveError('')
    setSaveSuccess('')
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaveError('')
    setSaveSuccess('')
    if (!form.citizenId || !form.diseaseType || !form.diagnosisDate) {
      setSaveError('Citizen, disease type, and diagnosis date are required.')
      return
    }
    setSaving(true)
    try {
      if (editTarget) {
        await updateDiseaseCase(editTarget.id, {
          diseaseType: form.diseaseType,
          diagnosisDate: form.diagnosisDate,
          status: form.status,
        })
        setSaveSuccess('Case updated successfully.')
      } else {
        await createDiseaseCase({
          citizenId: Number(form.citizenId),
          doctorId: user.userId,
          diseaseType: form.diseaseType,
          diagnosisDate: form.diagnosisDate,
          status: form.status,
        })
        setSaveSuccess('Case created successfully.')
      }
      setForm(EMPTY_FORM)
      setShowForm(false)
      setEditTarget(null)
      fetchAll()
    } catch (err) {
      setSaveError(err?.response?.data?.message || 'Failed to save case')
    } finally {
      setSaving(false)
    }
  }

  const filtered = filterStatus === 'ALL' ? cases : cases.filter(c => c.status === filterStatus)
  const myCases = filtered.filter(c => String(c.doctorId) === String(user?.userId))

  return (
    <DashboardLayout>
      <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-2">
        <div>
          <h2 className="page-title">Disease Cases</h2>
          <p className="text-muted mb-0">Monitor and manage disease cases assigned to you.</p>
        </div>
        <Button onClick={openCreate}>+ Report New Case</Button>
      </div>

      {fetchError && <div className="alert alert-danger py-2">{fetchError}</div>}
      {saveError && <div className="alert alert-danger py-2">{saveError}</div>}
      {saveSuccess && <div className="alert alert-success py-2">{saveSuccess}</div>}

      {/* Create / Edit form */}
      {showForm && (
        <Card title={editTarget ? `Edit Case #${editTarget.id}` : 'Report New Disease Case'} className="mb-4">
          <form onSubmit={handleSubmit} noValidate>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Citizen <span className="text-danger">*</span></label>
                {citizens.length > 0 ? (
                  <select name="citizenId" className="form-select" value={form.citizenId} onChange={handleChange} disabled={!!editTarget}>
                    <option value="">— Select citizen —</option>
                    {citizens.map(c => (
                      <option key={c.id} value={c.id}>{c.name} (ID: {c.id})</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="number"
                    name="citizenId"
                    className="form-control"
                    value={form.citizenId}
                    onChange={handleChange}
                    placeholder="Enter citizen ID"
                    disabled={!!editTarget}
                  />
                )}
              </div>
              <div className="col-md-6">
                <label className="form-label">Disease Type <span className="text-danger">*</span></label>
                <input
                  type="text"
                  name="diseaseType"
                  className="form-control"
                  value={form.diseaseType}
                  onChange={handleChange}
                  placeholder="e.g. Dengue, COVID-19"
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Diagnosis Date <span className="text-danger">*</span></label>
                <input
                  type="date"
                  name="diagnosisDate"
                  className="form-control"
                  value={form.diagnosisDate}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Status</label>
                <select name="status" className="form-select" value={form.status} onChange={handleChange}>
                  {CASE_STATUSES.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
                </select>
              </div>
            </div>
            <div className="d-flex gap-2 mt-3">
              <Button type="submit" disabled={saving}>{saving ? 'Saving…' : editTarget ? 'Update Case' : 'Create Case'}</Button>
              <Button variant="outline-secondary" onClick={() => { setShowForm(false); setEditTarget(null) }}>Cancel</Button>
            </div>
          </form>
        </Card>
      )}

      {/* Filter tabs */}
      <div className="d-flex gap-2 mb-3 flex-wrap">
        {['ALL', ...CASE_STATUSES].map(s => (
          <button
            key={s}
            className={`btn btn-sm ${filterStatus === s ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => setFilterStatus(s)}
          >
            {s.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      {loading ? <Loader message="Loading cases…" /> : myCases.length === 0 ? (
        <div className="alert alert-info">
          {filterStatus === 'ALL' ? 'No disease cases found for your account.' : `No cases with status "${filterStatus}".`}
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Citizen ID</th>
                <th>Disease Type</th>
                <th>Diagnosis Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {myCases.map(c => (
                <tr key={c.id}>
                  <td className="fw-medium">#{c.id}</td>
                  <td>{c.citizenId}</td>
                  <td>{c.diseaseType}</td>
                  <td>{c.diagnosisDate}</td>
                  <td><StatusBadge status={c.status} /></td>
                  <td>
                    <button className="btn btn-sm btn-outline-primary" onClick={() => openEdit(c)}>Edit</button>
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

export default DiseaseCasesPage
