import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Menu, X, BarChart3, Files, Users, LogOut, Settings, Home } from 'lucide-react'

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const userRole = parseInt(localStorage.getItem('userRole') || '1', 10)
  const userName = localStorage.getItem('userName') || 'Guest'

  const getRoleLabel = () => {
    const roles = { 1: 'Viewer', 2: 'Analyst', 3: 'Admin' }
    return roles[userRole] || 'User'
  }

  const menuItems = [
    { label: 'Dashboard', icon: Home, path: '/dashboard', show: true },
    { label: 'Records', icon: Files, path: '/records', show: userRole >= 2 },
    { label: 'Users', icon: Users, path: '/users', show: userRole === 3 },
  ]

  const isActive = (path) => location.pathname === path

  const handleLogout = () => {
    localStorage.removeItem('userId')
    localStorage.removeItem('userEmail')
    localStorage.removeItem('userName')
    localStorage.removeItem('userRole')
    navigate('/login')
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 bg-primary-600 text-white rounded-lg"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-primary-900 to-primary-800 text-white transition-transform duration-300 z-40 lg:relative lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6">
          {/* Brand */}
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-primary-400 rounded-lg">
              <BarChart3 size={28} />
            </div>
            <h1 className="text-xl font-bold">FinanceHub</h1>
          </div>

          {/* User Profile */}
          <div className="bg-primary-700/50 rounded-lg p-4 mb-8 border border-primary-700">
            <p className="text-xs text-primary-200 uppercase tracking-wide">Logged in as</p>
            <h3 className="font-semibold text-white mt-1">{userName}</h3>
            <span className="inline-block mt-2 px-2 py-1 bg-primary-600 rounded text-xs font-medium">
              {getRoleLabel()}
            </span>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            {menuItems.map(
              (item) =>
                item.show && (
                  <button
                    key={item.path}
                    onClick={() => {
                      navigate(item.path)
                      setIsOpen(false)
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      isActive(item.path)
                        ? 'bg-primary-600 text-white'
                        : 'text-primary-100 hover:bg-primary-700/50'
                    }`}
                  >
                    <item.icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </button>
                )
            )}
          </nav>

          {/* Settings */}
          <div className="fixed bottom-6 left-6 right-6 space-y-2">
            <button
              onClick={() => navigate('/profile')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-primary-100 hover:bg-primary-700/50 transition-all"
            >
              <Settings size={20} />
              <span className="font-medium">Profile</span>
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-primary-100 hover:bg-danger-600/90 transition-all"
            >
              <LogOut size={20} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
