import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { resumeAPI, matchAPI } from '../services/api'
import toast from 'react-hot-toast'
import { 
  TrendingUp, 
  Briefcase, 
  Users, 
  Star, 
  MapPin, 
  Clock,
  ExternalLink,
  RefreshCw,
  AlertCircle,
  Upload,
  Lock
} from 'lucide-react'

const Dashboard = () => {
  const { user, isAuthenticated, requireLogin } = useAuth()
  const navigate = useNavigate()
  const { matches, getMatches, loading } = useJobs()
  const [resumes, setResumes] = useState([])
  const [selectedResume, setSelectedResume] = useState(null)
  const [refreshing, setRefreshing] = useState(false)

  // Fetch user's resumes (only if authenticated)
  useEffect(() => {
    if (!isAuthenticated) return

    const fetchResumes = async () => {
      try {
        const response = await resumeAPI.getResumes()
        console.log('Resumes fetched:', response.data)
        
        // Backend returns response.data which is an array of resumes
        const resumesData = response.data?.data || response.data || []
        setResumes(resumesData)
        
        if (resumesData.length > 0) {
          setSelectedResume(resumesData[0])
        }
      } catch (error) {
        console.error('Failed to fetch resumes:', error)
        toast.error('Failed to load resumes')
      }
    }

    fetchResumes()
  }, [isAuthenticated])

  // Get matches when resume is selected
  useEffect(() => {
    if (selectedResume) {
      getMatches(selectedResume._id)
    }
  }, [selectedResume, getMatches])

  const handleRefresh = async () => {
    if (!selectedResume) return
    
    setRefreshing(true)
    try {
      await getMatches(selectedResume._id)
      toast.success('Recommendations refreshed!')
    } catch (error) {
      toast.error('Failed to refresh recommendations')
    } finally {
      setRefreshing(false)
    }
  }

  const formatSalary = (min, max) => {
    if (!min && !max) return 'Salary not specified'
    if (min && max) return `₹${min.toLocaleString()} - ₹${max.toLocaleString()}`
    if (min) return `₹${min.toLocaleString()}+`
    if (max) return `Up to ₹${max.toLocaleString()}`
  }

  const getScoreColor = (score) => {
    if (score >= 0.8) return 'text-green-600 bg-green-100'
    if (score >= 0.6) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getScoreLabel = (score) => {
    if (score >= 0.8) return 'Excellent Match'
    if (score >= 0.6) return 'Good Match'
    return 'Fair Match'
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Guest Welcome View */}
      {!isAuthenticated && (
        <div className="mb-8">
          <div className="card bg-gradient-to-r from-primary-50 to-blue-50 border-primary-200">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Welcome to CareerVerse Dashboard
                </h1>
                <p className="text-gray-600 mb-4">
                  Explore personalized job recommendations and freelance opportunities based on your resume. Sign in to unlock full features!
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => navigate('/login')}
                    className="btn-primary"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => navigate('/register')}
                    className="btn-secondary"
                  >
                    Create Account
                  </button>
                </div>
              </div>
              <Lock className="h-12 w-12 text-primary-400 flex-shrink-0" />
            </div>
          </div>
        </div>
      )}

      {/* Authenticated Header */}
      {isAuthenticated && (
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600">
            Here are your personalized job recommendations based on your resume.
          </p>
        </div>
      )}

      {/* Resume Selector */}
      {resumes.length > 0 && (
        <div className="card mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Select Resume</h3>
            <button
              onClick={handleRefresh}
              disabled={refreshing || loading}
              className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {resumes.map((resume) => (
              <div
                key={resume._id}
                onClick={() => setSelectedResume(resume)}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedResume?._id === resume._id
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <h4 className="font-medium text-gray-900 mb-2">
                  Resume {resume.createdAt ? new Date(resume.createdAt).toLocaleDateString() : 'Unknown'}
                </h4>
                <p className="text-sm text-gray-600">
                  {resume.skills?.length || 0} skills • {resume.experience?.length || 0} experiences
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Resume Message */}
      {isAuthenticated && resumes.length === 0 && (
        <div className="card bg-yellow-50 border-yellow-200 mb-8">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-6 w-6 text-yellow-600 mt-1" />
            <div>
              <h4 className="text-md font-semibold text-yellow-900 mb-2">
                No Resume Found
              </h4>
              <p className="text-yellow-700 mb-4">
                Upload your resume to get personalized job recommendations.
              </p>
              <button
                onClick={() => navigate('/upload')}
                className="btn-primary flex items-center space-x-2"
              >
                <Upload className="h-4 w-4" />
                <span>Upload Resume</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-primary-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Matches</p>
              <p className="text-2xl font-semibold text-gray-900">{matches.length}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Star className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">High Matches</p>
              <p className="text-2xl font-semibold text-gray-900">
                {matches.filter(m => m.score >= 0.8).length}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Briefcase className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Job Listings</p>
              <p className="text-2xl font-semibold text-gray-900">
                {matches.filter(m => m.type === 'job').length}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Freelance Gigs</p>
              <p className="text-2xl font-semibold text-gray-900">
                {matches.filter(m => m.type === 'freelance').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Top Recommendations</h2>
          {loading && (
            <div className="flex items-center space-x-2 text-gray-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
              <span>Loading...</span>
            </div>
          )}
        </div>

        {matches.length === 0 && !loading ? (
          <div className="card text-center py-12">
            <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Recommendations Yet</h3>
            <p className="text-gray-600 mb-4">
              Upload your resume to get personalized job recommendations.
            </p>
            <a href="/upload" className="btn-primary">
              Upload Resume
            </a>
          </div>
        ) : (
          <div className="grid gap-6">
            {matches.slice(0, 10).map((match, index) => (
              <div key={match._id || index} className="card hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {match.title}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(match.score)}`}>
                        {getScoreLabel(match.score)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                      <span className="flex items-center space-x-1">
                        <Briefcase className="h-4 w-4" />
                        <span>{match.company}</span>
                      </span>
                      {match.location && (
                        <span className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4" />
                          <span>{match.location}</span>
                        </span>
                      )}
                      {match.type && (
                        <span className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span className="capitalize">{match.type}</span>
                        </span>
                      )}
                    </div>
                    <p className="text-gray-700 mb-3">{match.description?.substring(0, 200)}...</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary-600 mb-1">
                      {Math.round(match.score * 100)}%
                    </div>
                    <div className="text-sm text-gray-600">Match Score</div>
                  </div>
                </div>

                {/* Matched Skills */}
                {match.matchedSkills && match.matchedSkills.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Matched Skills:</h4>
                    <div className="flex flex-wrap gap-2">
                      {match.matchedSkills.map((skill, skillIndex) => (
                        <span
                          key={skillIndex}
                          className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Reason */}
                {match.reason && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-1">Why this matches:</h4>
                    <p className="text-sm text-gray-600">{match.reason}</p>
                  </div>
                )}

                {/* Salary */}
                {(match.salaryMin || match.salaryMax) && (
                  <div className="mb-4">
                    <span className="text-sm font-medium text-gray-700">
                      {formatSalary(match.salaryMin, match.salaryMax)}
                    </span>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex space-x-3">
                    <button className="btn-primary text-sm">
                      Apply Now
                    </button>
                    <button className="btn-secondary text-sm">
                      Save Job
                    </button>
                  </div>
                  {match.url && (
                    <a
                      href={match.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1 text-primary-600 hover:text-primary-700 text-sm"
                    >
                      <span>View Original</span>
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      {isAuthenticated && (
        <div className="card bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a href="/jobs" className="btn-secondary text-center">
              Browse All Jobs
            </a>
            <a href="/freelancer" className="btn-secondary text-center">
              Explore Freelance
            </a>
            <button
              onClick={() => navigate('/upload')}
              className="btn-secondary text-center"
            >
              Update Resume
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard

