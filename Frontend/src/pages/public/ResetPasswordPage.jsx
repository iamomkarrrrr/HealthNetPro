import { useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { resetPassword } from '../../api/authApi'

const CrossIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <rect x="9" y="2" width="6" height="20" rx="2" fill="white" />
    <rect x="2" y="9" width="20" height="6" rx="2" fill="white" />
  </svg>
)

const ResetPasswordPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    email: location.state?.email || '',
    otp: location.state?.otp || '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.email || !form.otp || !form.confirmPassword) {
      setError('Please complete all required fields')
      return
    }
    setLoading(true)
    try {
      await resetPassword({ email: form.email, otp: form.otp, newPassword: form.confirmPassword })
      setSuccess('Password reset successful. Redirecting to login…')
      setTimeout(() => navigate('/login'), 1600)
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Unable to reset password')
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
          <div className="hn-auth-subtitle">Set a new password</div>
        </div>

        <div className="hn-form-heading">Reset Password</div>

        {error && <div className="hn-auth-error">{error}</div>}
        {success && <div className="hn-auth-success">{success}</div>}

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
          <div className="hn-field">
            <label htmlFor="confirmPassword">New Password</label>
            <input
              id="confirmPassword" name="confirmPassword" type="password"
              className="hn-input"
              value={form.confirmPassword} onChange={handleChange}
              placeholder="Enter your new password"
            />
          </div>
          <button type="submit" className="hn-btn-primary" disabled={loading}>
            {loading ? <><span className="hn-spinner" /> Resetting...</> : 'Reset Password'}
          </button>
        </form>

        <div className="hn-auth-footer">
          <Link to="/login" className="hn-auth-link">Back to login</Link>
        </div>
      </div>
    </div>
  )
}

export default ResetPasswordPage
