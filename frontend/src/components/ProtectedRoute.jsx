import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ isAuthenticated, allowedRoles, children }) {
  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }
  
  if (allowedRoles) {
    const userRole = localStorage.getItem('userRole')
    if (!allowedRoles.includes(userRole)) {
      return <Navigate to="/dashboard" />
    }
  }

  return children
}
