import { Link } from 'react-router-dom'

const NotFoundPage = () => (
  <div className="hn-auth-page">
    <div className="hn-auth-card" style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '64px', marginBottom: '16px' }}>🔍</div>
      <h1 style={{ fontSize: '48px', fontWeight: '900', color: '#0f172a', marginBottom: '8px' }}>404</h1>
      <p style={{ color: '#64748b', marginBottom: '28px', fontSize: '15px' }}>
        The page you are looking for cannot be found.
      </p>
      <Link to="/" className="hn-btn-primary" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 'auto', padding: '0 32px' }}>
        Go to Home
      </Link>
    </div>
  </div>
)

export default NotFoundPage
