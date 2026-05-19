import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { WelcomeBanner, StatCard, SectionCard, QuickLink, ListRow, AlertBanner, ShellLoader, StatusPill } from '../../components/layout/DashboardShell'
import useAuth from '../../hooks/useAuth'
import { getAllDiseaseCases } from '../../api/diseaseCaseApi'
import { getAllCitizens } from '../../api/citizenApi'
import { getAllOutbreaks } from '../../api/outbreakApi'
import { getNotificationsByUserId } from '../../api/notificationApi'

const DoctorDashboard = () => {
  const { user } = useAuth()
  const [cases, setCases] = useState([])
  const [citizens, setCitizens] = useState([])
  const [outbreaks, setOutbreaks] = useState([])
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.userId) return
    Promise.allSettled([getAllDiseaseCases(), getAllCitizens(), getAllOutbreaks(), getNotificationsByUserId(user.userId)])
      .then(([c, p, o, n]) => {
        if (c.status === 'fulfilled') setCases(c.value.data?.data ?? [])
        if (p.status === 'fulfilled') setCitizens(p.value.data?.data ?? [])
        if (o.status === 'fulfilled') setOutbreaks(o.value.data?.data ?? [])
        if (n.status === 'fulfilled') setNotifications(n.value.data?.data ?? [])
      }).finally(() => setLoading(false))
  }, [user?.userId])

  const myCases = cases.filter(c => String(c.doctorId) === String(user?.userId))
  const activeCases = myCases.filter(c => ['REPORTED','UNDER_TREATMENT'].includes(c.status))
  const recoveredCases = myCases.filter(c => c.status === 'RECOVERED')
  const unread = notifications.filter(n => n.status === 'UNREAD')
  const activeOutbreaks = outbreaks.filter(o => ['DETECTED','ACTIVE'].includes(o.status))

  return (
    <DashboardLayout>
      <WelcomeBanner
        name={user?.name}
        role="Doctor"
        subtitle="Manage patient cases, coordinate care, and monitor outbreak responses."
        gradient="linear-gradient(135deg,#e0f2fe 0%,#bae6fd 40%,#ede9fe 100%)"
      />

      {activeOutbreaks.length > 0 && (
        <AlertBanner type="danger">
          <strong>{activeOutbreaks.length} active outbreak{activeOutbreaks.length > 1 ? 's' : ''} detected:</strong>{' '}
          {activeOutbreaks.map(o => o.diseaseType).join(', ')}. Ensure all suspected cases are logged within 24 hours.
        </AlertBanner>
      )}

      {loading ? <ShellLoader message="Loading dashboard…" /> : (
        <>
          {/* Stats */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'16px', marginBottom:'24px' }}>
            <StatCard
              label="My Active Cases" value={activeCases.length}
              icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>}
              iconBg="linear-gradient(135deg,#dc2626,#f87171)"
              border="#fecaca" shadow="rgba(220,38,38,0.08)" shadowHover="rgba(220,38,38,0.18)"
              valueColor="#991b1b" desc="Reported or under treatment"
              to="/doctor/disease-cases"
            />
            <StatCard
              label="Total My Cases" value={myCases.length}
              icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>}
              iconBg="linear-gradient(135deg,#0284c7,#38bdf8)"
              border="#bae6fd" shadow="rgba(2,132,199,0.08)" shadowHover="rgba(2,132,199,0.18)"
              valueColor="#0369a1" desc="All assigned cases"
              to="/doctor/disease-cases"
            />
            <StatCard
              label="Recovered" value={recoveredCases.length}
              icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>}
              iconBg="linear-gradient(135deg,#059669,#34d399)"
              border="#bbf7d0" shadow="rgba(5,150,105,0.08)" shadowHover="rgba(5,150,105,0.18)"
              valueColor="#065f46" desc="Successfully recovered"
              to="/doctor/disease-cases"
            />
            <StatCard
              label="Unread Alerts" value={unread.length}
              icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>}
              iconBg="linear-gradient(135deg,#7c3aed,#a78bfa)"
              border="#ddd6fe" shadow="rgba(124,58,237,0.08)" shadowHover="rgba(124,58,237,0.18)"
              valueColor="#5b21b6" desc="Pending notifications"
              to="/doctor/notifications"
            />
          </div>

          {/* Quick Actions */}
          <div style={{ marginBottom:'24px' }}>
            <SectionCard title="Quick Actions" icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><polyline points="13 17 18 12 13 7"/><polyline points="6 17 11 12 6 7"/></svg>}>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'12px' }}>
                <QuickLink to="/doctor/disease-cases" label="Disease Cases" desc="Report & manage cases" icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>} iconBg="linear-gradient(135deg,#dc2626,#f87171)" />
                <QuickLink to="/doctor/case-updates" label="Case Updates" desc="Progress notes & timeline" icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>} iconBg="linear-gradient(135deg,#0284c7,#38bdf8)" />
                <QuickLink to="/doctor/patient-records" label="Patient Records" desc={`${citizens.length} registered citizens`} icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>} iconBg="linear-gradient(135deg,#059669,#34d399)" />
                <QuickLink to="/doctor/outbreak-updates" label="Outbreak Updates" desc={`${activeOutbreaks.length} active outbreak(s)`} icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>} iconBg="linear-gradient(135deg,#d97706,#fbbf24)" />
                <QuickLink to="/doctor/notifications" label="Notifications" desc={`${unread.length} unread alert(s)`} icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>} iconBg="linear-gradient(135deg,#7c3aed,#a78bfa)" />
              </div>
            </SectionCard>
          </div>

          {/* Bottom row */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px' }}>
            <SectionCard
              title="Active Cases Overview"
              icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>}
              accent="linear-gradient(135deg,#dc2626,#f87171)"
              action="View all" actionTo="/doctor/disease-cases"
            >
              {activeCases.length === 0
                ? <p style={{ fontSize:'13px', color:'#94a3b8', margin:0 }}>No active cases assigned to you.</p>
                : activeCases.slice(0,5).map(c => (
                  <ListRow key={c.id} left={c.diseaseType} sub={`Citizen #${c.citizenId} · ${c.diagnosisDate}`} badge={c.status} />
                ))
              }
            </SectionCard>

            <SectionCard
              title="Recent Notifications"
              icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>}
              accent="linear-gradient(135deg,#7c3aed,#a78bfa)"
              action="View all" actionTo="/doctor/notifications"
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

export default DoctorDashboard
