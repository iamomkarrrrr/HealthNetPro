import { Link } from 'react-router-dom'

const PublicHeader = () => (
  <nav style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '0 32px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 1px 4px rgba(10,50,114,0.06)' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #2b6cb0, #3182ce)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <rect x="9" y="2" width="6" height="20" rx="2" fill="white" />
          <rect x="2" y="9" width="20" height="6" rx="2" fill="white" />
        </svg>
      </div>
      <Link to="/" style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', textDecoration: 'none', letterSpacing: '-0.3px' }}>HealthNet</Link>
    </div>
    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
      <Link to="/login" style={{ padding: '8px 20px', borderRadius: '9px', border: '1.5px solid #e2e8f0', background: '#ffffff', fontSize: '14px', fontWeight: '700', color: '#475569', textDecoration: 'none' }}>
        Sign in
      </Link>
      <Link to="/register" style={{ padding: '8px 20px', borderRadius: '9px', border: 'none', background: 'linear-gradient(135deg, #2b6cb0, #3182ce)', fontSize: '14px', fontWeight: '700', color: '#ffffff', textDecoration: 'none', boxShadow: '0 3px 10px rgba(49,130,206,0.30)' }}>
        Register
      </Link>
    </div>
  </nav>
)

export default PublicHeader
