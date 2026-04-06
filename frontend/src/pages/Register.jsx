import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authAPI } from '../api'
import './Login.css'

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role_id: '1' // Default to Viewer
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    try {
      const response = await authAPI.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role_id: parseInt(formData.role_id)
      })

      localStorage.setItem('userId', response.data.id)
      localStorage.setItem('userEmail', response.data.email)
      localStorage.setItem('userName', response.data.name)
      localStorage.setItem('userRole', response.data.role_id)

      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-left">
          <div className="logo-section">
            <div className="brand-logo">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
            </div>
            <h1>Create Account</h1>
            <p className="brand-motto">Join FinanceHub to track your operations</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form" style={{ marginBottom: 0 }}>
            {error && (
              <div className="error-box">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                {error}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                type="text"
                name="name"
                placeholder="Jane Doe"
                value={formData.name}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="name@company.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>



            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-login"
              disabled={loading}
            >
              {loading ? <span className="loading"></span> : 'Create Account'}
            </button>
            <div className="auth-links">
              <span>Already have an account? <Link to="/login">Sign in instead</Link></span>
            </div>
          </form>
        </div>

        <div className="login-right">
          <div className="abstract-bg">
            <div className="gradient-sphere primary" style={{ background: 'linear-gradient(135deg, #10b981, #0ea5e9)', animationDelay: '-5s' }}></div>
            <div className="gradient-sphere secondary" style={{ background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)', animationDelay: '-10s' }}></div>
          </div>
        </div>
      </div>
    </div>
  )
}
