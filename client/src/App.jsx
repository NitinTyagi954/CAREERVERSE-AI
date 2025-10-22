import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import UploadResume from './pages/UploadResume'
import Jobs from './pages/Jobs'
import FreelancerHub from './pages/FreelancerHub'
import Profile from './pages/Profile'

function App() {
  return (
    <AuthProvider>
        <div className="min-h-screen">
          <Navbar />
          <Routes>
            {/* Public routes - Landing page is full-width, no container */}
            <Route path="/" element={<Landing />} />
            {/* Backward-compat/case-insensitive redirects */}
            <Route path="/Jobs" element={<Navigate to="/jobs" replace />} />
            <Route path="/Job" element={<Navigate to="/jobs" replace />} />
            <Route path="/FreelancerHub" element={<Navigate to="/freelancer" replace />} />
            <Route path="/FreelencerHub" element={<Navigate to="/freelancer" replace />} />
            <Route path="/freelancerhub" element={<Navigate to="/freelancer" replace />} />
            <Route path="/Freelancer" element={<Navigate to="/freelancer" replace />} />
            <Route path="/Upload-Resume" element={<Navigate to="/upload" replace />} />
            
            {/* Other routes with container wrapper */}
            <Route path="/login" element={
              <main className="container mx-auto px-4 py-8">
                <Login />
              </main>
            } />
            <Route path="/register" element={
              <main className="container mx-auto px-4 py-8">
                <Register />
              </main>
            } />
            
            {/* All pages are now public - No authentication required */}
            <Route path="/dashboard" element={
              <main className="container mx-auto px-4 py-8">
                <Dashboard />
              </main>
            } />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/freelancer" element={
              <main className="container mx-auto px-4 py-8">
                <FreelancerHub />
              </main>
            } />
            <Route path="/upload" element={
              <main className="container mx-auto px-4 py-8">
                <UploadResume />
              </main>
            } />
            <Route path="/profile" element={
              <main className="container mx-auto px-4 py-8">
                <Profile />
              </main>
            } />
            
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
    </AuthProvider>
  )
}

export default App 
