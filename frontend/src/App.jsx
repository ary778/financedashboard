import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Records from './pages/Records'
import Profile from './pages/Profile'
import Users from './pages/Users'
import ProtectedRoute from './components/ProtectedRoute'
import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    const userId = localStorage.getItem('userId')
    if (userId) {
      setIsAuthenticated(true)
      // Could fetch user details here
    }
    setLoading(false)
  }, [])

  const handleLogin = (user) => {
    localStorage.setItem('userId', user.id)
    localStorage.setItem('userEmail', user.email)
    localStorage.setItem('userName', user.name)
    setIsAuthenticated(true)
    setCurrentUser(user)
  }

  const handleLogout = () => {
    localStorage.removeItem('userId')
    localStorage.removeItem('userEmail')
    localStorage.removeItem('userName')
    setIsAuthenticated(false)
    setCurrentUser(null)
  }

  if (loading) {
    return <div className="loading-screen">Loading...</div>
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/records"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} allowedRoles={['2', '3']}>
              <Records />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Profile currentUser={currentUser} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} allowedRoles={['3']}>
              <Users />
            </ProtectedRoute>
          }
        />
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  )
}

export default App
