import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import ErrorMessage from '../../components/common/ErrorMessage'
import PublicLayout from '../../components/layout/PublicLayout'
import { forgotPassword } from '../../api/authApi'

const ForgotPasswordPage = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setMessage('')
    if (!email) {
      setError('Email is required')
      return
    }
    setLoading(true)
    try {
      await forgotPassword({ email })
      setMessage('OTP has been sent to your email. Please check your inbox.')
      setTimeout(() => navigate('/verify-otp'), 1800)
    } catch (fetchError) {
      setError(fetchError?.response?.data?.message || fetchError.message || 'Unable to send OTP')
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
              <h3 className="mb-1">Forgot Password</h3>
              <p className="text-muted">Enter your email to receive a one-time password reset code.</p>
            </div>
            {error && <ErrorMessage message={error} />}
            {message && <div className="alert alert-success py-2">{message}</div>}
            <form onSubmit={handleSubmit} noValidate>
              <Input
                id="email"
                label="Email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                error={error === 'Email is required' ? error : ''}
              />
              <Button type="submit" className="w-100" disabled={loading}>
                {loading ? 'Sending OTP…' : 'Send OTP'}
              </Button>
            </form>
            <p className="text-center text-muted small mt-4">
              Remembered your password? <Link to="/login">Back to login</Link>
            </p>
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}

export default ForgotPasswordPage
