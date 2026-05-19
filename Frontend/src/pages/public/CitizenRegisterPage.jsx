import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import ErrorMessage from '../../components/common/ErrorMessage'
import PublicLayout from '../../components/layout/PublicLayout'
import { registerCitizen } from '../../api/authApi'

const CitizenRegisterPage = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' })
  const [formError, setFormError] = useState({})
  const [serverError, setServerError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value })
    setFormError({ ...formError, [event.target.name]: '' })
  }

  const validate = () => {
    const nextError = {}
    if (!form.name) nextError.name = 'Name is required'
    if (!form.email) nextError.email = 'Email is required'
    if (!form.phone) nextError.phone = 'Phone number is required'
    if (!form.password) nextError.password = 'Password is required'
    if (form.password && form.password.length < 6) nextError.password = 'Password must be at least 6 characters'
    setFormError(nextError)
    return Object.keys(nextError).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setServerError('')
    setSuccess('')
    if (!validate()) return
    setLoading(true)
    try {
      await registerCitizen({
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password
      })
      setSuccess('Citizen registration successful. Redirecting to login…')
      setTimeout(() => navigate('/login'), 1800)
    } catch (postError) {
      setServerError(postError?.response?.data?.message || postError.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <PublicLayout>
      <div className="row justify-content-center">
        <div className="col-xl-6 col-lg-7">
          <div className="card card-surface p-4 shadow-soft">
            <div className="mb-4 text-center">
              <h3 className="mb-1">Citizen Registration</h3>
              <p className="text-muted">Create a secure citizen account to access your health profile and alerts.</p>
            </div>
            {serverError && <ErrorMessage message={serverError} />}
            {success && <div className="alert alert-success py-2">{success}</div>}
            <form onSubmit={handleSubmit} noValidate>
              <Input
                id="name"
                name="name"
                label="Full Name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your full name"
                error={formError.name}
              />
              <Input
                id="email"
                name="email"
                type="email"
                label="Email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                error={formError.email}
              />
              <Input
                id="phone"
                name="phone"
                type="tel"
                label="Phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="123-456-7890"
                error={formError.phone}
              />
              <Input
                id="password"
                name="password"
                type="password"
                label="Password"
                value={form.password}
                onChange={handleChange}
                placeholder="Create your password"
                error={formError.password}
              />
              <Button type="submit" className="w-100" disabled={loading}>
                {loading ? 'Creating account…' : 'Register as Citizen'}
              </Button>
            </form>
            <p className="text-center text-muted small mt-4">
              Already have an account? <Link to="/login">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}

export default CitizenRegisterPage
