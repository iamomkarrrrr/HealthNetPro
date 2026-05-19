import { Link } from 'react-router-dom'

const FEATURES = [
  { icon: '🚨', title: 'Outbreak Alerts', desc: 'Stay informed with near real-time outbreak notifications and community health warnings.' },
  { icon: '💉', title: 'Vaccination Schedules', desc: 'Track immunization programs, appointment reminders, and vaccination status.' },
  { icon: '🏥', title: 'Health Profile Access', desc: 'Manage your personal profile, health documents, and verification status securely.' },
  { icon: '📊', title: 'Public Health Surveillance', desc: 'Support community monitoring and response through trusted healthcare data.' },
  { icon: '📋', title: 'Compliance & Reporting', desc: 'Maintain audit-ready records and transparency for local health authorities.' },
  { icon: '🔔', title: 'Smart Notifications', desc: 'Receive targeted alerts based on your role, location, and health profile.' },
]

const CrossIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
    <rect x="9" y="2" width="6" height="20" rx="2" fill="white" />
    <rect x="2" y="9" width="20" height="6" rx="2" fill="white" />
  </svg>
)

const HomePage = () => (
  <div style={{ minHeight: '100svh', background: '#f0f4f8', fontFamily: "'Inter', system-ui, sans-serif" }}>
    {/* Navbar */}
    <nav style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '0 32px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 1px 4px rgba(10,50,114,0.06)', position: 'sticky', top: 0, zIndex: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #2b6cb0, #3182ce)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <rect x="9" y="2" width="6" height="20" rx="2" fill="white" />
            <rect x="2" y="9" width="20" height="6" rx="2" fill="white" />
          </svg>
        </div>
        <span style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.3px' }}>HealthNet</span>
      </div>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <Link to="/login" style={{ padding: '8px 20px', borderRadius: '9px', border: '1.5px solid #e2e8f0', background: '#ffffff', fontSize: '14px', fontWeight: '700', color: '#475569', textDecoration: 'none', transition: 'all 0.18s' }}>
          Sign in
        </Link>
        <Link to="/register" style={{ padding: '8px 20px', borderRadius: '9px', border: 'none', background: 'linear-gradient(135deg, #2b6cb0, #3182ce)', fontSize: '14px', fontWeight: '700', color: '#ffffff', textDecoration: 'none', boxShadow: '0 3px 10px rgba(49,130,206,0.30)' }}>
          Register
        </Link>
      </div>
    </nav>

    {/* Hero */}
    <section style={{ background: 'linear-gradient(135deg, #0d1b4b 0%, #0a3272 35%, #0284c7 70%, #06b6d4 100%)', padding: '80px 32px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '350px', height: '350px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(34,211,238,0.18), transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'relative', zIndex: 1, maxWidth: '680px', margin: '0 auto' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.20)', borderRadius: '999px', padding: '6px 16px', marginBottom: '24px' }}>
          <span style={{ fontSize: '12px', fontWeight: '700', color: 'rgba(255,255,255,0.85)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Healthcare Intelligence Platform</span>
        </div>
        <h1 style={{ fontSize: '52px', fontWeight: '900', color: '#ffffff', letterSpacing: '-1px', lineHeight: 1.1, marginBottom: '20px' }}>
          HealthNet
        </h1>
        <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.80)', lineHeight: 1.6, marginBottom: '36px', fontWeight: '500' }}>
          A comprehensive outbreak and pandemic management system for citizens, clinicians, and public health teams.
        </p>
        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/login" style={{ padding: '14px 32px', borderRadius: '12px', border: 'none', background: '#ffffff', fontSize: '15px', fontWeight: '800', color: '#0a3272', textDecoration: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.15)', transition: 'all 0.2s' }}>
            Sign in
          </Link>
          <Link to="/register" style={{ padding: '14px 32px', borderRadius: '12px', border: '2px solid rgba(255,255,255,0.40)', background: 'rgba(255,255,255,0.12)', fontSize: '15px', fontWeight: '800', color: '#ffffff', textDecoration: 'none', backdropFilter: 'blur(8px)' }}>
            Citizen Register
          </Link>
        </div>
      </div>
    </section>

    {/* Features */}
    <section style={{ padding: '64px 32px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <h2 style={{ fontSize: '32px', fontWeight: '900', color: '#0f172a', letterSpacing: '-0.5px', marginBottom: '12px' }}>
          Everything you need for public health management
        </h2>
        <p style={{ fontSize: '16px', color: '#64748b', maxWidth: '520px', margin: '0 auto' }}>
          Secure, role-based access for citizens, doctors, epidemiologists, and administrators.
        </p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        {FEATURES.map(({ icon, title, desc }) => (
          <div key={title} style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '18px', padding: '28px', boxShadow: '0 4px 12px rgba(0,0,0,0.04)', transition: 'box-shadow 0.2s' }}>
            <div style={{ fontSize: '28px', marginBottom: '14px' }}>{icon}</div>
            <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }}>{title}</h3>
            <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.6, margin: 0 }}>{desc}</p>
          </div>
        ))}
      </div>
    </section>

    {/* Footer */}
    <footer style={{ background: '#ffffff', borderTop: '1px solid #e2e8f0', padding: '32px', textAlign: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
        <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'linear-gradient(135deg, #2b6cb0, #3182ce)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <rect x="9" y="2" width="6" height="20" rx="2" fill="white" />
            <rect x="2" y="9" width="20" height="6" rx="2" fill="white" />
          </svg>
        </div>
        <span style={{ fontWeight: '800', color: '#0f172a' }}>HealthNet</span>
      </div>
      <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>
        &copy; 2026 HealthNet. All rights reserved. &mdash; Outbreak &amp; Pandemic Management System
      </p>
    </footer>
  </div>
)

export default HomePage
