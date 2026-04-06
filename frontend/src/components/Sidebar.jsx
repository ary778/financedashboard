import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Sidebar.css';

const NavItem = ({ to, icon, label, active, collapsed, onClick }) => (
  <button
    onClick={() => onClick(to)}
    className={`nav-item ${active ? 'active' : ''}`}
  >
    {icon}
    {!collapsed && <span className="nav-label">{label}</span>}
  </button>
);

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const userName = localStorage.getItem('userName') || 'User';
  const userRole = localStorage.getItem('userRole');

  const getRoleName = (roleId) => {
    const roles = { '1': 'Viewer', '2': 'Analyst', '3': 'Admin' };
    return roles[roleId] || 'User';
  };

  const icons = {
    dashboard: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="nav-icon"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>,
    records: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="nav-icon"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>,
    profile: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="nav-icon"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>,
    users: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="nav-icon"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>,
    logout: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>,
    toggleOpen: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>,
    toggleClose: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
  };

  const menuItems = [
    { label: 'Dashboard', path: '/dashboard', icon: icons.dashboard, roles: ['1', '2', '3'] },
    { label: 'Records', path: '/records', icon: icons.records, roles: ['2', '3'] },
    { label: 'Users', path: '/users', icon: icons.users, roles: ['3'] },
    { label: 'Profile', path: '/profile', icon: icons.profile, roles: ['1', '2', '3'] }
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div>
        <div className="sidebar-header">
          <div className="logo-container">
            <div className="logo-mark">F</div>
            {!isCollapsed && <div className="logo-text">FinanceHub</div>}
          </div>
          <button className="toggle-btn" onClick={() => setIsCollapsed(!isCollapsed)}>
            {isCollapsed ? icons.toggleClose : icons.toggleOpen}
          </button>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) =>
            item.roles.includes(userRole) && (
              <NavItem
                key={item.path}
                to={item.path}
                icon={item.icon}
                label={item.label}
                active={location.pathname === item.path}
                collapsed={isCollapsed}
                onClick={(path) => navigate(path)}
              />
            )
          )}
        </nav>
      </div>

      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="avatar">{userName.charAt(0)}</div>
          {!isCollapsed && (
            <div className="user-info">
              <h4>{userName}</h4>
              <p>{getRoleName(userRole)}</p>
            </div>
          )}
        </div>
        <button onClick={handleLogout} className="logout-btn" title="Logout">
          {icons.logout}
          {!isCollapsed && <span className="nav-label">Logout</span>}
        </button>
      </div>
    </div>
  );
}
