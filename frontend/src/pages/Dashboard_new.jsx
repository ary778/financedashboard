import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { dashboardAPI, recordsAPI } from '../api'
import Sidebar from '../components/Sidebar'
import Chart from '../components/Chart'
import TransactionModal from '../components/TransactionModal'
import { TrendingUp, TrendingDown, DollarSign, Download, Plus } from 'lucide-react'

const StatCard = ({ title, amount, change, icon: Icon, color = 'blue' }) => {
  const colors = {
    blue: 'bg-primary-50 text-primary-600',
    green: 'bg-success-50 text-success-600',
    red: 'bg-danger-50 text-danger-600'
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            ${parseFloat(amount).toLocaleString('en-US', { maximumFractionDigits: 2 })}
          </p>
        </div>
        <div className={`p-3 rounded-lg ${colors[color]}`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  )
}

const TransactionItem = ({ record }) => (
  <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0">
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-lg ${record.type === 'income' ? 'bg-success-50' : 'bg-danger-50'}`}>
        {record.type === 'income' ? (
          <TrendingUp className="text-success-600" size={20} />
        ) : (
          <TrendingDown className="text-danger-600" size={20} />
        )}
      </div>
      <div>
        <p className="font-medium text-gray-900">{record.description || record.category}</p>
        <p className="text-xs text-gray-500">{new Date(record.date).toLocaleDateString()}</p>
      </div>
    </div>
    <p className={`font-semibold ${record.type === 'income' ? 'text-success-600' : 'text-danger-600'}`}>
      {record.type === 'income' ? '+' : '-'}${parseFloat(record.amount).toLocaleString('en-US', { maximumFractionDigits: 2 })}
    </p>
  </div>
)

export default function Dashboard() {
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const navigate = useNavigate()

  const userRole = parseInt(localStorage.getItem('userRole') || '1', 10)
  const userName = localStorage.getItem('userName') || 'Guest'

  useEffect(() => {
    fetchSummary()
  }, [])

  const fetchSummary = async () => {
    try {
      setLoading(true)
      const response = await dashboardAPI.getSummary()
      setSummary(response.data)
      setError('')
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Failed to load dashboard'
      setError(errorMsg)
      if (err.response?.status === 401) navigate('/login')
    } finally {
      setLoading(false)
    }
  }

  const handleExport = async () => {
    try {
      const response = await recordsAPI.exportCSV()
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'text/csv' }))
      const a = document.createElement('a')
      a.href = url
      a.download = `financial_records_${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      alert('Failed to export data')
    }
  }

  if (loading) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin mb-4">
              <div className="w-12 h-12 border-4 border-gray-200 border-t-primary-600 rounded-full"></div>
            </div>
            <p className="text-gray-600">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <p className="text-danger-600 mb-4">{error}</p>
            <button onClick={fetchSummary} className="btn-primary">
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!summary) return null

  const { net_balance, total_income, total_expense, category_breakdown, recent_records } = summary
  const categoryData = Array.isArray(category_breakdown)
    ? category_breakdown.map((item, i) => ({
        name: item.category || 'Unknown',
        value: parseFloat(item.total_amount || 0)
      }))
    : []

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome back, {userName}!</h1>
            <p className="text-gray-600 mt-1">Here's your financial overview</p>
          </div>
          <div className="flex gap-3">
            {userRole === 3 && (
              <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
                <Plus size={20} /> Add Transaction
              </button>
            )}
            <button onClick={handleExport} className="btn-secondary flex items-center gap-2">
              <Download size={20} /> Export
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Net Balance"
            amount={net_balance}
            icon={DollarSign}
            color="blue"
          />
          <StatCard
            title="Total Income"
            amount={total_income}
            icon={TrendingUp}
            color="green"
          />
          <StatCard
            title="Total Expense"
            amount={total_expense}
            icon={TrendingDown}
            color="red"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Category Chart */}
          <div className="lg:col-span-1 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-6">Category Breakdown</h3>
            {categoryData.length > 0 ? (
              <Chart type="pie" data={categoryData} />
            ) : (
              <div className="text-center py-8 text-gray-500">No category data</div>
            )}
          </div>

          {/* Recent Transactions */}
          <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-6">Recent Transactions</h3>
            <div className="space-y-0">
              {recent_records && recent_records.length > 0 ? (
                recent_records.map(record => (
                  <TransactionItem key={record.id} record={record} />
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">No recent transactions</div>
              )}
            </div>
          </div>
        </div>

        {/* Add Transaction Modal */}
        {showModal && (
          <TransactionModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            onSuccess={() => {
              setShowModal(false)
              fetchSummary()
            }}
          />
        )}
      </main>
    </div>
  )
}
