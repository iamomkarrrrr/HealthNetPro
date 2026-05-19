import { useState } from 'react'
import { Link } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import { LOGIN_ROLE_OPTIONS, CITIZEN } from '../../utils/roles'

const CrossIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <rect x="9" y="2" width="6" height="20" rx="2" fill="white" />
    <rect x="2" y="9" width="20" height="6" rx="2" fill="white" />
  </svg>
)

const LoginPage = () => {
  const { login, loading, error } = useAuth()
  const [form, setForm] = useState({ email: '', password: '', role: CITIZEN })
  const [formError, setFormError] = useState({})

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setFormError({ ...formError, [e.target.name]: '' })
  }

  const validate = () => {
    const errs = {}
    if (!form.email) errs.email = 'Email is required'
    if (!form.password) errs.password = 'Password is required'
    if (!form.role) errs.role = 'Role is required'
    setFormError(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    await login({ email: form.email, password: form.password, role: form.role })
  }

  return (
    <div className="hn-auth-page">
      <div className="hn-auth-card">
        {/* Brand */}
        <div className="hn-auth-brand">
          <div className="hn-auth-logo"><CrossIcon /></div>
          <div className="hn-auth-title">HealthNet</div>
          <div className="hn-auth-subtitle">National Public Health &amp; Disease Surveillance System</div>
        </div>

        <div className="hn-form-heading">Sign in to your account</div>

        {error && <div className="hn-auth-error">{error}</div>}

        <form onSubmit={handleSubmit} noValidate>
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
            <label htmlFor="password">Password</label>
            <input
              id="password" name="password" type="password"
              className={`hn-input${formError.password ? ' is-invalid' : ''}`}
              value={form.password} onChange={handleChange}
              placeholder="Enter your password"
            />
            {formError.password && <span className="hn-field-error">{formError.password}</span>}
          </div>

          <div className="hn-field">
            <label htmlFor="role">Role</label>
            <select
              id="role" name="role"
              className={`hn-select${formError.role ? ' is-invalid' : ''}`}
              value={form.role} onChange={handleChange}
            >
              {LOGIN_ROLE_OPTIONS.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
            {formError.role && <span className="hn-field-error">{formError.role}</span>}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
            <Link to="/forgot-password" className="hn-auth-link" style={{ fontSize: '13px' }}>
              Forgot password?
            </Link>
          </div>

          <button type="submit" className="hn-btn-primary" disabled={loading}>
            {loading ? <><span className="hn-spinner" /> Please wait...</> : 'Sign in'}
          </button>
        </form>

        <div className="hn-auth-footer">
          New to HealthNet?{' '}
          <Link to="/register" className="hn-auth-link">Register as a citizen</Link>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
