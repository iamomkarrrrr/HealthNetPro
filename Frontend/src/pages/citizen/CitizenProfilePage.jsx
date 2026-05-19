import { useState, useEffect, useRef } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import Loader from '../../components/common/Loader'
import ErrorMessage from '../../components/common/ErrorMessage'
import StatusBadge from '../../components/common/StatusBadge'
import useCitizen from '../../hooks/useCitizen'
import { updateMyCitizen, createMyCitizen } from '../../api/citizenApi'
import useAuth from '../../hooks/useAuth'

const EMPTY_FORM = { name: '', dob: '', gender: 'MALE', address: '', contactInfo: '' }

const CitizenProfilePage = () => {
  const { user } = useAuth()
  const { citizen, loading, error, setCitizen } = useCitizen()
  const [editing, setEditing] = useState(false)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [formError, setFormError] = useState({})
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [saveSuccess, setSaveSuccess] = useState('')

  const successTimer = useRef(null)
  const showSuccessMsg = (msg) => {
    setSaveSuccess(msg)
    clearTimeout(successTimer.current)
    successTimer.current = setTimeout(() => setSaveSuccess(''), 3000)
  }

  useEffect(() => {
    if (citizen) {
      setForm({
        name: citizen.name ?? '',
        dob: citizen.dob ?? '',
        gender: citizen.gender ?? 'MALE',
        address: citizen.address ?? '',
        contactInfo: citizen.contactInfo ?? '',
      })
    }
  }, [citizen])

  const validate = () => {
    const errs = {}
    if (!form.name) errs.name = 'Name is required'
    if (!form.dob) errs.dob = 'Date of birth is required'
    if (!form.gender) errs.gender = 'Gender is required'
    if (!form.address) errs.address = 'Address is required'
    if (!form.contactInfo) errs.contactInfo = 'Contact info is required'
    else if (!/^\d{10}$/.test(form.contactInfo)) errs.contactInfo = 'Must be exactly 10 digits'
    setFormError(errs)
    return Object.keys(errs).length === 0
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setFormError({ ...formError, [e.target.name]: '' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setSaving(true)
    setSaveError('')
    setSaveSuccess('')
    try {
      const fn = citizen ? updateMyCitizen : createMyCitizen
      const res = await fn(form)
      setCitizen(res.data?.data)
      showSuccessMsg(citizen ? 'Profile updated successfully.' : 'Profile created successfully.')
      setEditing(false)
      setCreating(false)
    } catch (err) {
      setSaveError(err?.response?.data?.message || 'Failed to save profile')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <DashboardLayout><Loader message="Loading profile…" /></DashboardLayout>

  const showForm = editing || creating

  return (
    <DashboardLayout>
      <div className="mb-4">
        <h2 className="page-title">My Profile</h2>
        <p className="text-muted">Your citizen registration details.</p>
      </div>

      {error && <ErrorMessage message={error} />}
      {saveError && <ErrorMessage message={saveError} />}
      {saveSuccess && <div className="alert alert-success py-2">{saveSuccess}</div>}

      {!citizen && !creating && (
        <div className="alert alert-warning d-flex justify-content-between align-items-center">
          <span>You have not created a citizen profile yet.</span>
          <Button onClick={() => setCreating(true)}>Create Profile</Button>
        </div>
      )}

      {citizen && !showForm && (
        <Card title="Citizen Profile" className="mb-4">
          <div className="row g-3">
            {[
              ['Name', citizen.name],
              ['Date of Birth', citizen.dob],
              ['Gender', citizen.gender],
              ['Address', citizen.address],
              ['Contact Info', citizen.contactInfo],
            ].map(([label, value]) => (
              <div key={label} className="col-md-6">
                <div className="text-muted small">{label}</div>
                <div className="fw-medium">{value ?? '—'}</div>
              </div>
            ))}
            <div className="col-md-6">
              <div className="text-muted small">Status</div>
              <StatusBadge status={citizen.status} />
            </div>
          </div>
          <div className="mt-4">
            <Button onClick={() => setEditing(true)}>Edit Profile</Button>
          </div>
        </Card>
      )}

      {showForm && (
        <Card title={citizen ? 'Edit Profile' : 'Create Citizen Profile'}>
          <form onSubmit={handleSubmit} noValidate>
            <div className="row g-3">
              <div className="col-md-6">
                <Input id="name" name="name" label="Full Name" value={form.name} onChange={handleChange} error={formError.name} />
              </div>
              <div className="col-md-6">
                <Input id="dob" name="dob" label="Date of Birth" type="date" value={form.dob} onChange={handleChange} error={formError.dob} />
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Gender</label>
                  <select name="gender" className="form-select" value={form.gender} onChange={handleChange}>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
              </div>
              <div className="col-md-6">
                <Input id="contactInfo" name="contactInfo" label="Contact Info (10 digits)" value={form.contactInfo} onChange={handleChange} error={formError.contactInfo} />
              </div>
              <div className="col-12">
                <Input id="address" name="address" label="Address" value={form.address} onChange={handleChange} error={formError.address} />
              </div>
            </div>
            <div className="d-flex gap-2 mt-3">
              <Button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save'}</Button>
              <Button variant="outline-secondary" onClick={() => { setEditing(false); setCreating(false) }}>Cancel</Button>
            </div>
          </form>
        </Card>
      )}

      {/* Account info (read-only from auth) */}
      <Card title="Account Information" className="mt-4">
        <div className="row g-3">
          {[['Name', user?.name], ['Email', user?.email], ['Role', user?.role], ['Account Status', user?.status]].map(([label, value]) => (
            <div key={label} className="col-md-6">
              <div className="text-muted small">{label}</div>
              <div className="fw-medium">{value ?? '—'}</div>
            </div>
          ))}
        </div>
      </Card>
    </DashboardLayout>
  )
}

export default CitizenProfilePage
