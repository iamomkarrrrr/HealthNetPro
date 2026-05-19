import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { WelcomeBanner, StatCard, SectionCard, QuickLink, ListRow, AlertBanner, ShellLoader, StatusPill } from '../../components/layout/DashboardShell'
import useAuth from '../../hooks/useAuth'
import { getComplianceRecordsByType } from '../../api/complianceApi'
import { getNotificationsByUserId } from '../../api/notificationApi'

const TYPES = ['CASE','OUTBREAK','VACCINATION']

const ComplianceDashboard = () => {
  const { user } = useAuth()
  const [records, setRecords] = useState([])
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.userId) return
    Promise.allSettled([...TYPES.map(t => getComplianceRecordsByType(t)), getNotificationsByUserId(user.userId)])
      .then(([caseRes, outbreakRes, vacRes, notifRes]) => {
        const all = []
        if (caseRes.status === 'fulfilled') all.push(...(caseRes.value.data?.data ?? []))
        if (outbreakRes.status === 'fulfilled') all.push(...(outbreakRes.value.data?.data ?? []))
        if (vacRes.status === 'fulfilled') all.push(...(vacRes.value.data?.data ?? []))
        setRecords(all)
        if (notifRes.status === 'fulfilled') setNotifications(notifRes.value.data?.data ?? [])
      }).finally(() => setLoading(false))
  }, [user?.userId])

  const passCount = records.filter(r => r.result === 'PASS').length
  const failCount = records.filter(r => ['FAIL','NON_COMPLIANT'].includes(r.result)).length
  const warningCount = records.filter(r => r.result === 'WARNING').length
  const complianceRate = records.length > 0 ? Math.round((passCount / records.length) * 100) : 0
  const unread = notifications.filter(n => n.status === 'UNREAD')
  const recent = [...records].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 6)

  return (
    <DashboardLayout>
      <WelcomeBanner
        name={user?.name}
        role="Compliance Officer"
        subtitle="Monitor regulatory compliance, track records, and support audit readiness."
        gradient="linear-gradient(135deg,#ede9fe 0%,#ddd6fe 30%,#e0f2fe 100%)"
      />

      {failCount > 0 && (
        <AlertBanner type="danger">
          <strong>{failCount} non-compliant record{failCount > 1 ? 's' : ''} require immediate attention.</strong>{' '}
          <a href="/compliance/records" style={{ color:'inherit', fontWeight:'800' }}>Review records →</a>
        </AlertBanner>
      )}

      {loading ? <ShellLoader message="Loading compliance data…" /> : (
        <>
          {/* Stats */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:'16px', marginBottom:'24px' }}>
            <StatCard
              label="Total Records" value={records.length}
              icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>}
              iconBg="linear-gradient(135deg,#0284c7,#38bdf8)"
              border="#bae6fd" shadow="rgba(2,132,199,0.08)" shadowHover="rgba(2,132,199,0.18)"
              valueColor="#0369a1"
              to="/compliance/records"
            />
            <StatCard
              label="Passed" value={passCount}
              icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>}
              iconBg="linear-gradient(135deg,#059669,#34d399)"
              border="#bbf7d0" shadow="rgba(5,150,105,0.08)" shadowHover="rgba(5,150,105,0.18)"
              valueColor="#065f46"
              to="/compliance/records"
            />
            <StatCard
              label="Failed / Non-Compliant" value={failCount}
              icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>}
              iconBg="linear-gradient(135deg,#dc2626,#f87171)"
              border="#fecaca" shadow="rgba(220,38,38,0.08)" shadowHover="rgba(220,38,38,0.18)"
              valueColor={failCount > 0 ? '#991b1b' : '#065f46'}
              to="/compliance/records"
            />
            <StatCard
              label="Warnings" value={warningCount}
              icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>}
              iconBg="linear-gradient(135deg,#d97706,#fbbf24)"
              border="#fde68a" shadow="rgba(217,119,6,0.08)" shadowHover="rgba(217,119,6,0.18)"
              valueColor={warningCount > 0 ? '#92400e' : '#065f46'}
              to="/compliance/records"
            />
            <StatCard
              label="Compliance Rate" value={`${complianceRate}%`}
              icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>}
              iconBg={complianceRate >= 80 ? 'linear-gradient(135deg,#059669,#34d399)' : 'linear-gradient(135deg,#dc2626,#f87171)'}
              border={complianceRate >= 80 ? '#bbf7d0' : '#fecaca'}
              shadow="rgba(5,150,105,0.08)" shadowHover="rgba(5,150,105,0.18)"
              valueColor={complianceRate >= 80 ? '#065f46' : '#991b1b'}
            />
          </div>

          {/* Quick Actions */}
          <div style={{ marginBottom:'24px' }}>
            <SectionCard title="Quick Actions" icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><polyline points="13 17 18 12 13 7"/><polyline points="6 17 11 12 6 7"/></svg>}>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'12px' }}>
                <QuickLink to="/compliance/records" label="Compliance Records" desc="Create & manage records" icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>} iconBg="linear-gradient(135deg,#0284c7,#38bdf8)" />
                <QuickLink to="/compliance/entity-review" label="Entity Review" desc="Review by entity ID" icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>} iconBg="linear-gradient(135deg,#7c3aed,#a78bfa)" />
                <QuickLink to="/compliance/reports" label="Reports" desc="Browse compliance reports" icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>} iconBg="linear-gradient(135deg,#059669,#34d399)" />
                <QuickLink to="/compliance/notifications" label="Notifications" desc={`${unread.length} unread alert(s)`} icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>} iconBg="linear-gradient(135deg,#d97706,#fbbf24)" />
              </div>
            </SectionCard>
          </div>

          {/* Bottom row */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px' }}>
            <SectionCard
              title="Recent Compliance Records"
              icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>}
              accent="linear-gradient(135deg,#0284c7,#38bdf8)"
              action="View all" actionTo="/compliance/records"
            >
              {recent.length === 0
                ? <p style={{ fontSize:'13px', color:'#94a3b8', margin:0 }}>No compliance records found.</p>
                : recent.map(r => (
                  <ListRow key={r.id} left={`Entity #${r.entityId} — ${r.type}`} sub={`${r.date} · ${r.notes?.slice(0,40) || ''}${r.notes?.length > 40 ? '…' : ''}`} badge={r.result} />
                ))
              }
            </SectionCard>

            <SectionCard
              title="Recent Notifications"
              icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>}
              accent="linear-gradient(135deg,#d97706,#fbbf24)"
              action="View all" actionTo="/compliance/notifications"
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

export default ComplianceDashboard
