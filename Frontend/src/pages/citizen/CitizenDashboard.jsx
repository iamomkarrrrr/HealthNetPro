import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { WelcomeBanner, StatCard, SectionCard, QuickLink, ListRow, AlertBanner, ShellLoader, StatusPill } from '../../components/layout/DashboardShell'
import useAuth from '../../hooks/useAuth'
import useCitizen from '../../hooks/useCitizen'
import { getHealthProfileByCitizenId } from '../../api/healthProfileApi'
import { getDocumentsByCitizenId } from '../../api/citizenDocumentApi'
import { getImmunizationsByCitizenId } from '../../api/immunizationApi'
import { getVaccinationPrograms } from '../../api/vaccinationApi'
import { getOutbreaks } from '../../api/outbreakApi'
import { getNotificationsByUserId } from '../../api/notificationApi'

/* ── SVG Icons ── */
const I = {
  profile:   <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>,
  health:    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
  docs:      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
  vaccine:   <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M10 2v2M14 2v2M9 7h6l1 5H8L9 7z"/><path d="M8 12v5a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-5"/></svg>,
  outbreak:  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  bell:      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  report:    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  schedule:  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
}

const sm = (icon) => <svg width="16" height="16" viewBox={icon.props.viewBox} fill="none" stroke="white" strokeWidth="2">{icon.props.children}</svg>

const CitizenDashboard = () => {
  const { user } = useAuth()
  const { citizen, citizenId, loading: citizenLoading } = useCitizen()
  const [healthProfile, setHealthProfile] = useState(null)
  const [documents, setDocuments] = useState([])
  const [immunizations, setImmunizations] = useState([])
  const [vaccinationPrograms, setVaccinationPrograms] = useState([])
  const [outbreaks, setOutbreaks] = useState([])
  const [outbreakDenied, setOutbreakDenied] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!user?.userId) return
    setLoading(true)
    const citizenCalls = citizenId
      ? [getHealthProfileByCitizenId(citizenId), getDocumentsByCitizenId(citizenId), getImmunizationsByCitizenId(citizenId)]
      : [Promise.resolve(null), Promise.resolve(null), Promise.resolve(null)]
    Promise.allSettled([...citizenCalls, getVaccinationPrograms(), getOutbreaks(), getNotificationsByUserId(user.userId)])
      .then(([hp, docs, imm, vax, ob, notif]) => {
        if (hp?.status === 'fulfilled' && hp.value) setHealthProfile(hp.value.data?.data ?? null)
        if (docs?.status === 'fulfilled' && docs.value) setDocuments(docs.value.data?.data ?? [])
        if (imm?.status === 'fulfilled' && imm.value) setImmunizations(imm.value.data?.data ?? [])
        if (vax.status === 'fulfilled') setVaccinationPrograms(vax.value.data?.data ?? [])
        if (ob.status === 'fulfilled') setOutbreaks(ob.value.data?.data ?? [])
        else if (ob.reason?.response?.status === 403) setOutbreakDenied(true)
        if (notif.status === 'fulfilled') setNotifications(notif.value.data?.data ?? [])
      })
      .finally(() => setLoading(false))
  }, [citizenId, user?.userId])

  const activeOutbreaks = outbreaks.filter(o => ['DETECTED','ACTIVE'].includes(o.status))
  const unread = notifications.filter(n => n.status === 'UNREAD')
  const pendingDocs = documents.filter(d => d.verificationStatus === 'PENDING')
  const activeVax = vaccinationPrograms.filter(v => ['UPCOMING','ACTIVE'].includes(v.status))
  const givenImm = immunizations.filter(i => i.status === 'GIVEN')

  if (citizenLoading) return <DashboardLayout><ShellLoader message="Loading your portal…" /></DashboardLayout>

  return (
    <DashboardLayout>
      <WelcomeBanner
        name={user?.name}
        role="Citizen"
        subtitle="Stay updated with your health information, vaccination records, and public health alerts."
      />

      {!citizen && (
        <AlertBanner type="warning">
          <strong>Citizen profile not set up.</strong> <a href="/citizen/profile" style={{ color:'inherit', fontWeight:'800' }}>Create your citizen profile</a> to unlock all features.
        </AlertBanner>
      )}

      {activeOutbreaks.length > 0 && (
        <AlertBanner type="danger">
          <strong>{activeOutbreaks.length} active outbreak{activeOutbreaks.length > 1 ? 's' : ''} in your area.</strong>{' '}
          {activeOutbreaks.map(o => `${o.diseaseType} (${o.location})`).join(' · ')}. Stay safe and follow public health guidelines.
        </AlertBanner>
      )}

      {/* Stat Cards */}
      {loading ? <ShellLoader message="Loading your health data…" /> : (
        <>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'16px', marginBottom:'24px' }}>
            <StatCard
              label="Immunizations" value={givenImm.length}
              icon={I.vaccine} iconBg="linear-gradient(135deg,#059669,#34d399)"
              border="#bbf7d0" shadow="rgba(5,150,105,0.08)" shadowHover="rgba(5,150,105,0.18)"
              valueColor="#065f46" desc={`${immunizations.length} total records`}
              to="/citizen/vaccination-records"
            />
            <StatCard
              label="Documents" value={documents.length}
              icon={I.docs} iconBg="linear-gradient(135deg,#0284c7,#38bdf8)"
              border="#bae6fd" shadow="rgba(2,132,199,0.08)" shadowHover="rgba(2,132,199,0.18)"
              valueColor="#0369a1" desc={`${pendingDocs.length} pending verification`}
              to="/citizen/documents"
            />
            <StatCard
              label="Active Outbreaks" value={outbreakDenied ? '—' : activeOutbreaks.length}
              icon={I.outbreak} iconBg="linear-gradient(135deg,#dc2626,#f87171)"
              border="#fecaca" shadow="rgba(220,38,38,0.08)" shadowHover="rgba(220,38,38,0.18)"
              valueColor="#991b1b" desc={outbreakDenied ? 'Access restricted' : `${outbreaks.length} total`}
              to="/citizen/outbreak-alerts"
            />
            <StatCard
              label="Notifications" value={unread.length}
              icon={I.bell} iconBg="linear-gradient(135deg,#7c3aed,#a78bfa)"
              border="#ddd6fe" shadow="rgba(124,58,237,0.08)" shadowHover="rgba(124,58,237,0.18)"
              valueColor="#5b21b6" desc="Unread alerts"
              to="/citizen/notifications"
            />
          </div>

          {/* Quick Actions */}
          <div style={{ marginBottom:'24px' }}>
            <SectionCard title="Quick Actions" icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><polyline points="13 17 18 12 13 7"/><polyline points="6 17 11 12 6 7"/></svg>}>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'12px' }}>
                <QuickLink to="/citizen/profile" label="My Profile" desc="View & update citizen profile" icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>} iconBg="linear-gradient(135deg,#0284c7,#38bdf8)" />
                <QuickLink to="/citizen/health-profile" label="Health Profile" desc="Medical history & allergies" icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>} iconBg="linear-gradient(135deg,#0e9db5,#06b6d4)" />
                <QuickLink to="/citizen/documents" label="Documents" desc={`${documents.length} file(s) on record`} icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>} iconBg="linear-gradient(135deg,#7c3aed,#a78bfa)" />
                <QuickLink to="/citizen/vaccination-records" label="Vaccination Records" desc={`${immunizations.length} immunization(s)`} icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M10 2v2M14 2v2M9 7h6l1 5H8L9 7z"/><path d="M8 12v5a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-5"/></svg>} iconBg="linear-gradient(135deg,#059669,#34d399)" />
                <QuickLink to="/citizen/vaccination-schedules" label="Vax Schedules" desc={`${activeVax.length} active program(s)`} icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>} iconBg="linear-gradient(135deg,#0369a1,#0284c7)" />
                <QuickLink to="/citizen/outbreak-alerts" label="Outbreak Alerts" desc={outbreakDenied ? 'View access status' : `${activeOutbreaks.length} active alert(s)`} icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>} iconBg="linear-gradient(135deg,#dc2626,#f87171)" />
                <QuickLink to="/citizen/notifications" label="Notifications" desc={`${unread.length} unread`} icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>} iconBg="linear-gradient(135deg,#d97706,#fbbf24)" />
                <QuickLink to="/citizen/report-health-concern" label="Report Concern" desc="Submit a health concern" icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>} iconBg="linear-gradient(135deg,#be185d,#f472b6)" />
              </div>
            </SectionCard>
          </div>

          {/* Bottom row */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px' }}>
            <SectionCard
              title="Recent Notifications"
              icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>}
              accent="linear-gradient(135deg,#7c3aed,#a78bfa)"
              action="View all" actionTo="/citizen/notifications"
            >
              {unread.length === 0
                ? <p style={{ fontSize:'13px', color:'#94a3b8', margin:0 }}>✅ No unread notifications.</p>
                : unread.slice(0,5).map(n => (
                  <ListRow key={n.id} left={n.message} sub={`${n.category} · ${n.createdDate?.slice(0,10)}`} badge={n.status} />
                ))
              }
            </SectionCard>

            <SectionCard
              title="Active Outbreak Alerts"
              icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>}
              accent="linear-gradient(135deg,#dc2626,#f87171)"
              action="View all" actionTo="/citizen/outbreak-alerts"
            >
              {outbreakDenied
                ? <p style={{ fontSize:'13px', color:'#94a3b8', margin:0 }}>Outbreak data is restricted for citizens.</p>
                : activeOutbreaks.length === 0
                  ? <p style={{ fontSize:'13px', color:'#94a3b8', margin:0 }}>✅ No active outbreaks.</p>
                  : activeOutbreaks.slice(0,4).map(o => (
                    <ListRow key={o.id} left={o.diseaseType} sub={`📍 ${o.location}`} badge={o.status} />
                  ))
              }
            </SectionCard>
          </div>
        </>
      )}
    </DashboardLayout>
  )
}

export default CitizenDashboard
