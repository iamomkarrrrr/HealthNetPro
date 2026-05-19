import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { WelcomeBanner, StatCard, SectionCard, QuickLink, ListRow, AlertBanner, ShellLoader, StatusPill } from '../../components/layout/DashboardShell'
import useAuth from '../../hooks/useAuth'
import { getAuditsByOfficerId } from '../../api/auditApi'
import { getComplianceRecordsByType } from '../../api/complianceApi'
import { getReportsByScope } from '../../api/reportingApi'
import { getAllOutbreaks } from '../../api/outbreakApi'
import { getAllDiseaseCases } from '../../api/diseaseCaseApi'
import { getVaccinationPrograms } from '../../api/vaccinationApi'
import { getNotificationsByUserId } from '../../api/notificationApi'

const COMPLIANCE_TYPES = ['CASE','OUTBREAK','VACCINATION']

const AuditorDashboard = () => {
  const { user } = useAuth()
  const [audits, setAudits] = useState([])
  const [compliance, setCompliance] = useState([])
  const [reports, setReports] = useState([])
  const [outbreaks, setOutbreaks] = useState([])
  const [cases, setCases] = useState([])
  const [programs, setPrograms] = useState([])
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.userId) return
    Promise.allSettled([
      getAuditsByOfficerId(user.userId),
      ...COMPLIANCE_TYPES.map(t => getComplianceRecordsByType(t)),
      getReportsByScope('COMPLIANCE'),
      getAllOutbreaks(),
      getAllDiseaseCases(),
      getVaccinationPrograms(),
      getNotificationsByUserId(user.userId),
    ]).then(([auditRes, caseComp, outbreakComp, vacComp, reportRes, obRes, caseRes, progRes, notifRes]) => {
      if (auditRes.status === 'fulfilled') setAudits(auditRes.value.data?.data ?? [])
      const allCompliance = []
      if (caseComp.status === 'fulfilled') allCompliance.push(...(caseComp.value.data?.data ?? []))
      if (outbreakComp.status === 'fulfilled') allCompliance.push(...(outbreakComp.value.data?.data ?? []))
      if (vacComp.status === 'fulfilled') allCompliance.push(...(vacComp.value.data?.data ?? []))
      setCompliance(allCompliance)
      if (reportRes.status === 'fulfilled') setReports(reportRes.value.data?.data ?? [])
      if (obRes.status === 'fulfilled') setOutbreaks(obRes.value.data?.data ?? [])
      if (caseRes.status === 'fulfilled') setCases(caseRes.value.data?.data ?? [])
      if (progRes.status === 'fulfilled') setPrograms(progRes.value.data?.data ?? [])
      if (notifRes.status === 'fulfilled') setNotifications(notifRes.value.data?.data ?? [])
    }).finally(() => setLoading(false))
  }, [user?.userId])

  const openAudits = audits.filter(a => a.status === 'OPEN')
  const inReviewAudits = audits.filter(a => a.status === 'IN_REVIEW')
  const compIssues = compliance.filter(r => ['FAIL','NON_COMPLIANT'].includes(r.result))
  const activeOutbreaks = outbreaks.filter(o => ['DETECTED','ACTIVE'].includes(o.status))
  const activeCases = cases.filter(c => ['REPORTED','UNDER_TREATMENT'].includes(c.status))
  const unread = notifications.filter(n => n.status === 'UNREAD')
  const recentAudits = [...audits].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5)
  const recentReports = [...reports].sort((a, b) => new Date(b.generatedDate) - new Date(a.generatedDate)).slice(0, 4)

  return (
    <DashboardLayout>
      <WelcomeBanner
        name={user?.name}
        role="Government Auditor"
        subtitle="Review system compliance, audit records, and governance metrics."
        gradient="linear-gradient(135deg,#f1f5f9 0%,#e2e8f0 30%,#ddd6fe 100%)"
      />

      {activeOutbreaks.length > 0 && (
        <AlertBanner type="danger">
          <strong>{activeOutbreaks.length} active outbreak{activeOutbreaks.length > 1 ? 's' : ''} under surveillance:</strong>{' '}
          {activeOutbreaks.map(o => `${o.diseaseType} (${o.location})`).join(' · ')}.{' '}
          <a href="/auditor/system-overview" style={{ color:'inherit', fontWeight:'800' }}>View system overview →</a>
        </AlertBanner>
      )}

      {compIssues.length > 0 && (
        <AlertBanner type="warning">
          <strong>{compIssues.length} compliance issue{compIssues.length > 1 ? 's' : ''} flagged</strong> across case, outbreak, and vaccination records.
        </AlertBanner>
      )}

      {loading ? <ShellLoader message="Loading governance dashboard…" /> : (
        <>
          {/* Stats */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'16px', marginBottom:'24px' }}>
            <StatCard
              label="Total Audits" value={audits.length}
              icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>}
              iconBg="linear-gradient(135deg,#0284c7,#38bdf8)"
              border="#bae6fd" shadow="rgba(2,132,199,0.08)" shadowHover="rgba(2,132,199,0.18)"
              valueColor="#0369a1" desc={`${openAudits.length} open · ${inReviewAudits.length} in review`}
              to="/auditor/audits"
            />
            <StatCard
              label="Compliance Issues" value={compIssues.length}
              icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>}
              iconBg={compIssues.length > 0 ? 'linear-gradient(135deg,#dc2626,#f87171)' : 'linear-gradient(135deg,#059669,#34d399)'}
              border={compIssues.length > 0 ? '#fecaca' : '#bbf7d0'}
              shadow="rgba(220,38,38,0.08)" shadowHover="rgba(220,38,38,0.18)"
              valueColor={compIssues.length > 0 ? '#991b1b' : '#065f46'} desc="Fail or non-compliant"
              to="/auditor/compliance-review"
            />
            <StatCard
              label="Active Outbreaks" value={activeOutbreaks.length}
              icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>}
              iconBg={activeOutbreaks.length > 0 ? 'linear-gradient(135deg,#dc2626,#f87171)' : 'linear-gradient(135deg,#059669,#34d399)'}
              border={activeOutbreaks.length > 0 ? '#fecaca' : '#bbf7d0'}
              shadow="rgba(220,38,38,0.08)" shadowHover="rgba(220,38,38,0.18)"
              valueColor={activeOutbreaks.length > 0 ? '#991b1b' : '#065f46'} desc="Under surveillance"
              to="/auditor/system-overview"
            />
            <StatCard
              label="Unread Alerts" value={unread.length}
              icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>}
              iconBg="linear-gradient(135deg,#7c3aed,#a78bfa)"
              border="#ddd6fe" shadow="rgba(124,58,237,0.08)" shadowHover="rgba(124,58,237,0.18)"
              valueColor="#5b21b6" desc="Pending notifications"
              to="/auditor/notifications"
            />
          </div>

          {/* Second stats row */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'16px', marginBottom:'24px' }}>
            <StatCard
              label="Open Audits" value={openAudits.length}
              icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>}
              iconBg={openAudits.length > 0 ? 'linear-gradient(135deg,#d97706,#fbbf24)' : 'linear-gradient(135deg,#059669,#34d399)'}
              border={openAudits.length > 0 ? '#fde68a' : '#bbf7d0'}
              shadow="rgba(217,119,6,0.08)" shadowHover="rgba(217,119,6,0.18)"
              valueColor={openAudits.length > 0 ? '#92400e' : '#065f46'} desc="Pending review"
              to="/auditor/audits"
            />
            <StatCard
              label="In Review" value={inReviewAudits.length}
              icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>}
              iconBg="linear-gradient(135deg,#0369a1,#0284c7)"
              border="#bae6fd" shadow="rgba(2,132,199,0.08)" shadowHover="rgba(2,132,199,0.18)"
              valueColor="#0369a1" desc="Currently being reviewed"
              to="/auditor/audits"
            />
            <StatCard
              label="Active Cases" value={activeCases.length}
              icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>}
              iconBg="linear-gradient(135deg,#d97706,#fbbf24)"
              border="#fde68a" shadow="rgba(217,119,6,0.08)" shadowHover="rgba(217,119,6,0.18)"
              valueColor="#92400e" desc="System-wide active cases"
              to="/auditor/system-overview"
            />
            <StatCard
              label="Vax Programs" value={programs.length}
              icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M10 2v2M14 2v2M9 7h6l1 5H8L9 7z"/><path d="M8 12v5a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-5"/></svg>}
              iconBg="linear-gradient(135deg,#059669,#34d399)"
              border="#bbf7d0" shadow="rgba(5,150,105,0.08)" shadowHover="rgba(5,150,105,0.18)"
              valueColor="#065f46" desc="Total programs"
              to="/auditor/system-overview"
            />
          </div>

          {/* Quick Actions */}
          <div style={{ marginBottom:'24px' }}>
            <SectionCard title="Quick Actions" icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><polyline points="13 17 18 12 13 7"/><polyline points="6 17 11 12 6 7"/></svg>}>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:'12px' }}>
                <QuickLink to="/auditor/audits" label="Audits" desc={`${openAudits.length} open audit(s)`} icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>} iconBg="linear-gradient(135deg,#0284c7,#38bdf8)" />
                <QuickLink to="/auditor/compliance-review" label="Compliance Review" desc={`${compIssues.length} issue(s) flagged`} icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>} iconBg="linear-gradient(135deg,#dc2626,#f87171)" />
                <QuickLink to="/auditor/reports" label="Reports" desc="System-wide health reports" icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>} iconBg="linear-gradient(135deg,#7c3aed,#a78bfa)" />
                <QuickLink to="/auditor/system-overview" label="System Overview" desc="Full governance summary" icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>} iconBg="linear-gradient(135deg,#059669,#34d399)" />
                <QuickLink to="/auditor/notifications" label="Notifications" desc={`${unread.length} unread alert(s)`} icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>} iconBg="linear-gradient(135deg,#d97706,#fbbf24)" />
              </div>
            </SectionCard>
          </div>

          {/* Bottom row */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'20px' }}>
            <SectionCard
              title="Recent Audits"
              icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>}
              accent="linear-gradient(135deg,#0284c7,#38bdf8)"
              action="View all" actionTo="/auditor/audits"
            >
              {recentAudits.length === 0
                ? <p style={{ fontSize:'13px', color:'#94a3b8', margin:0 }}>No audits found.</p>
                : recentAudits.map(a => (
                  <ListRow key={a.id} left={`${a.scope} Audit`} sub={`${a.date} · ${a.findings?.slice(0,35) || ''}${a.findings?.length > 35 ? '…' : ''}`} badge={a.status} />
                ))
              }
            </SectionCard>

            <SectionCard
              title="Compliance Issues"
              icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>}
              accent="linear-gradient(135deg,#dc2626,#f87171)"
              action="Review →" actionTo="/auditor/compliance-review"
            >
              {compIssues.length === 0
                ? <p style={{ fontSize:'13px', color:'#059669', fontWeight:'700', margin:0 }}>✅ No compliance issues found.</p>
                : compIssues.slice(0,5).map(r => (
                  <ListRow key={r.id} left={`Entity #${r.entityId} — ${r.type}`} sub={r.date} badge={r.result} />
                ))
              }
            </SectionCard>

            <SectionCard
              title="Recent Reports"
              icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>}
              accent="linear-gradient(135deg,#7c3aed,#a78bfa)"
              action="View all" actionTo="/auditor/reports"
            >
              {recentReports.length === 0
                ? <p style={{ fontSize:'13px', color:'#94a3b8', margin:0 }}>No reports found.</p>
                : recentReports.map(r => (
                  <ListRow key={r.id} left={`Report #${r.id}`} sub={r.generatedDate} badge={r.scope} />
                ))
              }
            </SectionCard>
          </div>
        </>
      )}
    </DashboardLayout>
  )
}

export default AuditorDashboard
