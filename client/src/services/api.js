import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Only redirect if we're not on a public page
      const currentPath = window.location.pathname
      const publicPaths = ['/', '/login', '/register', '/jobs', '/freelancer', '/dashboard']
      
      if (!publicPaths.includes(currentPath)) {
        localStorage.removeItem('token')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (name, email, password) => api.post('/auth/register', { name, email, password }),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
}

// Resume API
export const resumeAPI = {
  upload: (formData) => api.post('/resume/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getResumes: () => api.get('/resume'),
  getResume: (id) => api.get(`/resume/${id}`),
  deleteResume: (id) => api.delete(`/resume/${id}`),
}

// Job API
export const jobAPI = {
  getJobs: (params = {}) => api.get('/jobs', { params }),
  getJob: (id) => api.get(`/jobs/${id}`),
  getGigs: (params = {}) => api.get('/gigs', { params }),
  getGig: (id) => api.get(`/gigs/${id}`),
}

// Match API
export const matchAPI = {
  getMatches: (resumeId) => api.get(`/match/${resumeId}`),
  getRecommendations: (resumeId) => api.get(`/match/recommendations/${resumeId}`),
}

// Application Draft API
export const applicationAPI = {
  createDraft: (data) => api.post('/applications/draft', data),
  getDrafts: () => api.get('/applications/draft'),
  updateDraft: (id, data) => api.put(`/applications/draft/${id}`, data),
  deleteDraft: (id) => api.delete(`/applications/draft/${id}`),
}

export default api

