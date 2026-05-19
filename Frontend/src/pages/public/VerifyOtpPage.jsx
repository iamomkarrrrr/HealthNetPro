import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import ErrorMessage from '../../components/common/ErrorMessage'
import PublicLayout from '../../components/layout/PublicLayout'
import { verifyOtp } from '../../api/authApi'

const VerifyOtpPage = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', otp: '' })
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value })
    setError('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    if (!form.email || !form.otp) {
      setError('Email and OTP are required')
      return
    }
    setLoading(true)
    try {
      await verifyOtp({ email: form.email, otp: form.otp })
      setMessage('OTP verified. Proceed to reset your password.')
      setTimeout(() => navigate('/reset-password', { state: { email: form.email, otp: form.otp } }), 1400)
    } catch (verifyError) {
      setError(verifyError?.response?.data?.message || verifyError.message || 'Unable to verify OTP')
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
              <h3 className="mb-1">Verify OTP</h3>
              <p className="text-muted">Enter the OTP sent to your email to continue.</p>
            </div>
            {error && <ErrorMessage message={error} />}
            {message && <div className="alert alert-success py-2">{message}</div>}
            <form onSubmit={handleSubmit} noValidate>
              <Input
                id="email"
                name="email"
                label="Email"
                type="email"
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
              <Button type="submit" className="w-100" disabled={loading}>
                {loading ? 'Verifying…' : 'Verify OTP'}
              </Button>
            </form>
            <p className="text-center text-muted small mt-4">
              <Link to="/forgot-password">Resend OTP</Link>
            </p>
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}

export default VerifyOtpPage
