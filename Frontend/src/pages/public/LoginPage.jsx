import { useState } from 'react'
import { Link } from 'react-router-dom'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import ErrorMessage from '../../components/common/ErrorMessage'
import PublicLayout from '../../components/layout/PublicLayout'
import useAuth from '../../hooks/useAuth'
import { LOGIN_ROLE_OPTIONS, CITIZEN } from '../../utils/roles'

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
    <PublicLayout>
      <div className="row justify-content-center">
        <div className="col-xl-5 col-lg-6">
          <div className="card card-surface p-4 shadow-soft">
            <div className="mb-4 text-center">
              <h3 className="mb-1">Sign in to HealthNet</h3>
              <p className="text-muted">Enter your credentials to access your secure dashboard.</p>
            </div>
            {error && <ErrorMessage message={error} />}
            <form onSubmit={handleSubmit} noValidate>
              <Input
                id="email"
                label="Email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                error={formError.email}
              />
              <Input
                id="password"
                label="Password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                error={formError.password}
              />
              <div className="mb-3">
                <label htmlFor="role" className="form-label">Role</label>
                <select
                  id="role"
                  name="role"
                  className={`form-select ${formError.role ? 'is-invalid' : ''}`}
                  value={form.role}
                  onChange={handleChange}
                >
                  {LOGIN_ROLE_OPTIONS.map(({ value, label }) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
                {formError.role && <div className="invalid-feedback">{formError.role}</div>}
              </div>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <Link to="/forgot-password" className="small">Forgot password?</Link>
              </div>
              <Button type="submit" className="w-100" disabled={loading}>
                {loading ? 'Signing in…' : 'Sign in'}
              </Button>
            </form>
            <p className="text-center text-muted small mt-4">
              New to HealthNet? <Link to="/register">Register as a citizen</Link>
            </p>
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}

export default LoginPage
