import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authAPI } from '../api'
import { Eye, EyeOff, AlertCircle, TrendingUp } from 'lucide-react'

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('admin@test.com')
  const [password, setPassword] = useState('test123')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await authAPI.login({ email, password })
      localStorage.setItem('userId', response.data.id)
      localStorage.setItem('userEmail', email)
      localStorage.setItem('userName', response.data.name)
      localStorage.setItem('userRole', response.data.role_id)
      
      onLogin(response.data)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8 animate-slide-up">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-primary-600 rounded-xl text-white">
              <TrendingUp size={32} />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">FinanceHub</h1>
          <p className="text-gray-600">Manage your finances with intelligence</p>
        </div>

        {/* Card */}
        <div className="card bg-white shadow-xl rounded-2xl border-0 mb-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Alert */}
            {error && (
              <div className="bg-danger-50 border border-danger-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="text-danger-600 flex-shrink-0 mt-0.5" size={20} />
                <p className="text-danger-700 text-sm">{error}</p>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Email Address
              </label>
              <input
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-field"
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="input-field pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 font-semibold"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>

        {/* Demo Credentials */}
        <div className="bg-primary-50 rounded-xl p-4 border border-primary-200">
          <p className="text-xs font-semibold text-primary-900 mb-3">Demo Accounts</p>
          <div className="space-y-2 text-xs text-primary-800">
            <div>
              <p className="font-medium">Admin</p>
              <p className="text-primary-700">admin@test.com / test123</p>
            </div>
            <div>
              <p className="font-medium">Analyst</p>
              <p className="text-primary-700">analyst@test.com / test123</p>
            </div>
            <div>
              <p className="font-medium">Viewer</p>
              <p className="text-primary-700">viewer@test.com / test123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
