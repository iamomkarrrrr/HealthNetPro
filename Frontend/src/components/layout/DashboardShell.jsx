/**
 * DashboardShell.jsx
 * Shared impactful UI primitives used across ALL role dashboards.
 * No external deps — pure inline styles matching the HealthNet design system.
 */
import { Link } from 'react-router-dom'

/* ── Welcome Banner ── */
export function WelcomeBanner({ name, role, subtitle, gradient }) {
  const bg = gradient || 'linear-gradient(135deg,#e0f2fe 0%,#bae6fd 40%,#e0f7fa 75%,#ccfbf1 100%)'
  return (
    <div style={{
      borderRadius: '18px', padding: '28px 32px', marginBottom: '28px',
      background: bg, border: '1px solid rgba(2,132,199,0.18)',
      boxShadow: '0 4px 20px rgba(2,132,199,0.10)',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position:'absolute', top:'-30px', right:'-30px', width:'160px', height:'160px', borderRadius:'50%', background:'radial-gradient(circle,rgba(6,182,212,0.18),transparent 70%)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:'-20px', left:'20%', width:'120px', height:'120px', borderRadius:'50%', background:'radial-gradient(circle,rgba(2,132,199,0.12),transparent 70%)', pointerEvents:'none' }} />
      <div style={{ position:'relative', zIndex:1, display:'flex', alignItems:'center', gap:'18px' }}>
        <div style={{ width:'52px', height:'52px', borderRadius:'14px', background:'linear-gradient(135deg,#0284c7,#06b6d4)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 14px rgba(2,132,199,0.30)', flexShrink:0 }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <rect x="9" y="2" width="6" height="20" rx="2" fill="white"/>
            <rect x="2" y="9" width="20" height="6" rx="2" fill="white"/>
          </svg>
        </div>
        <div>
          <div style={{ fontSize:'22px', fontWeight:'800', color:'#0c4a6e', letterSpacing:'-0.3px' }}>
            Welcome back{name ? `, ${name}` : ''} 👋
          </div>
          <div style={{ fontSize:'13px', color:'#0369a1', marginTop:'5px', fontWeight:'500' }}>
            {subtitle || `You are logged in as ${role || 'User'}. Here is your health system overview.`}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Stat Card ── */
export function StatCard({ label, value, icon, iconBg, border, shadow, shadowHover, valueColor, desc, to }) {
  const inner = (
    <div style={{
      background:'#ffffff', borderRadius:'16px',
      border:`1px solid ${border || '#e2e8f0'}`,
      boxShadow: shadow || '0 2px 12px rgba(10,50,114,0.06)',
      padding:'20px 22px', display:'flex', alignItems:'center', gap:'16px',
      transition:'transform 0.18s, box-shadow 0.18s', cursor: to ? 'pointer' : 'default',
      textDecoration:'none', color:'inherit',
    }}
      onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow = shadowHover || '0 8px 24px rgba(10,50,114,0.12)' }}
      onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow = shadow || '0 2px 12px rgba(10,50,114,0.06)' }}
    >
      <div style={{ width:'50px', height:'50px', borderRadius:'14px', flexShrink:0, background: iconBg || 'linear-gradient(135deg,#0284c7,#38bdf8)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 12px rgba(2,132,199,0.25)' }}>
        {icon}
      </div>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontSize:'28px', fontWeight:'800', color: valueColor || '#0f172a', lineHeight:1 }}>{value ?? '—'}</div>
        <div style={{ fontSize:'12px', fontWeight:'600', color:'#64748b', marginTop:'5px' }}>{label}</div>
        {desc && <div style={{ fontSize:'11px', color:'#94a3b8', marginTop:'2px' }}>{desc}</div>}
      </div>
    </div>
  )
  return to ? <Link to={to} style={{ textDecoration:'none' }}>{inner}</Link> : inner
}

/* ── Section Card ── */
export function SectionCard({ title, icon, children, action, actionTo, accent }) {
  return (
    <div style={{ background:'#ffffff', borderRadius:'16px', border:'1px solid #e8edf5', boxShadow:'0 2px 12px rgba(10,50,114,0.05)', overflow:'hidden' }}>
      <div style={{ padding:'16px 20px', borderBottom:'1px solid #f1f5f9', display:'flex', alignItems:'center', justifyContent:'space-between', gap:'12px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
          {icon && (
            <div style={{ width:'32px', height:'32px', borderRadius:'9px', background: accent || 'linear-gradient(135deg,#0284c7,#06b6d4)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              {icon}
            </div>
          )}
          {!icon && <div style={{ width:'4px', height:'20px', borderRadius:'4px', background: accent || 'linear-gradient(180deg,#0284c7,#06b6d4)' }} />}
          <span style={{ fontSize:'15px', fontWeight:'800', color:'#0f172a' }}>{title}</span>
        </div>
        {action && actionTo && (
          <Link to={actionTo} style={{ fontSize:'12px', fontWeight:'700', color:'#0284c7', textDecoration:'none', padding:'5px 12px', borderRadius:'8px', border:'1px solid #bae6fd', background:'#f0f9ff', transition:'all 0.18s' }}
            onMouseEnter={e => { e.currentTarget.style.background='#e0f2fe' }}
            onMouseLeave={e => { e.currentTarget.style.background='#f0f9ff' }}
          >{action}</Link>
        )}
      </div>
      <div style={{ padding:'16px 20px' }}>{children}</div>
    </div>
  )
}

/* ── Quick Link Card ── */
export function QuickLink({ to, label, desc, icon, iconBg }) {
  return (
    <Link to={to} style={{
      display:'flex', alignItems:'center', gap:'14px',
      padding:'16px 18px', borderRadius:'14px',
      background:'#ffffff', border:'1px solid #e8edf5',
      textDecoration:'none', color:'#1e293b',
      boxShadow:'0 1px 4px rgba(10,50,114,0.05)',
      transition:'all 0.18s',
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor='#bfdbfe'; e.currentTarget.style.background='#f0f7ff'; e.currentTarget.style.boxShadow='0 4px 16px rgba(2,132,199,0.12)'; e.currentTarget.style.transform='translateY(-1px)' }}
      onMouseLeave={e => { e.currentTarget.style.borderColor='#e8edf5'; e.currentTarget.style.background='#ffffff'; e.currentTarget.style.boxShadow='0 1px 4px rgba(10,50,114,0.05)'; e.currentTarget.style.transform='translateY(0)' }}
    >
      <div style={{ width:'40px', height:'40px', borderRadius:'11px', background: iconBg || 'linear-gradient(135deg,#0284c7,#38bdf8)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, boxShadow:'0 3px 8px rgba(2,132,199,0.20)' }}>
        {icon}
      </div>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontSize:'13px', fontWeight:'700', color:'#0f172a' }}>{label}</div>
        {desc && <div style={{ fontSize:'11px', color:'#64748b', marginTop:'2px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{desc}</div>}
      </div>
      <svg style={{ color:'#94a3b8', flexShrink:0 }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
    </Link>
  )
}

/* ── Status Pill ── */
export function StatusPill({ status }) {
  const MAP = {
    ACTIVE:          { bg:'#dcfce7', color:'#166534' },
    UPCOMING:        { bg:'#dbeafe', color:'#1e40af' },
    DETECTED:        { bg:'#fee2e2', color:'#991b1b' },
    CONTAINED:       { bg:'#fef9c3', color:'#854d0e' },
    CLOSED:          { bg:'#f1f5f9', color:'#475569' },
    REPORTED:        { bg:'#dbeafe', color:'#1e40af' },
    UNDER_TREATMENT: { bg:'#fef3c7', color:'#92400e' },
    RECOVERED:       { bg:'#dcfce7', color:'#166534' },
    COMPLETED:       { bg:'#f1f5f9', color:'#475569' },
    UNREAD:          { bg:'#ede9fe', color:'#5b21b6' },
    READ:            { bg:'#f1f5f9', color:'#64748b' },
    OPEN:            { bg:'#fef3c7', color:'#92400e' },
    IN_REVIEW:       { bg:'#dbeafe', color:'#1e40af' },
    PASS:            { bg:'#dcfce7', color:'#166534' },
    FAIL:            { bg:'#fee2e2', color:'#991b1b' },
    WARNING:         { bg:'#fef3c7', color:'#92400e' },
    NON_COMPLIANT:   { bg:'#fee2e2', color:'#991b1b' },
    GIVEN:           { bg:'#dcfce7', color:'#166534' },
    MISSED:          { bg:'#fee2e2', color:'#991b1b' },
    PENDING:         { bg:'#fef3c7', color:'#92400e' },
    VERIFIED:        { bg:'#dcfce7', color:'#166534' },
    REJECTED:        { bg:'#fee2e2', color:'#991b1b' },
    SUSPENDED:       { bg:'#fee2e2', color:'#991b1b' },
    INACTIVE:        { bg:'#f1f5f9', color:'#64748b' },
  }
  const s = MAP[status] || { bg:'#f1f5f9', color:'#475569' }
  return (
    <span style={{ background:s.bg, color:s.color, borderRadius:'999px', fontSize:'11px', fontWeight:'700', padding:'3px 10px', whiteSpace:'nowrap' }}>
      {status?.replace(/_/g,' ') || '—'}
    </span>
  )
}

/* ── List Row ── */
export function ListRow({ left, right, sub, badge }) {
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'11px 0', borderBottom:'1px solid #f1f5f9' }}>
      <div style={{ minWidth:0 }}>
        <div style={{ fontSize:'13px', fontWeight:'600', color:'#0f172a', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{left}</div>
        {sub && <div style={{ fontSize:'11px', color:'#94a3b8', marginTop:'2px' }}>{sub}</div>}
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:'8px', flexShrink:0, marginLeft:'12px' }}>
        {badge && <StatusPill status={badge} />}
        {right && <span style={{ fontSize:'12px', color:'#64748b', fontWeight:'600' }}>{right}</span>}
      </div>
    </div>
  )
}

/* ── Alert Banner ── */
export function AlertBanner({ type, children }) {
  const styles = {
    danger:  { bg:'#fef2f2', border:'#fecaca', color:'#991b1b', icon:'⚠️' },
    warning: { bg:'#fffbeb', border:'#fde68a', color:'#92400e', icon:'⚡' },
    success: { bg:'#f0fdf4', border:'#bbf7d0', color:'#166534', icon:'✅' },
    info:    { bg:'#eff6ff', border:'#bfdbfe', color:'#1e40af', icon:'ℹ️' },
  }
  const s = styles[type] || styles.info
  return (
    <div style={{ background:s.bg, border:`1px solid ${s.border}`, borderRadius:'12px', padding:'14px 18px', display:'flex', alignItems:'flex-start', gap:'10px', marginBottom:'20px' }}>
      <span style={{ fontSize:'16px', flexShrink:0 }}>{s.icon}</span>
      <div style={{ fontSize:'13px', color:s.color, fontWeight:'600', lineHeight:1.5 }}>{children}</div>
    </div>
  )
}

/* ── Page Header ── */
export function PageHeader({ title, subtitle, icon, action }) {
  return (
    <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:'24px', gap:'16px', flexWrap:'wrap' }}>
      <div style={{ display:'flex', alignItems:'center', gap:'14px' }}>
        {icon && (
          <div style={{ width:'46px', height:'46px', borderRadius:'13px', background:'linear-gradient(135deg,#0284c7,#06b6d4)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 12px rgba(2,132,199,0.25)', flexShrink:0 }}>
            {icon}
          </div>
        )}
        <div>
          <h2 style={{ fontSize:'22px', fontWeight:'900', color:'#0f172a', letterSpacing:'-0.3px', margin:0 }}>{title}</h2>
          {subtitle && <p style={{ fontSize:'13px', color:'#64748b', margin:'4px 0 0', fontWeight:'500' }}>{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  )
}

/* ── Loader ── */
export function ShellLoader({ message }) {
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', padding:'60px 0', gap:'14px' }}>
      <div style={{ width:'20px', height:'20px', borderRadius:'50%', border:'3px solid #bae6fd', borderTopColor:'#0284c7', animation:'hnSpin 0.7s linear infinite' }} />
      <span style={{ fontSize:'14px', color:'#64748b', fontWeight:'600' }}>{message || 'Loading…'}</span>
    </div>
  )
}
