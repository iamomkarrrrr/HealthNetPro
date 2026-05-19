import { useState, useEffect, useCallback, useRef } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Loader from '../../components/common/Loader'
import StatusBadge from '../../components/common/StatusBadge'
import useCitizen from '../../hooks/useCitizen'
import {
  getHealthProfileByCitizenId,
  createHealthProfile,
  updateHealthProfile,
} from '../../api/healthProfileApi'

const EMPTY = { medicalHistory: '', allergies: '', status: 'ACTIVE' }

const isNotFound = (err) => {
  const status = err?.response?.status
  const msg = (err?.response?.data?.message || '').toLowerCase()
  return status === 404 || msg.includes('not found')
}

const HealthProfilePage = () => {
  const { citizen, citizenId, loading: citizenLoading } = useCitizen()
  const [profile, setProfile] = useState(null)
  const [pageState, setPageState] = useState('loading') // loading | view | create | edit
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [saveSuccess, setSaveSuccess] = useState('')

  const successTimer = useRef(null)
  const showSuccessMsg = (msg) => {
    setSaveSuccess(msg)
    clearTimeout(successTimer.current)
    successTimer.current = setTimeout(() => setSaveSuccess(''), 3000)
  }

  const fetchProfile = useCallback(() => {
    if (!citizenId) return
    setPageState('loading')
    getHealthProfileByCitizenId(citizenId)
      .then((res) => {
        const data = res.data?.data ?? null
        setProfile(data)
        setPageState(data ? 'view' : 'create')
      })
      .catch((err) => {
        if (isNotFound(err)) {
          setProfile(null)
          setPageState('create') // not found → show create form, not error
        } else {
          setSaveError(err?.response?.data?.message || 'Failed to load health profile')
          setPageState('view')
        }
      })
  }, [citizenId])

  useEffect(() => {
    if (!citizenLoading) fetchProfile()
  }, [citizenLoading, fetchProfile])

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.medicalHistory.trim()) { setSaveError('Medical history is required'); return }
    if (!form.allergies.trim()) { setSaveError('Allergies field is required'); return }
    setSaving(true)
    setSaveError('')
    setSaveSuccess('')
    try {
      if (pageState === 'create') {
        await createHealthProfile({ citizenId, ...form })
        showSuccessMsg('Health profile created successfully.')
      } else {
        await updateHealthProfile(profile.id, form)
        showSuccessMsg('Health profile updated successfully.')
      }
      fetchProfile()
    } catch (err) {
      setSaveError(err?.response?.data?.message || 'Failed to save health profile')
    } finally {
      setSaving(false)
    }
  }

  const startEdit = () => {
    setForm({
      medicalHistory: profile.medicalHistory ?? '',
      allergies: profile.allergies ?? '',
      status: profile.status ?? 'ACTIVE',
    })
    setSaveError('')
    setSaveSuccess('')
    setPageState('edit')
  }

  if (citizenLoading || pageState === 'loading') {
    return <DashboardLayout><Loader message="Loading health profile…" /></DashboardLayout>
  }

  return (
    <DashboardLayout>
      <div className="mb-4">
        <h2 className="page-title">Health Profile</h2>
        <p className="text-muted">Your medical history and allergy information on record.</p>
      </div>

      {!citizenId && (
        <div className="alert alert-warning">
          Please <a href="/citizen/profile">create your citizen profile</a> first to manage health data.
        </div>
      )}

      {saveError && <div className="alert alert-danger py-2">{saveError}</div>}
      {saveSuccess && <div className="alert alert-success py-2">{saveSuccess}</div>}

      {/* ── VIEW ── */}
      {pageState === 'view' && profile && (
        <div className="row g-4">
          <div className="col-lg-8">
            <Card title="Medical History">
              <p className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>
                {profile.medicalHistory || 'No medical history recorded.'}
              </p>
            </Card>
          </div>
          <div className="col-lg-4">
            <Card title="Allergies">
              <p className="mb-3" style={{ whiteSpace: 'pre-wrap' }}>
                {profile.allergies || 'No allergies recorded.'}
              </p>
              <div className="text-muted small mb-1">Status</div>
              <StatusBadge status={profile.status} />
              <div className="mt-4">
                <Button onClick={startEdit}>Edit Profile</Button>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* ── CREATE / EDIT FORM ── */}
      {(pageState === 'create' || pageState === 'edit') && (
        <div className="row justify-content-center">
          <div className="col-lg-8">
            {pageState === 'create' && (
              <div className="alert alert-info mb-4">
                <strong>No health profile found.</strong> Create your health profile to keep your
                medical history and allergies available in HealthNet.
              </div>
            )}
            <Card title={pageState === 'create' ? 'Create Health Profile' : 'Edit Health Profile'}>
              <form onSubmit={handleSubmit} noValidate>
                <div className="mb-3">
                  <label className="form-label">Medical History <span className="text-danger">*</span></label>
                  <textarea
                    name="medicalHistory"
                    className="form-control"
                    rows={4}
                    value={form.medicalHistory}
                    onChange={handleChange}
                    placeholder="e.g. Diabetes, Hypertension, Asthma"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Allergies <span className="text-danger">*</span></label>
                  <textarea
                    name="allergies"
                    className="form-control"
                    rows={3}
                    value={form.allergies}
                    onChange={handleChange}
                    placeholder="e.g. Penicillin, Dust, Pollen"
                  />
                </div>
                <div className="mb-4">
                  <label className="form-label">Status</label>
                  <select name="status" className="form-select" value={form.status} onChange={handleChange}>
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                </div>
                <div className="d-flex gap-2">
                  <Button type="submit" disabled={saving}>
                    {saving ? 'Saving…' : pageState === 'create' ? 'Create Profile' : 'Save Changes'}
                  </Button>
                  {pageState === 'edit' && (
                    <Button variant="outline-secondary" onClick={() => setPageState('view')}>
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </Card>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}

export default HealthProfilePage
