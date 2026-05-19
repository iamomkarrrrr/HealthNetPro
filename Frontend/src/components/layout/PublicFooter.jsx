const PublicFooter = () => (
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
      &copy; 2026 HealthNet. All rights reserved.
    </p>
  </footer>
)

export default PublicFooter
