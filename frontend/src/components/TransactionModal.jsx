import React, { useState } from 'react'
import './TransactionModal.css'

export default function TransactionModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    amount: '',
    type: 'expense',
    category: '',
    date: new Date().toISOString().split('T')[0],
    description: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate form data
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setError('Please enter a valid amount')
      return
    }
    if (!formData.category || formData.category.trim() === '') {
      setError('Please enter a category')
      return
    }
    if (!formData.date) {
      setError('Please select a date')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Inline import to avoid circular dependencies if any
      const { recordsAPI } = await import('../api')
      const recordData = {
        amount: parseFloat(formData.amount),
        type: formData.type,
        category: formData.category.trim(),
        date: formData.date,
        description: formData.description.trim()
      }
      
      console.log('Submitting transaction:', recordData)
      const response = await recordsAPI.createRecord(recordData)
      console.log('Transaction created:', response)
      
      onSuccess()
      onClose()
    } catch (err) {
      console.error('Transaction creation error:', err)
      const errorMessage = err.response?.data?.detail || err.message || 'Failed to save transaction'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card animate-scaleIn" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>New Transaction</h3>
          <button className="close-btn" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {error && <div className="modal-error">{error}</div>}
          
          <div className="form-row">
            <div className="form-group">
              <label>Amount ($)</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                required
                autoFocus
              />
            </div>
            <div className="form-group">
              <label>Transaction Type</label>
              <select name="type" value={formData.type} onChange={handleChange}>
                <option value="income">Income (+)</option>
                <option value="expense">Expense (-)</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Category</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="e.g. Salary, Groceries, Rent"
              required
            />
          </div>

          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Description (Optional)</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="What was this for?"
              rows="2"
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Add Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
