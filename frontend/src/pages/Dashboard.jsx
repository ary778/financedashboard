import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardAPI, recordsAPI } from '../api';
import Sidebar from '../components/Sidebar';
import SummaryCard from '../components/SummaryCard';
import Chart from '../components/Chart';
import TransactionModal from '../components/TransactionModal';
import './Dashboard.css';

const TransactionItem = ({ record }) => (
  <li className="transaction-item">
    <div className="transaction-details">
      <div className={`transaction-icon ${record.type}`}>
        {record.type === 'income' ? '↓' : '↑'}
      </div>
      <div className="transaction-info">
        <h4>{record.description}</h4>
        <p>{new Date(record.date).toLocaleDateString()}</p>
      </div>
    </div>
    <div className={`transaction-amount ${record.type}`}>
      {record.type === 'income' ? '+' : '-'}${new Intl.NumberFormat('en-US').format(record.amount)}
    </div>
  </li>
);

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const userRole = parseInt(localStorage.getItem('userRole') || '1', 10); // Convert to number
  const userName = localStorage.getItem('userName') || 'Guest';
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      const response = await dashboardAPI.getSummary();
      setSummary(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching summary:', err);
      const errorMsg = err.response?.data?.detail || 'Failed to load dashboard data.';
      setError(errorMsg);
      if (err.response?.status === 401) navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const response = await recordsAPI.exportCSV();
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'text/csv' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = `financial_records_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export failed:', err);
      alert('Failed to export data. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <Sidebar />
        <div className="dashboard-content" style={{ textAlign: 'center', paddingTop: '5rem' }}>
          <div className="loading"></div>
          <p>Loading your financial dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <Sidebar />
        <div className="dashboard-content">
          <div className="error-state">
            <h3>Error Loading Dashboard</h3>
            <p>{error}</p>
            <button onClick={fetchSummary} className="btn btn-primary">Retry</button>
          </div>
        </div>
      </div>
    );
  }

  if (!summary) return null;

  const { net_balance, total_income, total_expense, category_breakdown, recent_records } = summary;

  // Ensure values are numbers before passing to components
  const numeric_net_balance = parseFloat(net_balance) || 0;
  const numeric_total_income = parseFloat(total_income) || 0;
  const numeric_total_expense = parseFloat(total_expense) || 0;

  // Transform category breakdown data for the chart
  const chartColors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#6366f1'];
  const formattedChartData = Array.isArray(category_breakdown) 
    ? category_breakdown.map((item, index) => ({
        name: item.category || item.name || 'Unknown',
        value: parseFloat(item.total_amount || item.amount || item.value || 0),
        color: item.color || chartColors[index % chartColors.length]
      }))
    : [];

  return (
    <div className="dashboard-container">
      <Sidebar />
      <main className="dashboard-content">
        <header className="dashboard-header">
          <div>
            <h1>Welcome back, {userName}!</h1>
            <p className="subtitle">Here's your financial overview for today.</p>
          </div>
          <div className="header-actions">
            {userRole === 3 && (
              <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Add Transaction</button>
            )}
            <button className="btn" onClick={handleExport}>Export CSV</button>
          </div>
        </header>

        <div className="summary-grid">
          <SummaryCard title="Net Balance" amount={numeric_net_balance} subtext="Available funds" color="blue" icon="balance" />
          <SummaryCard title="Total Income" amount={numeric_total_income} subtext="This month" color="green" icon="income" />
          <SummaryCard title="Total Expense" amount={numeric_total_expense} subtext="This month" color="orange" icon="expense" />
        </div>

        <div className="charts-grid">
          <div className="card chart-card">
            <div className="card-header-view">
              <h3>Category Breakdown</h3>
            </div>
            <div className="chart-wrapper">
              {formattedChartData && formattedChartData.length > 0 ? (
                <Chart type="pie" data={formattedChartData} />
              ) : (
                <div className="empty-state">No category data available</div>
              )}
            </div>
          </div>
          <div className="card recent-transactions-card">
            <div className="card-header-view">
              <h3>Recent Transactions</h3>
            </div>
            <div className="card-body">
              <ul className="transaction-list">
                {recent_records.map(record => <TransactionItem key={record.id} record={record} />)}
              </ul>
            </div>
          </div>
        </div>

        {showModal && (
          <TransactionModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            onSuccess={() => {
              setShowModal(false);
              fetchSummary();
            }}
          />
        )}
      </main>
    </div>
  );
}
