import { useState, useEffect, useCallback } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import Loader from '../../components/common/Loader'
import StatusBadge from '../../components/common/StatusBadge'
import { getAllUsers, createUser, updateUser, updateUserStatus } from '../../api/userApi'
import { getRoleLabel, STAFF_ASSIGNABLE_ROLES } from '../../utils/roles'

const USER_STATUSES = ['ACTIVE', 'INACTIVE', 'SUSPENDED']
const EMPTY_FORM = { name: '', email: '', phone: '', password: '', role: 'DOCTOR' }

const ROLE_BADGE_CLASS = {
  HEALTH_ADMINISTRATOR: 'bg-info text-white',
  ADMIN:                'bg-info text-white',
  DOCTOR:               'bg-primary text-white',
  HEALTH_WORKER:        'bg-primary text-white',
  EPIDEMIOLOGIST:       'bg-warning text-dark',
  COMPLIANCE_OFFICER:   'bg-secondary text-white',
  AUDITOR:              'bg-dark text-white',
  GOVERNMENT_AUDITOR:   'bg-dark text-white',
}

const StaffManagementPage = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState('')
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('ALL')
  const [showForm, setShowForm] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [saveSuccess, setSaveSuccess] = useState('')
  const [statusUpdating, setStatusUpdating] = useState(null)

  const fetchUsers = useCallback(() => {
    setLoading(true)
    getAllUsers()
      .then(res => setUsers(res.data?.data ?? []))
      .catch(err => {
        if (err?.response?.status === 403) setFetchError('Staff management is restricted by backend permissions.')
        else setFetchError(err?.response?.data?.message || 'Failed to load users')
      })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { fetchUsers() }, [fetchUsers])

  // Show only non-citizen staff in this view
  const staffUsers = users.filter(u => u.role !== 'CITIZEN')

  const filtered = staffUsers.filter(u => {
    const q = search.toLowerCase()
    const matchSearch = !q || u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q) || String(u.id).includes(q)
    const matchRole = roleFilter === 'ALL' || u.role === roleFilter
    return matchSearch && matchRole
  })

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const openCreate = () => {
    setEditTarget(null)
    setForm(EMPTY_FORM)
    setSaveError('')
    setSaveSuccess('')
    setShowForm(true)
  }

  const openEdit = u => {
    setEditTarget(u)
    setForm({ name: u.name ?? '', email: u.email ?? '', phone: u.phone ?? '', password: '', role: u.role })
    setSaveError('')
    setSaveSuccess('')
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setSaveError('')
    setSaveSuccess('')
    if (!form.name.trim() || !form.email.trim()) { setSaveError('Name and email are required.'); return }
    if (!editTarget && !form.password.trim()) { setSaveError('Password is required for new users.'); return }
    setSaving(true)
    try {
      if (editTarget) {
        await updateUser(editTarget.id, { name: form.name, phone: form.phone })
        setSaveSuccess('Staff user updated successfully.')
      } else {
        await createUser({ name: form.name, email: form.email, phone: form.phone, password: form.password, role: form.role })
        setSaveSuccess('Staff user created successfully.')
      }
      setForm(EMPTY_FORM)
      setShowForm(false)
      setEditTarget(null)
      fetchUsers()
    } catch (err) {
      if (err?.response?.status === 403) setSaveError('Staff creation is restricted by backend permissions.')
      else setSaveError(err?.response?.data?.message || 'Failed to save user')
    } finally {
      setSaving(false)
    }
  }

  const handleStatusChange = async (userId, status) => {
    setStatusUpdating(userId)
    try {
      await updateUserStatus(userId, { status })
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, status } : u))
    } catch (err) {
      if (err?.response?.status === 403) setSaveError('Status update is restricted by backend permissions.')
      else setSaveError(err?.response?.data?.message || 'Failed to update status')
    } finally {
      setStatusUpdating(null)
    }
  }

  return (
    <DashboardLayout>
      <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-2">
        <div>
          <h2 className="page-title">Staff Management</h2>
          <p className="text-muted mb-0">View, create, and manage internal staff accounts.</p>
        </div>
        <Button onClick={openCreate}>+ Add Staff User</Button>
      </div>

      {fetchError && <div className="alert alert-warning">{fetchError}</div>}
      {saveError && <div className="alert alert-danger py-2">{saveError}</div>}
      {saveSuccess && <div className="alert alert-success py-2">{saveSuccess}</div>}

      {showForm && (
        <Card title={editTarget ? `Edit User #${editTarget.id}` : 'Create Staff User'} className="mb-4">
          <form onSubmit={handleSubmit} noValidate>
            <div className="row g-3">
              <div className="col-md-6">
                <Input id="name" name="name" label="Full Name *" value={form.name} onChange={handleChange} />
              </div>
              <div className="col-md-6">
                <Input id="email" name="email" type="email" label="Email *" value={form.email} onChange={handleChange} disabled={!!editTarget} />
              </div>
              <div className="col-md-6">
                <Input id="phone" name="phone" label="Phone" value={form.phone} onChange={handleChange} />
              </div>
              {!editTarget && (
                <div className="col-md-6">
                  <Input id="password" name="password" type="password" label="Password *" value={form.password} onChange={handleChange} />
                </div>
              )}
              {!editTarget && (
                <div className="col-md-6">
                  <label className="form-label">Role</label>
                  <select name="role" className="form-select" value={form.role} onChange={handleChange}>
                    {STAFF_ASSIGNABLE_ROLES.map(r => (
                      <option key={r} value={r}>{getRoleLabel(r)}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            <div className="d-flex gap-2 mt-3">
              <Button type="submit" disabled={saving}>{saving ? 'Saving…' : editTarget ? 'Update User' : 'Create User'}</Button>
              <Button variant="outline-secondary" onClick={() => { setShowForm(false); setEditTarget(null) }}>Cancel</Button>
            </div>
          </form>
        </Card>
      )}

      <Card title="Staff Users">
        <div className="row g-3 mb-3">
          <div className="col-md-6">
            <input
              type="text"
              className="form-control"
              placeholder="Search by name, email, or ID…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="col-md-4">
            <select className="form-select" value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
              <option value="ALL">All Roles</option>
              {STAFF_ASSIGNABLE_ROLES.map(r => (
                <option key={r} value={r}>{getRoleLabel(r)}</option>
              ))}
            </select>
          </div>
        </div>

        {loading ? <Loader message="Loading staff…" /> : filtered.length === 0 ? (
          <div className="alert alert-info mb-0">No staff users found.</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(u => (
                  <tr key={u.id}>
                    <td className="fw-medium">#{u.id}</td>
                    <td>{u.name}</td>
                    <td className="text-muted small">{u.email}</td>
                    <td className="text-muted small">{u.phone ?? '—'}</td>
                    <td>
                      <span className={`badge ${ROLE_BADGE_CLASS[u.role] ?? 'bg-secondary text-white'}`}>
                        {getRoleLabel(u.role)}
                      </span>
                    </td>
                    <td><StatusBadge status={u.status} /></td>
                    <td>
                      <div className="d-flex gap-1 flex-wrap">
                        <button className="btn btn-sm btn-outline-primary" onClick={() => openEdit(u)}>Edit</button>
                        {USER_STATUSES.filter(s => s !== u.status).map(s => (
                          <button
                            key={s}
                            className="btn btn-sm btn-outline-secondary"
                            disabled={statusUpdating === u.id}
                            onClick={() => handleStatusChange(u.id, s)}
                          >
                            {statusUpdating === u.id ? '…' : s}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </DashboardLayout>
  )
}

export default StaffManagementPage
