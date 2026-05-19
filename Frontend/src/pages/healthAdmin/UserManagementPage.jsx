import { useState, useEffect, useCallback } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import Loader from '../../components/common/Loader'
import StatusBadge from '../../components/common/StatusBadge'
import { getAllUsers, updateUser, updateUserStatus } from '../../api/userApi'
import { getRoleLabel, STAFF_ASSIGNABLE_ROLES } from '../../utils/roles'

const USER_STATUSES = ['ACTIVE', 'INACTIVE', 'SUSPENDED']

const ROLE_BADGE_CLASS = {
  HEALTH_ADMINISTRATOR: 'bg-info text-white',
  ADMIN:                'bg-info text-white',
  DOCTOR:               'bg-primary text-white',
  HEALTH_WORKER:        'bg-primary text-white',
  EPIDEMIOLOGIST:       'bg-warning text-dark',
  COMPLIANCE_OFFICER:   'bg-secondary text-white',
  AUDITOR:              'bg-dark text-white',
  GOVERNMENT_AUDITOR:   'bg-dark text-white',
  CITIZEN:              'bg-success text-white',
}

const UserManagementPage = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState('')
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('ALL')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [editTarget, setEditTarget] = useState(null)
  const [editForm, setEditForm] = useState({ name: '', phone: '' })
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [saveSuccess, setSaveSuccess] = useState('')
  const [statusUpdating, setStatusUpdating] = useState(null)

  const fetchUsers = useCallback(() => {
    setLoading(true)
    getAllUsers()
      .then(res => setUsers(res.data?.data ?? []))
      .catch(err => {
        if (err?.response?.status === 403) setFetchError('Access denied. Your role may not have permission to view users.')
        else setFetchError(err?.response?.data?.message || 'Failed to load users')
      })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { fetchUsers() }, [fetchUsers])

  // Unique role values present in data (mapped to labels for filter dropdown)
  const roleValues = [...new Set(users.map(u => u.role).filter(Boolean))]

  const filtered = users.filter(u => {
    const q = search.toLowerCase()
    const matchSearch = !q ||
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      String(u.id).includes(q)
    const matchRole = roleFilter === 'ALL' || u.role === roleFilter
    const matchStatus = statusFilter === 'ALL' || u.status === statusFilter
    return matchSearch && matchRole && matchStatus
  })

  const openEdit = u => {
    setEditTarget(u)
    setEditForm({ name: u.name ?? '', phone: u.phone ?? '' })
    setSaveError('')
    setSaveSuccess('')
  }

  const handleEditChange = e => setEditForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleEditSave = async e => {
    e.preventDefault()
    if (!editForm.name.trim()) { setSaveError('Name is required.'); return }
    setSaving(true)
    setSaveError('')
    setSaveSuccess('')
    try {
      await updateUser(editTarget.id, { name: editForm.name, phone: editForm.phone })
      setUsers(prev => prev.map(u => u.id === editTarget.id ? { ...u, ...editForm } : u))
      setSaveSuccess('User updated successfully.')
      setEditTarget(null)
    } catch (err) {
      if (err?.response?.status === 403) setSaveError('Update is restricted by backend permissions.')
      else setSaveError(err?.response?.data?.message || 'Failed to update user')
    } finally {
      setSaving(false)
    }
  }

  const handleStatusChange = async (userId, status) => {
    setStatusUpdating(userId)
    setSaveError('')
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
      <div className="mb-4">
        <h2 className="page-title">User Management</h2>
        <p className="text-muted">View and manage all system user accounts.</p>
      </div>

      {fetchError && <div className="alert alert-warning">{fetchError}</div>}
      {saveError && <div className="alert alert-danger py-2">{saveError}</div>}
      {saveSuccess && <div className="alert alert-success py-2">{saveSuccess}</div>}

      {/* Edit inline panel */}
      {editTarget && (
        <Card title={`Edit User #${editTarget.id} — ${editTarget.name}`} className="mb-4">
          <form onSubmit={handleEditSave} noValidate>
            <div className="row g-3">
              <div className="col-md-6">
                <Input id="name" name="name" label="Full Name *" value={editForm.name} onChange={handleEditChange} />
              </div>
              <div className="col-md-6">
                <Input id="phone" name="phone" label="Phone" value={editForm.phone} onChange={handleEditChange} />
              </div>
            </div>
            <div className="d-flex gap-2 mt-3">
              <Button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save Changes'}</Button>
              <Button variant="outline-secondary" onClick={() => setEditTarget(null)}>Cancel</Button>
            </div>
          </form>
        </Card>
      )}

      <Card title={`All Users (${filtered.length})`}>
        {/* Filters */}
        <div className="row g-3 mb-3">
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Search by name, email, or ID…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="col-md-3">
            <select className="form-select" value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
              <option value="ALL">All Roles</option>
              {roleValues.map(r => (
                <option key={r} value={r}>{getRoleLabel(r)}</option>
              ))}
            </select>
          </div>
          <div className="col-md-3">
            <select className="form-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="ALL">All Statuses</option>
              {USER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {loading ? <Loader message="Loading users…" /> : filtered.length === 0 ? (
          <div className="alert alert-info mb-0">No users found.</div>
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

export default UserManagementPage
