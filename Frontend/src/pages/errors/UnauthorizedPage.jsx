import { Link } from 'react-router-dom'

const UnauthorizedPage = () => (
  <div className="hn-auth-page">
    <div className="hn-auth-card" style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '64px', marginBottom: '16px' }}>🔒</div>
      <h1 style={{ fontSize: '28px', fontWeight: '900', color: '#0f172a', marginBottom: '12px' }}>Unauthorized</h1>
      <p style={{ color: '#64748b', marginBottom: '28px', fontSize: '15px' }}>
        You do not have permission to access this page.
      </p>
      <Link to="/login" className="hn-btn-primary" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 'auto', padding: '0 32px' }}>
        Return to Login
      </Link>
    </div>
  </div>
)

export default UnauthorizedPage
