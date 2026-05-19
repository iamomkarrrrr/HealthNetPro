import { useState, useEffect, useCallback } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Card from '../../components/common/Card'
import Loader from '../../components/common/Loader'
import StatusBadge from '../../components/common/StatusBadge'
import { getAllCitizens, getCitizenById, updateCitizen } from '../../api/citizenApi'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'

const CitizenOverviewPage = () => {
  const [citizens, setCitizens] = useState([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState('')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)
  const [editMode, setEditMode] = useState(false)
  const [form, setForm] = useState({})
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [saveSuccess, setSaveSuccess] = useState('')

  useEffect(() => {
    getAllCitizens()
      .then(res => setCitizens(res.data?.data ?? []))
      .catch(err => {
        if (err?.response?.status === 403) setFetchError('Access denied. HEALTH_ADMINISTRATOR role requires citizen read permission.')
        else setFetchError(err?.response?.data?.message || 'Failed to load citizens')
      })
      .finally(() => setLoading(false))
  }, [])

  const filtered = citizens.filter(c => {
    const q = search.toLowerCase()
    return !q || c.name?.toLowerCase().includes(q) || String(c.id).includes(q) ||
      c.contactInfo?.includes(q) || c.address?.toLowerCase().includes(q)
  })

  const openDetail = c => {
    setSelected(c)
    setEditMode(false)
    setSaveError('')
    setSaveSuccess('')
  }

  const startEdit = () => {
    setForm({ name: selected.name ?? '', dob: selected.dob ?? '', gender: selected.gender ?? 'MALE', address: selected.address ?? '', contactInfo: selected.contactInfo ?? '' })
    setEditMode(true)
  }

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSave = async e => {
    e.preventDefault()
    setSaving(true)
    setSaveError('')
    setSaveSuccess('')
    try {
      const res = await updateCitizen(selected.id, form)
      const updated = res.data?.data ?? { ...selected, ...form }
      setSelected(updated)
      setCitizens(prev => prev.map(c => c.id === selected.id ? updated : c))
      setSaveSuccess('Citizen updated successfully.')
      setEditMode(false)
    } catch (err) {
      if (err?.response?.status === 403) setSaveError('Update is restricted by backend permissions.')
      else setSaveError(err?.response?.data?.message || 'Failed to update citizen')
    } finally {
      setSaving(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="mb-4">
        <h2 className="page-title">Citizen Overview</h2>
        <p className="text-muted">Browse and manage registered citizen records.</p>
      </div>

      {fetchError && <div className="alert alert-warning">{fetchError}</div>}

      <div className="row g-4">
        <div className={selected ? 'col-lg-5' : 'col-12'}>
          <Card title={`Citizens (${filtered.length})`}>
            <input
              type="text"
              className="form-control mb-3"
              placeholder="Search by name, ID, contact, or address…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {loading ? <Loader message="Loading citizens…" /> : filtered.length === 0 ? (
              <p className="text-muted small mb-0">{citizens.length === 0 ? 'No citizens found.' : 'No results match your search.'}</p>
            ) : (
              <div style={{ maxHeight: '520px', overflowY: 'auto' }}>
                {filtered.map(c => (
                  <div
                    key={c.id}
                    className={`p-3 rounded mb-2 border ${selected?.id === c.id ? 'border-primary bg-primary bg-opacity-10' : 'border-light bg-light'}`}
                    style={{ cursor: 'pointer' }}
                    onClick={() => openDetail(c)}
                  >
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <div className="fw-medium">{c.name}</div>
                        <div className="text-muted small">ID: {c.id} · {c.gender} · DOB: {c.dob}</div>
                        <div className="text-muted small">{c.contactInfo}</div>
                      </div>
                      <StatusBadge status={c.status} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {selected && (
          <div className="col-lg-7">
            <Card
              header={
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">{selected.name}</h5>
                  <button className="btn-close" onClick={() => { setSelected(null); setEditMode(false) }} />
                </div>
              }
            >
              {saveError && <div className="alert alert-danger py-2 mb-3">{saveError}</div>}
              {saveSuccess && <div className="alert alert-success py-2 mb-3">{saveSuccess}</div>}

              {!editMode ? (
                <>
                  <div className="row g-3 mb-4">
                    {[
                      ['Citizen ID', selected.id],
                      ['Date of Birth', selected.dob],
                      ['Gender', selected.gender],
                      ['Contact', selected.contactInfo],
                      ['Address', selected.address],
                      ['Status', <StatusBadge key="s" status={selected.status} />],
                    ].map(([label, value]) => (
                      <div key={label} className="col-md-6">
                        <div className="text-muted small">{label}</div>
                        <div className="fw-medium">{value ?? '—'}</div>
                      </div>
                    ))}
                  </div>
                  <Button onClick={startEdit}>Edit Citizen</Button>
                </>
              ) : (
                <form onSubmit={handleSave} noValidate>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <Input id="name" name="name" label="Full Name" value={form.name} onChange={handleChange} />
                    </div>
                    <div className="col-md-6">
                      <Input id="dob" name="dob" type="date" label="Date of Birth" value={form.dob} onChange={handleChange} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Gender</label>
                      <select name="gender" className="form-select" value={form.gender} onChange={handleChange}>
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                        <option value="OTHER">Other</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <Input id="contactInfo" name="contactInfo" label="Contact Info" value={form.contactInfo} onChange={handleChange} />
                    </div>
                    <div className="col-12">
                      <Input id="address" name="address" label="Address" value={form.address} onChange={handleChange} />
                    </div>
                  </div>
                  <div className="d-flex gap-2 mt-3">
                    <Button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save Changes'}</Button>
                    <Button variant="outline-secondary" onClick={() => setEditMode(false)}>Cancel</Button>
                  </div>
                </form>
              )}
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default CitizenOverviewPage
