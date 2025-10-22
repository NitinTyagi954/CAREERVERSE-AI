# Frontend Issues - Ready-to-Use Fixes

**Date**: October 22, 2025

---

## 🔴 CRITICAL FIX #1: Dashboard Resume Fetch

### Replace in `Dashboard.jsx`:

```jsx
// OLD CODE - REMOVE THIS
useEffect(() => {
  const fetchResumes = async () => {
    try {
      const response = await resumeAPI.getResumes()
      console.log('Resumes fetched:', response.data)
      setResumes(response.data.resumes || [])
      if (response.data.resumes && response.data.resumes.length > 0) {
        setSelectedResume(response.data.resumes[0])
      }
    } catch (error) {
      console.error('Failed to fetch resumes:', error)
      toast.error('Failed to load resumes')
    }
  }
  fetchResumes()
}, [])

// NEW CODE - USE THIS
const [resumesLoading, setResumesLoading] = useState(false)
const [resumesError, setResumesError] = useState(null)

useEffect(() => {
  const fetchResumes = async () => {
    setResumesLoading(true)
    setResumesError(null)
    try {
      const response = await resumeAPI.getResumes()
      
      // Handle both possible response structures
      const resumesList = response.data?.data?.resumes || 
                         response.data?.resumes || 
                         []
      
      if (!Array.isArray(resumesList)) {
        throw new Error('Invalid response format')
      }
      
      setResumes(resumesList)
      
      if (resumesList.length > 0) {
        setSelectedResume(resumesList[0])
      } else {
        setResumesError('No resumes found. Please upload one.')
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || 
                      error.message || 
                      'Failed to load resumes'
      setResumesError(errorMsg)
      toast.error(errorMsg)
      console.error('Resume fetch error:', error)
    } finally {
      setResumesLoading(false)
    }
  }
  
  fetchResumes()
}, [])
```

### Add Error UI in Dashboard:

```jsx
{resumesLoading && (
  <div className="card bg-blue-50 border-blue-200 mb-8">
    <div className="flex items-center space-x-3">
      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
      <span className="text-blue-700">Loading your resumes...</span>
    </div>
  </div>
)}

{resumesError && (
  <div className="card bg-red-50 border-red-200 mb-8">
    <div className="flex items-start space-x-3">
      <AlertCircle className="h-6 w-6 text-red-600 mt-1" />
      <div className="flex-1">
        <h4 className="text-md font-semibold text-red-900">Error Loading Resumes</h4>
        <p className="text-red-700 mt-1">{resumesError}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-3 btn-secondary text-sm"
        >
          Retry
        </button>
      </div>
    </div>
  </div>
)}
```

---

## 🔴 CRITICAL FIX #2: AuthContext Response Handling

### Replace in `AuthContext.jsx` - Login:

```jsx
// OLD CODE
const login = async (email, password) => {
  try {
    const response = await authAPI.login(email, password)
    const { token: newToken, user: userData } = response.data.data
    
    localStorage.setItem('token', newToken)
    setToken(newToken)
    setUser(userData)
    
    console.log('Login successful:', userData)
    return { success: true }
  } catch (error) {
    console.error('Login error:', error)
    return { 
      success: false, 
      error: error.response?.data?.message || 'Login failed' 
    }
  }
}

// NEW CODE
const login = async (email, password) => {
  try {
    const response = await authAPI.login(email, password)
    
    // Handle both possible response structures from backend
    const responseData = response.data?.data || response.data
    const newToken = responseData?.token
    const userData = responseData?.user
    
    // Validate we have required data
    if (!newToken) {
      throw new Error('No authentication token received')
    }
    
    if (!userData) {
      throw new Error('No user data received')
    }
    
    // Store token and update state
    localStorage.setItem('token', newToken)
    setToken(newToken)
    setUser(userData)
    
    console.log('Login successful')
    return { success: true }
  } catch (error) {
    const errorMessage = error.response?.data?.message || 
                        error.message || 
                        'Login failed. Please try again.'
    console.error('Login error:', errorMessage)
    return { success: false, error: errorMessage }
  }
}

// Same fix for register function
const register = async (name, email, password) => {
  try {
    const response = await authAPI.register(name, email, password)
    
    // Handle both possible response structures
    const responseData = response.data?.data || response.data
    const newToken = responseData?.token
    const userData = responseData?.user
    
    if (!newToken || !userData) {
      throw new Error('Invalid response from server')
    }
    
    localStorage.setItem('token', newToken)
    setToken(newToken)
    setUser(userData)
    
    console.log('Registration successful')
    return { success: true }
  } catch (error) {
    const errorMessage = error.response?.data?.message || 
                        error.message || 
                        'Registration failed. Please try again.'
    console.error('Registration error:', errorMessage)
    return { success: false, error: errorMessage }
  }
}
```

---

## 🔴 CRITICAL FIX #3: Pagination Implementation

### Add to `JobContext.jsx`:

```jsx
import React, { createContext, useContext, useState } from 'react'

export const JobProvider = ({ children }) => {
  const [jobs, setJobs] = useState([])
  const [gigs, setGigs] = useState([])
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(false)
  
  // ADD THESE PAGINATION STATES
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalJobs: 0,
    hasNext: false,
    hasPrev: false
  })
  
  const [gigPagination, setGigPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalGigs: 0,
    hasNext: false,
    hasPrev: false
  })

  // UPDATE fetchJobs
  const fetchJobs = async (searchParams = {}) => {
    setLoading(true)
    try {
      const response = await jobAPI.getJobs({
        ...searchParams,
        page: searchParams.page || pagination.currentPage,
        limit: 20
      })
      
      // Handle response data structure
      const responseData = response.data?.data || response.data
      const jobsList = responseData?.jobs || []
      const paginationData = responseData?.pagination || {}
      
      setJobs(jobsList)
      setPagination({
        currentPage: paginationData.currentPage || 1,
        totalPages: paginationData.totalPages || 1,
        totalJobs: paginationData.totalJobs || 0,
        hasNext: paginationData.hasNext || false,
        hasPrev: paginationData.hasPrev || false
      })
      
      return { success: true, jobs: jobsList }
    } catch (error) {
      console.error('Failed to fetch jobs:', error)
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to fetch jobs' 
      }
    } finally {
      setLoading(false)
    }
  }

  // ADD PAGINATION CONTROLS
  const goToNextPage = () => {
    if (pagination.hasNext) {
      fetchJobs({ page: pagination.currentPage + 1 })
    }
  }

  const goToPreviousPage = () => {
    if (pagination.hasPrev) {
      fetchJobs({ page: pagination.currentPage - 1 })
    }
  }

  const goToPage = (page) => {
    if (page >= 1 && page <= pagination.totalPages) {
      fetchJobs({ page })
    }
  }

  // EXPORT NEW VALUES
  const value = {
    jobs,
    gigs,
    matches,
    loading,
    filters,
    pagination,        // NEW
    gigPagination,     // NEW
    fetchJobs,
    fetchGigs,
    getMatches,
    updateFilters,
    clearFilters,
    goToNextPage,      // NEW
    goToPreviousPage,  // NEW
    goToPage           // NEW
  }

  return (
    <JobContext.Provider value={value}>
      {children}
    </JobContext.Provider>
  )
}
```

### Add Pagination UI to `Jobs.jsx`:

```jsx
import { ChevronLeft, ChevronRight } from 'lucide-react'

// In Jobs component, add after job listings:
{/* Pagination Controls */}
{jobs.length > 0 && pagination.totalPages > 1 && (
  <div className="flex items-center justify-center gap-4 mt-8 py-6">
    <button
      onClick={() => goToPreviousPage()}
      disabled={!pagination.hasPrev || loading}
      className="flex items-center space-x-1 btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <ChevronLeft className="h-4 w-4" />
      <span>Previous</span>
    </button>
    
    <div className="flex items-center space-x-2">
      {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => {
        const pageNum = i + 1
        return (
          <button
            key={pageNum}
            onClick={() => goToPage(pageNum)}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              pageNum === pagination.currentPage
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {pageNum}
          </button>
        )
      })}
    </div>
    
    <button
      onClick={() => goToNextPage()}
      disabled={!pagination.hasNext || loading}
      className="flex items-center space-x-1 btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <span>Next</span>
      <ChevronRight className="h-4 w-4" />
    </button>
    
    <span className="text-sm text-gray-600">
      Page {pagination.currentPage} of {pagination.totalPages}
      ({pagination.totalJobs} total)
    </span>
  </div>
)}
```

---

## 🔴 CRITICAL FIX #4: Upload Resume Response

### Replace in `UploadResume.jsx`:

```jsx
// OLD CODE
try {
  const formData = new FormData()
  formData.append('resume', file)
  const response = await resumeAPI.upload(formData)
  
  if (response.data.success) {
    setParsedData(response.data.parsed)
    toast.success('Resume uploaded and parsed successfully!')
  } else {
    toast.error('Failed to parse resume')
  }
}

// NEW CODE
try {
  const formData = new FormData()
  formData.append('resume', file)
  const response = await resumeAPI.upload(formData)
  
  if (!response.data?.success) {
    throw new Error('Upload was not successful')
  }
  
  // Handle multiple possible response structures
  const resumeData = response.data?.data || response.data
  
  const parsed = {
    skills: Array.isArray(resumeData?.skills) ? resumeData.skills : [],
    experience: Array.isArray(resumeData?.experience) ? resumeData.experience : [],
    education: Array.isArray(resumeData?.education) ? resumeData.education : [],
    text: typeof resumeData?.text === 'string' ? resumeData.text : ''
  }
  
  // Validate we got some useful data
  if (!parsed.skills.length && !parsed.experience.length && !parsed.education.length) {
    toast.warning('Resume uploaded but no data could be extracted. Please check your resume format.')
  }
  
  setParsedData(parsed)
  toast.success('Resume uploaded and parsed successfully!')
} catch (error) {
  console.error('Upload error:', error)
  const errorMsg = error.response?.data?.message || 
                  error.message || 
                  'Failed to upload resume'
  toast.error(errorMsg)
  setUploadedFile(null)
}
```

---

## 🟡 HIGH PRIORITY FIX #1: Network Error Handling

### Create new file `utils/errorHandler.js`:

```javascript
export const handleApiError = (error, defaultMessage = 'An error occurred') => {
  // Network error (no response from server)
  if (!error.response) {
    if (error.request) {
      return {
        message: 'Network error. Please check your connection.',
        isNetworkError: true,
        canRetry: true
      }
    }
    return {
      message: 'An unexpected error occurred',
      isNetworkError: false,
      canRetry: false
    }
  }

  // Server error with response
  const status = error.response.status
  const message = error.response?.data?.message || defaultMessage

  if (status === 401) {
    return {
      message: 'Session expired. Please login again.',
      isAuth: true,
      canRetry: false
    }
  }

  if (status === 403) {
    return {
      message: 'You do not have permission to perform this action.',
      canRetry: false
    }
  }

  if (status === 404) {
    return {
      message: 'Resource not found.',
      canRetry: false
    }
  }

  if (status === 500) {
    return {
      message: 'Server error. Please try again later.',
      canRetry: true
    }
  }

  return {
    message: message || defaultMessage,
    canRetry: status >= 500
  }
}
```

---

## 🟡 HIGH PRIORITY FIX #2: Input Sanitization

### Create new file `utils/inputValidator.js`:

```javascript
export const sanitizeSearchInput = (input) => {
  if (!input) return ''
  
  return input
    .trim()  // Remove leading/trailing whitespace
    .slice(0, 200)  // Limit to 200 chars
    .replace(/[<>]/g, '')  // Remove HTML-like chars
    .replace(/["']/g, '')  // Remove quotes
}

export const validateSearchInput = (input) => {
  if (!input || !input.trim()) {
    return { valid: false, error: 'Please enter a search term' }
  }
  
  if (input.length < 2) {
    return { valid: false, error: 'Search term must be at least 2 characters' }
  }
  
  if (input.length > 200) {
    return { valid: false, error: 'Search term is too long' }
  }
  
  return { valid: true }
}

export const validateUrl = (url) => {
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}
```

---

## 🟡 HIGH PRIORITY FIX #3: Debounced Search

### Create new file `hooks/useDebounce.js`:

```javascript
import { useState, useEffect } from 'react'

export const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => clearTimeout(handler)
  }, [value, delay])

  return debouncedValue
}
```

### Use in `Jobs.jsx`:

```javascript
import { useDebounce } from '../hooks/useDebounce'
import { sanitizeSearchInput, validateSearchInput } from '../utils/inputValidator'

const Jobs = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  // Auto-search when debounced term changes
  useEffect(() => {
    if (debouncedSearchTerm) {
      const validation = validateSearchInput(debouncedSearchTerm)
      if (validation.valid) {
        handleSearch(debouncedSearchTerm)
      }
    }
  }, [debouncedSearchTerm])

  const handleSearch = (term) => {
    const sanitized = sanitizeSearchInput(term)
    const searchParams = {
      search: sanitized,
      ...localFilters
    }
    fetchJobs(searchParams)
  }

  return (
    // ... in JSX
    <input
      type="text"
      placeholder="Search jobs..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}  // No search here, wait for debounce
      className="input-field"
    />
  )
}
```

---

## 🟠 MEDIUM PRIORITY FIX: Better Error States

### Update all pages to have consistent error handling:

```jsx
const [error, setError] = useState(null)
const [retrying, setRetrying] = useState(false)

const handleRetry = async () => {
  setRetrying(true)
  try {
    await fetchData()
    setError(null)
  } catch (err) {
    setError(err.message)
  } finally {
    setRetrying(false)
  }
}

// In JSX:
{error && (
  <div className="card bg-red-50 border-red-200 mb-4">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <h4 className="font-semibold text-red-900">Error</h4>
        <p className="text-sm text-red-700 mt-1">{error}</p>
      </div>
      <button
        onClick={handleRetry}
        disabled={retrying}
        className="btn-secondary text-sm whitespace-nowrap"
      >
        {retrying ? 'Retrying...' : 'Try Again'}
      </button>
    </div>
  </div>
)}
```

---

## Summary of Changes

### Files to Create:
1. `src/utils/errorHandler.js`
2. `src/utils/inputValidator.js`
3. `src/hooks/useDebounce.js`

### Files to Update:
1. `src/contexts/AuthContext.jsx` - Fix response handling
2. `src/contexts/JobContext.jsx` - Add pagination
3. `src/pages/Dashboard.jsx` - Fix resume fetch + error handling
4. `src/pages/UploadResume.jsx` - Fix response handling
5. `src/pages/Jobs.jsx` - Add pagination UI + search debouncing
6. `src/pages/FreelancerHub.jsx` - Add pagination UI + search debouncing
7. `src/pages/Profile.jsx` - Add error handling
8. `src/components/Navbar.jsx` - Add error handling

### Implementation Order:
1. Create utility files
2. Fix critical issues (#1-#4)
3. Fix high priority issues (#5-#8)
4. Add medium priority improvements

---

**Ready to implement!**

