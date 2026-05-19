import { useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import ErrorMessage from '../../components/common/ErrorMessage'
import PublicLayout from '../../components/layout/PublicLayout'
import { resetPassword } from '../../api/authApi'

const ResetPasswordPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: location.state?.email || '', otp: location.state?.otp || '', confirmPassword: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value })
    setError('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
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
    } catch (resetError) {
      setError(resetError?.response?.data?.message || resetError.message || 'Unable to reset password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <PublicLayout>
      <div className="row justify-content-center">
        <div className="col-xl-5 col-lg-6">
          <div className="card card-surface p-4 shadow-soft">
            <div className="mb-4 text-center">
              <h3 className="mb-1">Reset Password</h3>
              <p className="text-muted">Set a new password for your HealthNet account.</p>
            </div>
            {error && <ErrorMessage message={error} />}
            {success && <div className="alert alert-success py-2">{success}</div>}
            <form onSubmit={handleSubmit} noValidate>
              <Input
                id="email"
                name="email"
                type="email"
                label="Email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
              />
                <Input
                  id="otp"
                  name="otp"
                  label="OTP Code"
                  type="text"
                  value={form.otp}
                  onChange={handleChange}
                  placeholder="Enter OTP"
                />
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                label="Confirm Password"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Enter your new password"
              />
              <Button type="submit" className="w-100" disabled={loading}>
                {loading ? 'Resetting…' : 'Reset Password'}
              </Button>
            </form>
            <p className="text-center text-muted small mt-4">
              <Link to="/login">Back to login</Link>
            </p>
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}

export default ResetPasswordPage
