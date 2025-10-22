import React, { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { authAPI } from '../services/api'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const navigate = useNavigate()

  // Skip authentication check - all features are public for now
  useEffect(() => {
    // Set loading to false immediately without checking auth
    setLoading(false)
    // Authentication disabled - all features accessible without login
  }, [])

  const login = async (email, password) => {
    try {
      const response = await authAPI.login(email, password)
      
      // Handle response - could be response.data.data or response.data depending on structure
      const responseData = response.data?.data || response.data
      const newToken = responseData?.token
      const userData = responseData?.user
      
      if (!newToken || !userData) {
        throw new Error('Invalid response structure: missing token or user data')
      }
      
      localStorage.setItem('token', newToken)
      setToken(newToken)
      setUser(userData)
      
      console.log('Login successful:', userData) // Debug log
      return { success: true }
    } catch (error) {
      console.error('Login error:', error) // Debug log
      const errorMessage = error.response?.data?.message || error.message || 'Login failed'
      return { 
        success: false, 
        error: errorMessage
      }
    }
  }

  const register = async (name, email, password) => {
    try {
      const response = await authAPI.register(name, email, password)
      
      // Handle response - could be response.data.data or response.data depending on structure
      const responseData = response.data?.data || response.data
      const newToken = responseData?.token
      const userData = responseData?.user
      
      if (!newToken || !userData) {
        throw new Error('Invalid response structure: missing token or user data')
      }
      
      localStorage.setItem('token', newToken)
      setToken(newToken)
      setUser(userData)
      
      console.log('Registration successful:', userData) // Debug log
      return { success: true }
    } catch (error) {
      console.error('Registration error:', error) // Debug log
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed'
      return { 
        success: false, 
        error: errorMessage
      }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
  }

  const updateProfile = async (profileData) => {
    try {
      const response = await authAPI.updateProfile(profileData)
      
      // Handle response - backend returns { success, message, data: user }
      const userData = response.data?.data || response.data
      
      if (!userData || !userData._id) {
        throw new Error('Invalid response structure: missing user data')
      }
      
      setUser(userData)
      return { success: true }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Profile update failed'
      return { 
        success: false, 
        error: errorMessage
      }
    }
  }

  // Require login for protected actions
  // Shows toast and redirects to login if user is not authenticated
  const requireLogin = (message = 'Please log in to continue') => {
    if (isAuthenticated) {
      return true // User is already logged in
    }
    
    toast.error(message)
    navigate('/login')
    return false
  }

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateProfile,
    requireLogin,
    isAuthenticated: !!user
  }

  console.log('AuthContext value:', { user, isAuthenticated: !!user, loading }) // Debug log

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
