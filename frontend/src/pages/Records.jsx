import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { recordsAPI } from '../api'
import Sidebar from '../components/Sidebar'
import './Records.css'

export default function Records() {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState({
    record_type: '',
    category: '',
    start_date: '',
    end_date: ''
  })
  const navigate = useNavigate()
  const userRole = localStorage.getItem('userRole')
  const isAdmin = userRole === '3'

  useEffect(() => {
    if (userRole === '1') {
      navigate('/dashboard')
    } else {
      fetchRecords()
    }
  }, [filters, userRole, navigate])

  const fetchRecords = async () => {
    try {
      setLoading(true)
      const params = { skip: 0, limit: 100 }
      if (filters.record_type) params.record_type = filters.record_type
      if (filters.category) params.category = filters.category
      if (filters.start_date) params.start_date = filters.start_date
      if (filters.end_date) params.end_date = filters.end_date

      const response = await recordsAPI.getAllRecords(params)
      setRecords(response.data.data || [])
      setError('')
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load records')
      if (err.response?.status === 401) {
        navigate('/login')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleDelete = async (recordId) => {
    if (confirm('Are you sure you want to delete this record?')) {
      try {
        await recordsAPI.deleteRecord(recordId)
        fetchRecords()
      } catch (err) {
        setError(err.response?.data?.detail || 'Failed to delete record')
      }
    }
  }

  return (
    <div className="dashboard-container">
      <Sidebar />
      
      <div className="dashboard-content">
        <div className="dashboard-header animate-slideInUp">
          <div>
            <h1>Financial Records</h1>
            <p className="subtitle">Manage and track your transactions</p>
          </div>
        </div>

        {error && (
          <div className="error-message animate-slideInUp">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            {error}
          </div>
        )}



        <div className="card toolbar-card animate-slideInUp" style={{ animationDelay: '0.1s' }}>
          <div className="filter-section">
            <div className="filter-row">
              <div className="filter-group">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                <input
                  type="text"
                  placeholder="Search categories..."
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                />
              </div>
              <select name="record_type" value={filters.record_type} onChange={handleFilterChange}>
                <option value="">All Types</option>
                <option value="income">Income Only</option>
                <option value="expense">Expense Only</option>
              </select>
              <input type="date" name="start_date" value={filters.start_date} onChange={handleFilterChange} title="Start Date" />
              <input type="date" name="end_date" value={filters.end_date} onChange={handleFilterChange} title="End Date" />
            </div>
          </div>

          <div className="records-table">
            {loading ? (
              <div className="table-loading">
                <div className="loading"></div>
                <span>Fetching records...</span>
              </div>
            ) : records.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Category</th>
                    <th>Type</th>
                    <th>Description</th>
                    <th className="text-right">Amount</th>
                    {isAdmin && <th className="text-right">Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {records.map(record => (
                    <tr key={record.id}>
                      <td className="cell-date">{record.date}</td>
                      <td>
                        <span className="badge badge-neutral">{record.category}</span>
                      </td>
                      <td>
                        <span className={`badge badge-${record.type === 'income' ? 'success' : 'warning'}`}>
                          {record.type.charAt(0).toUpperCase() + record.type.slice(1)}
                        </span>
                      </td>
                      <td className="cell-description" title={record.description}>
                        {record.description || <span className="text-muted">None</span>}
                      </td>
                      <td className={`text-right font-medium ${record.type === 'income' ? 'text-success' : 'text-main'}`}>
                        {record.type === 'income' ? '+' : '-'}${parseFloat(record.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      {isAdmin && (
                        <td className="text-right">
                          <button
                            className="btn-action btn-delete"
                            onClick={() => handleDelete(record.id)}
                            title="Delete Record"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="empty-state">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--border-strong)" strokeWidth="1"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
                <p>No records found matching your criteria</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
