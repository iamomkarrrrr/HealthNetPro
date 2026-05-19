import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { verifyOtp } from '../../api/authApi'

const CrossIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <rect x="9" y="2" width="6" height="20" rx="2" fill="white" />
    <rect x="2" y="9" width="20" height="6" rx="2" fill="white" />
  </svg>
)

const VerifyOtpPage = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', otp: '' })
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.email || !form.otp) { setError('Email and OTP are required'); return }
    setLoading(true)
    try {
      await verifyOtp({ email: form.email, otp: form.otp })
      setMessage('OTP verified. Redirecting to reset password…')
      setTimeout(() => navigate('/reset-password', { state: { email: form.email, otp: form.otp } }), 1400)
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Unable to verify OTP')
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
          <div className="hn-auth-subtitle">OTP Verification</div>
        </div>

        <div className="hn-form-heading">Verify OTP</div>
        <p style={{ textAlign: 'center', color: '#64748b', fontSize: '13px', marginBottom: '20px', marginTop: '-12px' }}>
          Enter the OTP sent to your email to continue.
        </p>

        {error && <div className="hn-auth-error">{error}</div>}
        {message && <div className="hn-auth-success">{message}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="hn-field">
            <label htmlFor="email">Email address</label>
            <input
              id="email" name="email" type="email"
              className="hn-input"
              value={form.email} onChange={handleChange}
              placeholder="you@example.com"
            />
          </div>
          <div className="hn-field">
            <label htmlFor="otp">OTP Code</label>
            <input
              id="otp" name="otp" type="text"
              className="hn-input"
              value={form.otp} onChange={handleChange}
              placeholder="Enter OTP"
            />
          </div>
          <button type="submit" className="hn-btn-primary" disabled={loading}>
            {loading ? <><span className="hn-spinner" /> Verifying...</> : 'Verify OTP'}
          </button>
        </form>

        <div className="hn-auth-footer">
          <Link to="/forgot-password" className="hn-auth-link">Resend OTP</Link>
        </div>
      </div>
    </div>
  )
}

export default VerifyOtpPage
