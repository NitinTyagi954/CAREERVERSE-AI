import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import axiosInstance from '../services/api'
import { 
  Search, 
  Filter, 
  Clock, 
  DollarSign, 
  Users, 
  Star,
  ExternalLink,
  Save,
  Zap,
  Calendar,
  AlertCircle,
  Loader
} from 'lucide-react'

const FreelancerHub = () => {
  const navigate = useNavigate()
  const [gigs, setGigs] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    minPay: 0,
    maxDuration: 0,
    category: 'all',
    difficulty: 'all'
  })

  const fetchGigs = async (searchParams = {}) => {
    setLoading(true)
    try {
      const response = await axiosInstance.get('/api/gigs', { params: searchParams })
      if (response.data.success) {
        setGigs(response.data.data.gigs || [])
      }
    } catch (error) {
      console.error('Error fetching gigs:', error)
      toast.error('Failed to load gigs')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchGigs()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSearch = () => {
    const searchParams = {
      q: searchTerm,
      ...filters
    }
    fetchGigs(searchParams)
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const applyFilters = () => {
    const searchParams = {
      search: searchTerm,
      ...filters
    }
    fetchGigs(searchParams)
    setShowFilters(false)
  }

  const clearFilters = () => {
    const defaultFilters = {
      minPay: 0,
      maxDuration: 0,
      category: 'all',
      difficulty: 'all'
    }
    setFilters(defaultFilters)
    fetchGigs({ search: searchTerm })
  }

  const formatPay = (min, max) => {
    if (!min && !max) return 'Pay not specified'
    if (min && max) return `₹${min.toLocaleString()} - ₹${max.toLocaleString()}`
    if (min) return `₹${min.toLocaleString()}+`
    if (max) return `Up to ₹${max.toLocaleString()}`
  }

  const formatDuration = (duration) => {
    if (!duration) return 'Duration not specified'
    if (duration < 7) return `${duration} days`
    if (duration < 30) return `${Math.round(duration / 7)} weeks`
    return `${Math.round(duration / 30)} months`
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const categories = [
    'all', 'data-entry', 'transcription', 'ai-training', 'content-writing',
    'graphic-design', 'web-development', 'mobile-development', 'data-analysis',
    'marketing', 'customer-support', 'virtual-assistant'
  ]

  const handleAcceptGig = (gigId) => {
    // Authentication removed - accept feature available to all
    toast.success('Gig accepted! Check your dashboard for details.')
  }

  const handleSaveGig = (gigId) => {
    // Authentication removed - save feature available to all
    toast.success('Gig saved to your favorites!')
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Freelancer Hub</h1>
        <p className="text-gray-600">
          Discover freelance opportunities and gigs that match your skills and schedule.
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="card bg-red-50 border-red-200 mb-8">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-6 w-6 text-red-600 mt-1 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="text-md font-semibold text-red-900 mb-1">
                Failed to load gigs
              </h4>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
            <button
              onClick={() => fetchGigs()}
              className="text-red-600 hover:text-red-700 font-medium text-sm whitespace-nowrap"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="card mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search gigs by title, skills, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
          </div>

          {/* Filter Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-secondary flex items-center space-x-2"
          >
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </button>

          {/* Search Button */}
          <button
            onClick={handleSearch}
            disabled={loading}
            className="btn-primary flex items-center space-x-2"
          >
            <Search className="h-4 w-4" />
            <span>Search</span>
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Min Pay */}
              <div>
                <label className="label">Minimum Pay</label>
                <select
                  value={filters.minPay}
                  onChange={(e) => handleFilterChange('minPay', parseInt(e.target.value))}
                  className="input-field"
                >
                  <option value={0}>Any</option>
                  <option value={5000}>₹5,000+</option>
                  <option value={10000}>₹10,000+</option>
                  <option value={25000}>₹25,000+</option>
                  <option value={50000}>₹50,000+</option>
                  <option value={100000}>₹1,00,000+</option>
                </select>
              </div>

              {/* Max Duration */}
              <div>
                <label className="label">Max Duration</label>
                <select
                  value={filters.maxDuration}
                  onChange={(e) => handleFilterChange('maxDuration', parseInt(e.target.value))}
                  className="input-field"
                >
                  <option value={0}>Any</option>
                  <option value={7}>1 week</option>
                  <option value={14}>2 weeks</option>
                  <option value={30}>1 month</option>
                  <option value={90}>3 months</option>
                </select>
              </div>

              {/* Category */}
              <div>
                <label className="label">Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="input-field"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </option>
                  ))}
                </select>
              </div>

              {/* Difficulty */}
              <div>
                <label className="label">Difficulty</label>
                <select
                  value={filters.difficulty}
                  onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                  className="input-field"
                >
                  <option value="all">Any Level</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button onClick={clearFilters} className="btn-secondary">
                Clear Filters
              </button>
              <button onClick={applyFilters} className="btn-primary">
                Apply Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            {loading ? 'Loading...' : `${gigs.length} gigs found`}
          </h2>
          {loading && (
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
          )}
        </div>
      </div>

      {/* Gig Listings */}
      <div className="space-y-6">
        {gigs.length === 0 && !loading ? (
          <div className="card text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Gigs Found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search criteria or filters to find more opportunities.
            </p>
            <button onClick={clearFilters} className="btn-primary">
              Clear Filters
            </button>
          </div>
        ) : (
          gigs.map((gig) => (
            <div key={gig._id} className="card hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {gig.title}
                    </h3>
                    {gig.difficulty && (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(gig.difficulty)}`}>
                        {gig.difficulty.charAt(0).toUpperCase() + gig.difficulty.slice(1)}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                    <span className="flex items-center space-x-1">
                      <DollarSign className="h-4 w-4" />
                      <span>{formatPay(gig.payMin, gig.payMax)}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{formatDuration(gig.duration)}</span>
                    </span>
                    {gig.category && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                        {gig.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    )}
                  </div>

                  <p className="text-gray-700 mb-4">
                    {gig.description?.substring(0, 300)}...
                  </p>

                  {/* Skills/Requirements */}
                  {gig.requirements && gig.requirements.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Requirements:</h4>
                      <div className="flex flex-wrap gap-2">
                        {gig.requirements.slice(0, 6).map((req, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                          >
                            {req}
                          </span>
                        ))}
                        {gig.requirements.length > 6 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                            +{gig.requirements.length - 6} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Additional Info */}
                  <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
                    {gig.clientRating && (
                      <span className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span>{gig.clientRating}/5.0</span>
                      </span>
                    )}
                    {gig.proposalsCount && (
                      <span className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{gig.proposalsCount} proposals</span>
                      </span>
                    )}
                    {gig.deadline && (
                      <span className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>Due {new Date(gig.deadline).toLocaleDateString()}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex space-x-3">
                  <button className="btn-primary text-sm flex items-center space-x-1">
                    <Zap className="h-4 w-4" />
                    <span>Apply Now</span>
                  </button>
                  <button className="btn-secondary text-sm flex items-center space-x-1">
                    <Save className="h-4 w-4" />
                    <span>Save</span>
                  </button>
                </div>
                <div className="flex items-center space-x-2">
                  {gig.source && (
                    <span className="text-sm text-gray-500">via {gig.source}</span>
                  )}
                  {gig.url && (
                    <a
                      href={gig.url}
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
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {gigs.length > 0 && gigsPagination.totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center space-x-2">
          <button
            onClick={() => goToGigPage(gigsPagination.currentPage - 1)}
            disabled={!gigsPagination.hasPrev || loading}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <div className="flex items-center space-x-1">
            {Array.from({ length: gigsPagination.totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => goToGigPage(page)}
                disabled={loading}
                className={`px-3 py-2 rounded-lg ${
                  gigsPagination.currentPage === page
                    ? 'bg-primary-600 text-white'
                    : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                } disabled:opacity-50`}
              >
                {page}
              </button>
            ))}
          </div>
          
          <button
            onClick={() => goToGigPage(gigsPagination.currentPage + 1)}
            disabled={!gigsPagination.hasNext || loading}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
          
          <span className="ml-4 text-sm text-gray-600">
            Page {gigsPagination.currentPage} of {gigsPagination.totalPages} • 
            Total: {gigsPagination.totalGigs} gigs
          </span>
        </div>
      )}

      {/* Popular Categories */}
      <div className="mt-12">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Popular Categories</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.slice(1).map(category => (
            <button
              key={category}
              onClick={() => {
                handleFilterChange('category', category)
                applyFilters()
              }}
              className="p-4 text-center border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
            >
              <div className="text-sm font-medium text-gray-900">
                {category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default FreelancerHub

