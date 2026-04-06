import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const userId = localStorage.getItem('userId')
  const token = localStorage.getItem('token')
  
  if (userId) {
    config.headers['X-User-ID'] = userId
  }
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }
  
  return config
})

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data)
}

// Users API
export const usersAPI = {
  getCurrentUser: () => api.get('/users/me'),
  getUserById: (id) => api.get(`/users/${id}`),
  getAllUsers: (skip = 0, limit = 100) => 
    api.get('/users', { params: { skip, limit } }),
  createUser: (data) => api.post('/users', data),
  updateUser: (id, data) => api.put(`/users/${id}`, data),
  deleteUser: (id) => api.delete(`/users/${id}`)
}

// Roles API
export const rolesAPI = {
  createRole: (data) => api.post('/roles', data),
  getRoleById: (id) => api.get(`/roles/${id}`),
  getAllRoles: (skip = 0, limit = 100) => 
    api.get('/roles', { params: { skip, limit } }),
  updateRole: (id, data) => api.put(`/roles/${id}`, data),
  deleteRole: (id) => api.delete(`/roles/${id}`)
}

// Financial Records API
export const recordsAPI = {
  createRecord: (data) => api.post('/records', data),
  getRecordById: (id) => api.get(`/records/${id}`),
  getAllRecords: (params = {}) => 
    api.get('/records', { params }),
  updateRecord: (id, data) => api.put(`/records/${id}`, data),
  deleteRecord: (id) => api.delete(`/records/${id}`),
  exportCSV: () => api.get('/records/export', { responseType: 'blob' }),
  getRecords: (skip = 0, limit = 100, filters = {}) => {
    const params = { skip, limit, ...filters }
    return api.get('/records', { params })
  }
}

// Dashboard API
export const dashboardAPI = {
  getSummary: () => api.get('/dashboard/summary')
}

export default api
