import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import './Profile.css'

export default function Profile({ onLogout }) {
  const userName = localStorage.getItem('userName') || 'User'
  const userEmail = localStorage.getItem('userEmail') || 'user@example.com'
  const userRole = localStorage.getItem('userRole') || '1'
  const navigate = useNavigate()

  const getRoleName = (roleId) => {
    const roles = { '1': 'Viewer', '2': 'Analyst', '3': 'Admin' }
    return roles[roleId] || 'User'
  }

  const getRoleDescription = (roleId) => {
    const descriptions = {
      '1': 'Read-only access to financial data',
      '2': 'View and analyze financial records only',
      '3': 'Full system control including user management configurations'
    }
    return descriptions[roleId] || ''
  }

  const handleLogout = () => {
    if (confirm('Are you sure you want to sign out?')) {
      onLogout()
      navigate('/login')
    }
  }

  const YesIcon = () => <svg className="perm-icon perm-yes" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
  const NoIcon = () => <svg className="perm-icon perm-no" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>

  return (
    <div className="dashboard-container">
      <Sidebar />
      
      <div className="dashboard-content">
        <div className="dashboard-header animate-slideInUp">
          <div>
            <h1>Profile Settings</h1>
            <p className="subtitle">Manage device profile and settings</p>
          </div>
        </div>

        <div className="profile-container animate-slideInUp">
          <div className="card profile-card-full">
            <div className="profile-top-section">
              <div className="profile-avatar-xl">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="profile-main-info">
                <h2>{userName}</h2>
                <p className="profile-email-large">{userEmail}</p>
                <div className="role-badge-container">
                  <span className="badge badge-success role-badge-lg">
                    {getRoleName(userRole)}
                  </span>
                  <span className="role-summary">{getRoleDescription(userRole)}</span>
                </div>
              </div>
            </div>

            <div className="profile-content-sections">
              <div className="profile-block">
                <div className="block-header">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--brand-primary)" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                  <h3>Capabilities Checklist</h3>
                </div>
                <div className="capabilities-grid-refined">
                  {userRole === '1' && (
                    <>
                      <div className="cap-pill cap-yes"><YesIcon /> Dashboard View</div>
                      <div className="cap-pill cap-yes"><YesIcon /> View Records</div>
                      <div className="cap-pill cap-no"><NoIcon /> Create Records</div>
                      <div className="cap-pill cap-no"><NoIcon /> Edit Data</div>
                      <div className="cap-pill cap-no"><NoIcon /> User Management</div>
                    </>
                  )}
                  {userRole === '2' && (
                    <>
                      <div className="cap-pill cap-yes"><YesIcon /> Dashboard View</div>
                      <div className="cap-pill cap-yes"><YesIcon /> View Records</div>
                      <div className="cap-pill cap-no"><NoIcon /> Create Records</div>
                      <div className="cap-pill cap-no"><NoIcon /> Edit Owned Data</div>
                      <div className="cap-pill cap-yes"><YesIcon /> Data Export</div>
                    </>
                  )}
                  {userRole === '3' && (
                    <>
                      <div className="cap-pill cap-yes"><YesIcon /> Full Oversight</div>
                      <div className="cap-pill cap-yes"><YesIcon /> Create Records</div>
                      <div className="cap-pill cap-yes"><YesIcon /> Universal Edit</div>
                      <div className="cap-pill cap-yes"><YesIcon /> Manage Users</div>
                      <div className="cap-pill cap-yes"><YesIcon /> System Config</div>
                    </>
                  )}
                </div>
              </div>

              <div className="profile-block">
                <div className="block-header">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--brand-primary)" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="22" y1="12" x2="18" y2="12"></line><line x1="6" y1="12" x2="2" y2="12"></line><line x1="12" y1="6" x2="12" y2="2"></line><line x1="12" y1="22" x2="12" y2="18"></line></svg>
                  <h3>System Integrity</h3>
                </div>
                <div className="system-status-grid">
                  <div className="sys-item">
                    <span className="sys-label">App Core</span>
                    <span className="sys-value">FastAPI 0.110+</span>
                  </div>
                  <div className="sys-item">
                    <span className="sys-label">Database</span>
                    <span className="sys-value">PostgreSQL</span>
                  </div>
                  <div className="sys-item">
                    <span className="sys-label">Security</span>
                    <span className="sys-value">JWT / Argon2</span>
                  </div>
                  <div className="sys-item">
                    <span className="sys-label">Uptime</span>
                    <span className="sys-value">99.99%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
