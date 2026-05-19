import { useState, useEffect, useCallback } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import StatusBadge from '../../components/common/StatusBadge'
import { getAllUsers, updateUser, updateUserStatus } from '../../api/userApi'
import { getRoleLabel, STAFF_ASSIGNABLE_ROLES } from '../../utils/roles'

const USER_STATUSES = ['ACTIVE', 'INACTIVE', 'SUSPENDED']

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

  const ROLE_COLORS = {
    HEALTH_ADMINISTRATOR: { bg:'#dbeafe', color:'#1e40af' },
    ADMIN:                { bg:'#dbeafe', color:'#1e40af' },
    DOCTOR:               { bg:'#ede9fe', color:'#5b21b6' },
    HEALTH_WORKER:        { bg:'#ede9fe', color:'#5b21b6' },
    EPIDEMIOLOGIST:       { bg:'#fef3c7', color:'#92400e' },
    COMPLIANCE_OFFICER:   { bg:'#f1f5f9', color:'#475569' },
    AUDITOR:              { bg:'#1e293b', color:'#f8fafc' },
    GOVERNMENT_AUDITOR:   { bg:'#1e293b', color:'#f8fafc' },
    CITIZEN:              { bg:'#dcfce7', color:'#166534' },
  }

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div style={{ display:'flex', alignItems:'center', gap:'14px', marginBottom:'24px' }}>
        <div style={{ width:'46px', height:'46px', borderRadius:'13px', background:'linear-gradient(135deg,#0284c7,#06b6d4)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 12px rgba(2,132,199,0.25)', flexShrink:0 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        </div>
        <div>
          <h2 style={{ fontSize:'22px', fontWeight:'900', color:'#0f172a', margin:0, letterSpacing:'-0.3px' }}>User Management</h2>
          <p style={{ fontSize:'13px', color:'#64748b', margin:'4px 0 0', fontWeight:'500' }}>View and manage all system user accounts.</p>
        </div>
      </div>

      {fetchError && <div style={{ background:'#fffbeb', border:'1px solid #fde68a', borderRadius:'12px', padding:'12px 16px', color:'#92400e', fontSize:'13px', fontWeight:'600', marginBottom:'16px' }}>⚠️ {fetchError}</div>}
      {saveError  && <div style={{ background:'#fef2f2', border:'1px solid #fecaca', borderRadius:'12px', padding:'12px 16px', color:'#991b1b', fontSize:'13px', fontWeight:'600', marginBottom:'16px' }}>❌ {saveError}</div>}
      {saveSuccess && <div style={{ background:'#f0fdf4', border:'1px solid #bbf7d0', borderRadius:'12px', padding:'12px 16px', color:'#166534', fontSize:'13px', fontWeight:'600', marginBottom:'16px' }}>✅ {saveSuccess}</div>}

      {/* Edit panel */}
      {editTarget && (
        <div style={{ background:'#ffffff', borderRadius:'16px', border:'1px solid #e8edf5', boxShadow:'0 2px 12px rgba(10,50,114,0.05)', padding:'20px', marginBottom:'20px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'16px' }}>
            <div style={{ width:'4px', height:'20px', borderRadius:'4px', background:'linear-gradient(180deg,#0284c7,#06b6d4)' }} />
            <span style={{ fontSize:'15px', fontWeight:'800', color:'#0f172a' }}>Edit User #{editTarget.id} — {editTarget.name}</span>
          </div>
          <form onSubmit={handleEditSave} noValidate>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px', marginBottom:'16px' }}>
              <div style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
                <label style={{ fontSize:'13px', fontWeight:'600', color:'#374151' }}>Full Name *</label>
                <input id="name" name="name" className="hn-input" value={editForm.name} onChange={handleEditChange} placeholder="Full name" />
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
                <label style={{ fontSize:'13px', fontWeight:'600', color:'#374151' }}>Phone</label>
                <input id="phone" name="phone" className="hn-input" value={editForm.phone} onChange={handleEditChange} placeholder="Phone number" />
              </div>
            </div>
            <div style={{ display:'flex', gap:'10px' }}>
              <button type="submit" className="hn-btn-primary" disabled={saving} style={{ width:'auto', padding:'0 24px', height:'40px' }}>{saving ? 'Saving…' : 'Save Changes'}</button>
              <button type="button" onClick={() => setEditTarget(null)} style={{ height:'40px', padding:'0 20px', borderRadius:'10px', border:'1.5px solid #e2e8f0', background:'#ffffff', fontSize:'13px', fontWeight:'700', color:'#475569', cursor:'pointer' }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Table card */}
      <div style={{ background:'#ffffff', borderRadius:'16px', border:'1px solid #e8edf5', boxShadow:'0 2px 12px rgba(10,50,114,0.05)', overflow:'hidden' }}>
        {/* Filters */}
        <div style={{ padding:'16px 20px', borderBottom:'1px solid #f1f5f9', display:'flex', gap:'12px', flexWrap:'wrap', alignItems:'center' }}>
          <div style={{ position:'relative', flex:'1', minWidth:'200px' }}>
            <svg style={{ position:'absolute', left:'12px', top:'50%', transform:'translateY(-50%)', color:'#94a3b8' }} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" className="hn-input" style={{ paddingLeft:'36px' }} placeholder="Search by name, email, or ID…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="hn-select" style={{ width:'160px' }} value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
            <option value="ALL">All Roles</option>
            {roleValues.map(r => <option key={r} value={r}>{getRoleLabel(r)}</option>)}
          </select>
          <select className="hn-select" style={{ width:'150px' }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="ALL">All Statuses</option>
            {USER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <span style={{ fontSize:'12px', color:'#94a3b8', fontWeight:'600', whiteSpace:'nowrap' }}>{filtered.length} user{filtered.length !== 1 ? 's' : ''}</span>
        </div>

        {loading ? (
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', padding:'48px', gap:'12px' }}>
            <div style={{ width:'18px', height:'18px', borderRadius:'50%', border:'3px solid #bae6fd', borderTopColor:'#0284c7', animation:'hnSpin 0.7s linear infinite' }} />
            <span style={{ fontSize:'14px', color:'#64748b', fontWeight:'600' }}>Loading users…</span>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding:'48px', textAlign:'center', color:'#94a3b8', fontSize:'14px' }}>No users found matching your filters.</div>
        ) : (
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead>
                <tr style={{ background:'#f8fafc' }}>
                  {['ID','Name','Email','Phone','Role','Status','Actions'].map(h => (
                    <th key={h} style={{ padding:'12px 16px', textAlign:'left', fontSize:'11px', fontWeight:'700', color:'#64748b', letterSpacing:'0.05em', textTransform:'uppercase', borderBottom:'1px solid #f1f5f9', whiteSpace:'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((u, i) => (
                  <tr key={u.id} style={{ borderBottom:'1px solid #f8fafc', background: i % 2 === 0 ? '#ffffff' : '#fafbfc' }}
                    onMouseEnter={e => e.currentTarget.style.background='#f0f7ff'}
                    onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? '#ffffff' : '#fafbfc'}
                  >
                    <td style={{ padding:'12px 16px', fontSize:'13px', fontWeight:'700', color:'#0284c7' }}>#{u.id}</td>
                    <td style={{ padding:'12px 16px' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                        <div style={{ width:'32px', height:'32px', borderRadius:'50%', background:'linear-gradient(135deg,#0284c7,#06b6d4)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'12px', fontWeight:'800', color:'#fff', flexShrink:0 }}>
                          {u.name?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                        <span style={{ fontSize:'13px', fontWeight:'600', color:'#0f172a' }}>{u.name}</span>
                      </div>
                    </td>
                    <td style={{ padding:'12px 16px', fontSize:'12px', color:'#64748b' }}>{u.email}</td>
                    <td style={{ padding:'12px 16px', fontSize:'12px', color:'#64748b' }}>{u.phone ?? '—'}</td>
                    <td style={{ padding:'12px 16px' }}>
                      <span style={{ background: ROLE_COLORS[u.role]?.bg || '#f1f5f9', color: ROLE_COLORS[u.role]?.color || '#475569', borderRadius:'999px', fontSize:'11px', fontWeight:'700', padding:'3px 10px' }}>
                        {getRoleLabel(u.role)}
                      </span>
                    </td>
                    <td style={{ padding:'12px 16px' }}><StatusBadge status={u.status} /></td>
                    <td style={{ padding:'12px 16px' }}>
                      <div style={{ display:'flex', gap:'6px', flexWrap:'wrap' }}>
                        <button onClick={() => openEdit(u)} style={{ height:'30px', padding:'0 12px', borderRadius:'8px', border:'1.5px solid #bae6fd', background:'#f0f9ff', fontSize:'12px', fontWeight:'700', color:'#0284c7', cursor:'pointer' }}>Edit</button>
                        {USER_STATUSES.filter(s => s !== u.status).map(s => (
                          <button key={s} disabled={statusUpdating === u.id} onClick={() => handleStatusChange(u.id, s)}
                            style={{ height:'30px', padding:'0 10px', borderRadius:'8px', border:'1.5px solid #e2e8f0', background:'#ffffff', fontSize:'11px', fontWeight:'700', color:'#475569', cursor:'pointer', opacity: statusUpdating === u.id ? 0.5 : 1 }}>
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
      </div>
    </DashboardLayout>
  )
}

export default UserManagementPage
