import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { WelcomeBanner, StatCard, SectionCard, QuickLink, ListRow, AlertBanner, ShellLoader, StatusPill } from '../../components/layout/DashboardShell'
import useAuth from '../../hooks/useAuth'
import { getAllUsers } from '../../api/userApi'
import { getAllCitizens } from '../../api/citizenApi'
import { getVaccinationPrograms } from '../../api/vaccinationApi'
import { getAllDiseaseCases } from '../../api/diseaseCaseApi'
import { getAllOutbreaks } from '../../api/outbreakApi'
import { getNotificationsByUserId } from '../../api/notificationApi'

const HealthAdminDashboard = () => {
  const { user } = useAuth()
  const [users, setUsers] = useState([])
  const [citizens, setCitizens] = useState([])
  const [vaccinationPrograms, setVaccinationPrograms] = useState([])
  const [cases, setCases] = useState([])
  const [outbreaks, setOutbreaks] = useState([])
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.userId) return
    Promise.allSettled([getAllUsers(), getAllCitizens(), getVaccinationPrograms(), getAllDiseaseCases(), getAllOutbreaks(), getNotificationsByUserId(user.userId)])
      .then(([u, c, vp, dc, ob, nt]) => {
        if (u.status === 'fulfilled') setUsers(u.value.data?.data ?? [])
        if (c.status === 'fulfilled') setCitizens(c.value.data?.data ?? [])
        if (vp.status === 'fulfilled') setVaccinationPrograms(vp.value.data?.data ?? [])
        if (dc.status === 'fulfilled') setCases(dc.value.data?.data ?? [])
        if (ob.status === 'fulfilled') setOutbreaks(ob.value.data?.data ?? [])
        if (nt.status === 'fulfilled') setNotifications(nt.value.data?.data ?? [])
      }).finally(() => setLoading(false))
  }, [user?.userId])

  const staffUsers = users.filter(u => u.role !== 'CITIZEN')
  const activeVax = vaccinationPrograms.filter(v => ['ACTIVE','UPCOMING'].includes(v.status))
  const activeCases = cases.filter(c => ['REPORTED','UNDER_TREATMENT'].includes(c.status))
  const activeOutbreaks = outbreaks.filter(o => ['DETECTED','ACTIVE'].includes(o.status))
  const unread = notifications.filter(n => n.status === 'UNREAD')

  return (
    <DashboardLayout>
      <WelcomeBanner
        name={user?.name}
        role="Health Administrator"
        subtitle="Oversee health programs, staff management, vaccination efforts, and operational readiness."
        gradient="linear-gradient(135deg,#e0f2fe 0%,#bae6fd 30%,#dcfce7 100%)"
      />

      {activeOutbreaks.length > 0 && (
        <AlertBanner type="danger">
          <strong>{activeOutbreaks.length} active outbreak{activeOutbreaks.length > 1 ? 's' : ''}:</strong>{' '}
          {activeOutbreaks.map(o => `${o.diseaseType} (${o.location})`).join(' · ')}.{' '}
          <a href="/health-admin/operations-overview" style={{ color:'inherit', fontWeight:'800' }}>View operations →</a>
        </AlertBanner>
      )}

      {loading ? <ShellLoader message="Loading dashboard…" /> : (
        <>
          {/* Stats */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'16px', marginBottom:'24px' }}>
            <StatCard
              label="Staff Users" value={staffUsers.length}
              icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>}
              iconBg="linear-gradient(135deg,#0284c7,#38bdf8)"
              border="#bae6fd" shadow="rgba(2,132,199,0.08)" shadowHover="rgba(2,132,199,0.18)"
              valueColor="#0369a1" desc="Non-citizen accounts"
              to="/health-admin/staff"
            />
            <StatCard
              label="Registered Citizens" value={citizens.length}
              icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>}
              iconBg="linear-gradient(135deg,#059669,#34d399)"
              border="#bbf7d0" shadow="rgba(5,150,105,0.08)" shadowHover="rgba(5,150,105,0.18)"
              valueColor="#065f46" desc="Total citizen accounts"
              to="/health-admin/citizens"
            />
            <StatCard
              label="Active Vax Programs" value={activeVax.length}
              icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M10 2v2M14 2v2M9 7h6l1 5H8L9 7z"/><path d="M8 12v5a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-5"/></svg>}
              iconBg="linear-gradient(135deg,#7c3aed,#a78bfa)"
              border="#ddd6fe" shadow="rgba(124,58,237,0.08)" shadowHover="rgba(124,58,237,0.18)"
              valueColor="#5b21b6" desc="Active or upcoming"
              to="/health-admin/vaccination-programs"
            />
            <StatCard
              label="Active Cases" value={activeCases.length}
              icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>}
              iconBg="linear-gradient(135deg,#d97706,#fbbf24)"
              border="#fde68a" shadow="rgba(217,119,6,0.08)" shadowHover="rgba(217,119,6,0.18)"
              valueColor="#92400e" desc="Reported or under treatment"
              to="/health-admin/operations-overview"
            />
            <StatCard
              label="Active Outbreaks" value={activeOutbreaks.length}
              icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>}
              iconBg="linear-gradient(135deg,#dc2626,#f87171)"
              border="#fecaca" shadow="rgba(220,38,38,0.08)" shadowHover="rgba(220,38,38,0.18)"
              valueColor={activeOutbreaks.length > 0 ? '#991b1b' : '#065f46'} desc="Detected or active"
              to="/health-admin/operations-overview"
            />
            <StatCard
              label="Unread Alerts" value={unread.length}
              icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>}
              iconBg="linear-gradient(135deg,#be185d,#f472b6)"
              border="#fbcfe8" shadow="rgba(190,24,93,0.08)" shadowHover="rgba(190,24,93,0.18)"
              valueColor="#9d174d" desc="Pending notifications"
              to="/health-admin/notifications"
            />
          </div>

          {/* Quick Actions */}
          <div style={{ marginBottom:'24px' }}>
            <SectionCard title="Quick Actions" icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><polyline points="13 17 18 12 13 7"/><polyline points="6 17 11 12 6 7"/></svg>}>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'12px' }}>
                <QuickLink to="/health-admin/users" label="User Management" desc="All system user accounts" icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>} iconBg="linear-gradient(135deg,#0284c7,#38bdf8)" />
                <QuickLink to="/health-admin/staff" label="Staff Management" desc="View & manage staff accounts" icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>} iconBg="linear-gradient(135deg,#059669,#34d399)" />
                <QuickLink to="/health-admin/citizens" label="Citizen Overview" desc={`${citizens.length} registered citizens`} icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>} iconBg="linear-gradient(135deg,#7c3aed,#a78bfa)" />
                <QuickLink to="/health-admin/vaccination-programs" label="Vaccination Programs" desc={`${activeVax.length} active programs`} icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M10 2v2M14 2v2M9 7h6l1 5H8L9 7z"/><path d="M8 12v5a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-5"/></svg>} iconBg="linear-gradient(135deg,#d97706,#fbbf24)" />
                <QuickLink to="/health-admin/immunizations" label="Immunizations" desc="Track immunization records" icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>} iconBg="linear-gradient(135deg,#0369a1,#0284c7)" />
                <QuickLink to="/health-admin/reports" label="Reports" desc="View & generate health reports" icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>} iconBg="linear-gradient(135deg,#be185d,#f472b6)" />
                <QuickLink to="/health-admin/audit-logs" label="Audit Logs" desc="System audit trail" icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>} iconBg="linear-gradient(135deg,#475569,#64748b)" />
                <QuickLink to="/health-admin/operations-overview" label="Operations Overview" desc="Full operational summary" icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>} iconBg="linear-gradient(135deg,#dc2626,#f87171)" />
                <QuickLink to="/health-admin/notifications" label="Notifications" desc={`${unread.length} unread alert(s)`} icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>} iconBg="linear-gradient(135deg,#7c3aed,#a78bfa)" />
              </div>
            </SectionCard>
          </div>

          {/* Bottom row */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px' }}>
            <SectionCard
              title="Active Vaccination Programs"
              icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M10 2v2M14 2v2M9 7h6l1 5H8L9 7z"/><path d="M8 12v5a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-5"/></svg>}
              accent="linear-gradient(135deg,#7c3aed,#a78bfa)"
              action="View all" actionTo="/health-admin/vaccination-programs"
            >
              {activeVax.length === 0
                ? <p style={{ fontSize:'13px', color:'#94a3b8', margin:0 }}>No active or upcoming programs.</p>
                : activeVax.slice(0,5).map(v => (
                  <ListRow key={v.id} left={v.title} sub={`Start: ${v.startDate}`} badge={v.status} />
                ))
              }
            </SectionCard>

            <SectionCard
              title="Recent Notifications"
              icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>}
              accent="linear-gradient(135deg,#be185d,#f472b6)"
              action="View all" actionTo="/health-admin/notifications"
            >
              {unread.length === 0
                ? <p style={{ fontSize:'13px', color:'#94a3b8', margin:0 }}>✅ No unread notifications.</p>
                : unread.slice(0,5).map(n => (
                  <ListRow key={n.id} left={n.message} sub={`${n.category} · ${n.createdDate?.slice(0,10)}`} badge={n.status} />
                ))
              }
            </SectionCard>
          </div>
        </>
      )}
    </DashboardLayout>
  )
}

export default HealthAdminDashboard
