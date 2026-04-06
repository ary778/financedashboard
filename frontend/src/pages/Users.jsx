import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { usersAPI } from '../api'
import Sidebar from '../components/Sidebar'
import './Users.css'

export default function Users() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role_id: '1',
    is_active: '1'
  })
  
  const navigate = useNavigate()
  const userRole = localStorage.getItem('userRole')

  useEffect(() => {
    if (userRole !== '3') {
      navigate('/dashboard')
    } else {
      fetchUsers()
    }
  }, [userRole, navigate])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await usersAPI.getAllUsers()
      setUsers(response.data || [])
      setError('')
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleEdit = (user) => {
    setFormData({
      name: user.name,
      email: user.email,
      password: '', // Leave blank when editing
      role_id: user.role_id.toString(),
      is_active: user.is_active.toString()
    })
    setEditingId(user.id)
    setShowForm(true)
    setError('')
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingId(null)
    setFormData({
      name: '',
      email: '',
      password: '',
      role_id: '1',
      is_active: '1'
    })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingId) {
        // Update user
        const updateData = {
          name: formData.name,
          email: formData.email,
          role_id: parseInt(formData.role_id),
          is_active: parseInt(formData.is_active)
        }
        await usersAPI.updateUser(editingId, updateData)
      } else {
        // Create user
        if (formData.password.length < 6) {
          setError('Password must be at least 6 characters')
          return
        }
        await usersAPI.createUser({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role_id: parseInt(formData.role_id)
        })
      }
      
      handleCancel()
      fetchUsers()
    } catch (err) {
      const errorDetail = err.response?.data?.detail;
      const errorMessage = Array.isArray(errorDetail) 
        ? errorDetail[0].msg 
        : (errorDetail || 'Failed to save user');
      setError(errorMessage);
    }
  }

  const handleDelete = async (userId) => {
    if (confirm('Are you sure you want to deactivate this user?')) {
      try {
        await usersAPI.deleteUser(userId)
        fetchUsers()
      } catch (err) {
        const errorDetail = err.response?.data?.detail;
        const errorMessage = Array.isArray(errorDetail) 
          ? errorDetail[0].msg 
          : (errorDetail || 'Failed to deactivate user');
        setError(errorMessage);
      }
    }
  }

  const getRoleName = (roleId) => {
    const roles = { 1: 'Viewer', 2: 'Analyst', 3: 'Admin' }
    return roles[roleId] || 'Unknown'
  }

  return (
    <div className="dashboard-container">
      <Sidebar />
      
      <div className="dashboard-content">
        <div className="dashboard-header animate-slideInUp">
          <div>
            <h1>User Management</h1>
            <p className="subtitle">Mange system users and roles</p>
          </div>
          <button 
            className={`btn ${showForm ? 'btn-secondary' : 'btn-primary'}`}
            onClick={() => showForm ? handleCancel() : setShowForm(true)}
          >
            {showForm ? 'Cancel' : 'Add User'}
          </button>
        </div>

        {error && (
          <div className="error-message animate-slideInUp" style={{ backgroundColor: 'var(--status-danger-bg)', color: 'var(--status-danger)', padding: '1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        {showForm && (
          <div className="card form-card animate-slideInUp" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>{editingId ? 'Edit User' : 'Create New User'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  required
                />
              </div>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  required
                />
              </div>
              {!editingId && (
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label>Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleFormChange}
                    required={!editingId}
                  />
                </div>
              )}
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label>Role</label>
                <select name="role_id" value={formData.role_id} onChange={handleFormChange}>
                  <option value="1">Viewer</option>
                  <option value="2">Analyst</option>
                  <option value="3">Admin</option>
                </select>
              </div>
              {editingId && (
                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                  <label>Status</label>
                  <select name="is_active" value={formData.is_active} onChange={handleFormChange}>
                    <option value="1">Active</option>
                    <option value="0">Inactive</option>
                  </select>
                </div>
              )}
              <div>
                <button type="submit" className="btn btn-primary">{editingId ? 'Update User' : 'Create User'}</button>
              </div>
            </form>
          </div>
        )}

        <div className="card toolbar-card animate-slideInUp" style={{ animationDelay: '0.1s' }}>
          <div className="records-table">
            {loading ? (
              <div className="table-loading" style={{ padding: '2rem', textAlign: 'center' }}>
                Fetching users...
              </div>
            ) : users.length > 0 ? (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)', textAlign: 'left' }}>
                    <th style={{ padding: '1rem' }}>Name</th>
                    <th style={{ padding: '1rem' }}>Email</th>
                    <th style={{ padding: '1rem' }}>Role</th>
                    <th style={{ padding: '1rem' }}>Status</th>
                    <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '1rem' }}>{user.name}</td>
                      <td style={{ padding: '1rem' }}>{user.email}</td>
                      <td style={{ padding: '1rem' }}>
                        <span className={`badge ${user.role_id === 3 ? 'badge-danger' : user.role_id === 2 ? 'badge-warning' : 'badge-neutral'}`}>
                          {getRoleName(user.role_id)}
                        </span>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span className={`badge ${user.is_active ? 'badge-success' : 'badge-neutral'}`}>
                          {user.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'right', paddingRight: '2rem' }}>
                        <button
                          className="btn btn-sm btn-outline"
                          onClick={() => handleEdit(user)}
                          style={{ marginRight: '1rem' }}
                        >
                          Edit
                        </button>
                        {user.is_active === 1 && (
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDelete(user.id)}
                          >
                            Deactivate
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                No users found.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
