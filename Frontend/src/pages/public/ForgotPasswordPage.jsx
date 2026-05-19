import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { forgotPassword } from '../../api/authApi'

const CrossIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <rect x="9" y="2" width="6" height="20" rx="2" fill="white" />
    <rect x="2" y="9" width="20" height="6" rx="2" fill="white" />
  </svg>
)

const ForgotPasswordPage = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    if (!email) { setError('Email is required'); return }
    setLoading(true)
    try {
      await forgotPassword({ email })
      setMessage('OTP has been sent to your email. Please check your inbox.')
      setTimeout(() => navigate('/verify-otp'), 1800)
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Unable to send OTP')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="hn-auth-page">
      <div className="hn-auth-card">
        <div className="hn-auth-brand">
          <div className="hn-auth-logo"><CrossIcon /></div>
          <div className="hn-auth-title">HealthNet</div>
          <div className="hn-auth-subtitle">Password Recovery</div>
        </div>

        <div className="hn-form-heading">Forgot Password</div>
        <p style={{ textAlign: 'center', color: '#64748b', fontSize: '13px', marginBottom: '20px', marginTop: '-12px' }}>
          Enter your email to receive a one-time password reset code.
        </p>

        {error && <div className="hn-auth-error">{error}</div>}
        {message && <div className="hn-auth-success">{message}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="hn-field">
            <label htmlFor="email">Email address</label>
            <input
              id="email" type="email"
              className="hn-input"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError('') }}
              placeholder="you@example.com"
            />
          </div>
          <button type="submit" className="hn-btn-primary" disabled={loading}>
            {loading ? <><span className="hn-spinner" /> Sending OTP...</> : 'Send OTP'}
          </button>
        </form>

        <div className="hn-auth-footer">
          Remembered your password?{' '}
          <Link to="/login" className="hn-auth-link">Back to login</Link>
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordPage
