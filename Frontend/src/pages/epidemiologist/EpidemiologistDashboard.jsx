import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { WelcomeBanner, StatCard, SectionCard, QuickLink, ListRow, AlertBanner, ShellLoader, StatusPill } from '../../components/layout/DashboardShell'
import useAuth from '../../hooks/useAuth'
import { getAllOutbreaks } from '../../api/outbreakApi'
import { getAllDiseaseCases } from '../../api/diseaseCaseApi'
import { getNotificationsByUserId } from '../../api/notificationApi'
import { getComplianceRecordsByType } from '../../api/complianceApi'

const EpidemiologistDashboard = () => {
  const { user } = useAuth()
  const [outbreaks, setOutbreaks] = useState([])
  const [cases, setCases] = useState([])
  const [notifications, setNotifications] = useState([])
  const [compliance, setCompliance] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.userId) return
    Promise.allSettled([getAllOutbreaks(), getAllDiseaseCases(), getNotificationsByUserId(user.userId), getComplianceRecordsByType('OUTBREAK')])
      .then(([ob, cs, nt, co]) => {
        if (ob.status === 'fulfilled') setOutbreaks(ob.value.data?.data ?? [])
        if (cs.status === 'fulfilled') setCases(cs.value.data?.data ?? [])
        if (nt.status === 'fulfilled') setNotifications(nt.value.data?.data ?? [])
        if (co.status === 'fulfilled') setCompliance(co.value.data?.data ?? [])
      }).finally(() => setLoading(false))
  }, [user?.userId])

  const activeOutbreaks = outbreaks.filter(o => ['DETECTED','ACTIVE'].includes(o.status))
  const containedOutbreaks = outbreaks.filter(o => ['CONTAINED','CLOSED'].includes(o.status))
  const activeCases = cases.filter(c => ['REPORTED','UNDER_TREATMENT'].includes(c.status))
  const unread = notifications.filter(n => n.status === 'UNREAD')
  const compIssues = compliance.filter(r => ['FAIL','NON_COMPLIANT'].includes(r.result))

  const diseaseFreq = cases.reduce((acc, c) => { acc[c.diseaseType] = (acc[c.diseaseType] || 0) + 1; return acc }, {})
  const topDiseases = Object.entries(diseaseFreq).sort((a, b) => b[1] - a[1]).slice(0, 5)
  const total = cases.length

  return (
    <DashboardLayout>
      <WelcomeBanner
        name={user?.name}
        role="Epidemiologist"
        subtitle="Monitor disease trends, outbreak patterns, and compliance status across regions."
        gradient="linear-gradient(135deg,#fef3c7 0%,#fde68a 30%,#e0f2fe 100%)"
      />

      {activeOutbreaks.length > 0 && (
        <AlertBanner type="danger">
          <strong>{activeOutbreaks.length} active outbreak{activeOutbreaks.length > 1 ? 's' : ''} require immediate attention:</strong>{' '}
          {activeOutbreaks.map(o => `${o.diseaseType} (${o.location})`).join(' · ')}.
        </AlertBanner>
      )}

      {loading ? <ShellLoader message="Loading surveillance data…" /> : (
        <>
          {/* Stats */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'16px', marginBottom:'24px' }}>
            <StatCard
              label="Active Outbreaks" value={activeOutbreaks.length}
              icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>}
              iconBg="linear-gradient(135deg,#dc2626,#f87171)"
              border="#fecaca" shadow="rgba(220,38,38,0.08)" shadowHover="rgba(220,38,38,0.18)"
              valueColor={activeOutbreaks.length > 0 ? '#991b1b' : '#065f46'} desc="Detected or active"
              to="/epidemiologist/outbreaks"
            />
            <StatCard
              label="Contained / Closed" value={containedOutbreaks.length}
              icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>}
              iconBg="linear-gradient(135deg,#059669,#34d399)"
              border="#bbf7d0" shadow="rgba(5,150,105,0.08)" shadowHover="rgba(5,150,105,0.18)"
              valueColor="#065f46" desc="Resolved outbreaks"
              to="/epidemiologist/outbreaks"
            />
            <StatCard
              label="Total Disease Cases" value={cases.length}
              icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>}
              iconBg="linear-gradient(135deg,#0284c7,#38bdf8)"
              border="#bae6fd" shadow="rgba(2,132,199,0.08)" shadowHover="rgba(2,132,199,0.18)"
              valueColor="#0369a1" desc={`${activeCases.length} still active`}
              to="/epidemiologist/disease-trends"
            />
            <StatCard
              label="Unread Alerts" value={unread.length}
              icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>}
              iconBg="linear-gradient(135deg,#7c3aed,#a78bfa)"
              border="#ddd6fe" shadow="rgba(124,58,237,0.08)" shadowHover="rgba(124,58,237,0.18)"
              valueColor="#5b21b6" desc="Pending notifications"
              to="/epidemiologist/notifications"
            />
          </div>

          {/* Quick Actions */}
          <div style={{ marginBottom:'24px' }}>
            <SectionCard title="Quick Actions" icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><polyline points="13 17 18 12 13 7"/><polyline points="6 17 11 12 6 7"/></svg>}>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'12px' }}>
                <QuickLink to="/epidemiologist/outbreaks" label="Manage Outbreaks" desc="Create & update outbreak records" icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>} iconBg="linear-gradient(135deg,#dc2626,#f87171)" />
                <QuickLink to="/epidemiologist/epidemiology-data" label="Epidemiology Data" desc="Add & analyze outbreak metrics" icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>} iconBg="linear-gradient(135deg,#0284c7,#38bdf8)" />
                <QuickLink to="/epidemiologist/disease-trends" label="Disease Trends" desc="Aggregated case analytics" icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>} iconBg="linear-gradient(135deg,#059669,#34d399)" />
                <QuickLink to="/epidemiologist/reports" label="Reports" desc="Browse outbreak & case reports" icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>} iconBg="linear-gradient(135deg,#d97706,#fbbf24)" />
                <QuickLink to="/epidemiologist/compliance-tracking" label="Compliance Tracking" desc="View outbreak compliance" icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>} iconBg="linear-gradient(135deg,#7c3aed,#a78bfa)" />
                <QuickLink to="/epidemiologist/notifications" label="Notifications" desc={`${unread.length} unread alert(s)`} icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>} iconBg="linear-gradient(135deg,#be185d,#f472b6)" />
              </div>
            </SectionCard>
          </div>

          {/* Bottom row */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'20px' }}>
            <SectionCard
              title="Recent Outbreaks"
              icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>}
              accent="linear-gradient(135deg,#dc2626,#f87171)"
              action="View all" actionTo="/epidemiologist/outbreaks"
            >
              {outbreaks.length === 0
                ? <p style={{ fontSize:'13px', color:'#94a3b8', margin:0 }}>No outbreaks recorded.</p>
                : outbreaks.slice(0,5).map(o => (
                  <ListRow key={o.id} left={o.diseaseType} sub={`📍 ${o.location}`} badge={o.status} />
                ))
              }
            </SectionCard>

            <SectionCard
              title="Top Disease Types"
              icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>}
              accent="linear-gradient(135deg,#0284c7,#38bdf8)"
              action="View trends" actionTo="/epidemiologist/disease-trends"
            >
              {topDiseases.length === 0
                ? <p style={{ fontSize:'13px', color:'#94a3b8', margin:0 }}>No case data available.</p>
                : topDiseases.map(([disease, count]) => (
                  <div key={disease} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'9px 0', borderBottom:'1px solid #f1f5f9' }}>
                    <span style={{ fontSize:'13px', fontWeight:'600', color:'#0f172a' }}>{disease}</span>
                    <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                      <div style={{ width:`${Math.min((count/total)*80,80)}px`, height:'5px', borderRadius:'4px', background:'linear-gradient(90deg,#0284c7,#06b6d4)' }} />
                      <span style={{ fontSize:'12px', fontWeight:'700', color:'#0284c7', minWidth:'24px', textAlign:'right' }}>{count}</span>
                    </div>
                  </div>
                ))
              }
            </SectionCard>

            <SectionCard
              title="Notifications"
              icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>}
              accent="linear-gradient(135deg,#7c3aed,#a78bfa)"
              action="View all" actionTo="/epidemiologist/notifications"
            >
              {unread.length === 0
                ? <p style={{ fontSize:'13px', color:'#94a3b8', margin:0 }}>✅ No unread notifications.</p>
                : unread.slice(0,4).map(n => (
                  <ListRow key={n.id} left={n.message} sub={n.category} badge={n.status} />
                ))
              }
            </SectionCard>
          </div>
        </>
      )}
    </DashboardLayout>
  )
}

export default EpidemiologistDashboard
