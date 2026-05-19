import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerCitizen } from '../../api/authApi'

const CrossIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <rect x="9" y="2" width="6" height="20" rx="2" fill="white" />
    <rect x="2" y="9" width="20" height="6" rx="2" fill="white" />
  </svg>
)

const CitizenRegisterPage = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' })
  const [formError, setFormError] = useState({})
  const [serverError, setServerError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setFormError({ ...formError, [e.target.name]: '' })
  }

  const validate = () => {
    const errs = {}
    if (!form.name) errs.name = 'Name is required'
    if (!form.email) errs.email = 'Email is required'
    if (!form.phone) errs.phone = 'Phone number is required'
    if (!form.password) errs.password = 'Password is required'
    if (form.password && form.password.length < 6) errs.password = 'Password must be at least 6 characters'
    setFormError(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setServerError('')
    setSuccess('')
    if (!validate()) return
    setLoading(true)
    try {
      await registerCitizen({ name: form.name, email: form.email, phone: form.phone, password: form.password })
      setSuccess('Registration successful! Redirecting to login…')
      setTimeout(() => navigate('/login'), 1800)
    } catch (err) {
      setServerError(err?.response?.data?.message || err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="hn-auth-page">
      <div className="hn-auth-card" style={{ maxWidth: '500px' }}>
        {/* Brand */}
        <div className="hn-auth-brand">
          <div className="hn-auth-logo"><CrossIcon /></div>
          <div className="hn-auth-title">HealthNet</div>
          <div className="hn-auth-subtitle">Create your citizen account</div>
        </div>

        <div className="hn-form-heading">Citizen Registration</div>

        {serverError && <div className="hn-auth-error">{serverError}</div>}
        {success && <div className="hn-auth-success">{success}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="hn-field">
            <label htmlFor="name">Full Name</label>
            <input
              id="name" name="name" type="text"
              className={`hn-input${formError.name ? ' is-invalid' : ''}`}
              value={form.name} onChange={handleChange}
              placeholder="Your full name"
            />
            {formError.name && <span className="hn-field-error">{formError.name}</span>}
          </div>

          <div className="hn-field">
            <label htmlFor="email">Email address</label>
            <input
              id="email" name="email" type="email"
              className={`hn-input${formError.email ? ' is-invalid' : ''}`}
              value={form.email} onChange={handleChange}
              placeholder="you@example.com"
            />
            {formError.email && <span className="hn-field-error">{formError.email}</span>}
          </div>

          <div className="hn-field">
            <label htmlFor="phone">Phone Number</label>
            <input
              id="phone" name="phone" type="tel"
              className={`hn-input${formError.phone ? ' is-invalid' : ''}`}
              value={form.phone} onChange={handleChange}
              placeholder="123-456-7890"
            />
            {formError.phone && <span className="hn-field-error">{formError.phone}</span>}
          </div>

          <div className="hn-field">
            <label htmlFor="password">Password</label>
            <input
              id="password" name="password" type="password"
              className={`hn-input${formError.password ? ' is-invalid' : ''}`}
              value={form.password} onChange={handleChange}
              placeholder="Create a strong password"
            />
            {formError.password && <span className="hn-field-error">{formError.password}</span>}
          </div>

          <button type="submit" className="hn-btn-primary" disabled={loading}>
            {loading ? <><span className="hn-spinner" /> Creating account...</> : 'Register as Citizen'}
          </button>
        </form>

        <div className="hn-auth-footer">
          Already have an account?{' '}
          <Link to="/login" className="hn-auth-link">Sign in</Link>
        </div>
      </div>
    </div>
  )
}

export default CitizenRegisterPage
