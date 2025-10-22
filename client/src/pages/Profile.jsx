import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import toast from 'react-hot-toast'
import { 
  User, 
  Mail, 
  Save, 
  Edit3, 
  Briefcase,
  DollarSign,
  Building,
  Clock,
  CheckCircle
} from 'lucide-react'

const schema = yup.object({
  name: yup.string().min(2, 'Name must be at least 2 characters').required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  preferences: yup.object({
    minSalary: yup.number().min(0, 'Minimum salary must be positive'),
    companyType: yup.string().oneOf(['any', 'well-known', 'startup']),
    jobType: yup.array().of(yup.string()),
    mode: yup.string().oneOf(['job', 'freelance', 'both'])
  })
})

const Profile = () => {
  const { user, updateProfile } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      preferences: {
        minSalary: user?.preferences?.minSalary || 30000,
        companyType: user?.preferences?.companyType || 'any',
        jobType: user?.preferences?.jobType || [],
        mode: user?.preferences?.mode || 'both'
      }
    }
  })

  const watchedJobType = watch('preferences.jobType')

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const result = await updateProfile(data)
      
      if (result.success) {
        toast.success('Profile updated successfully!')
        setIsEditing(false)
      } else {
        toast.error(result.error)
      }
    } catch (error) {
      toast.error('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
    reset({
      name: user?.name || '',
      email: user?.email || '',
      preferences: {
        minSalary: user?.preferences?.minSalary || 30000,
        companyType: user?.preferences?.companyType || 'any',
        jobType: user?.preferences?.jobType || [],
        mode: user?.preferences?.mode || 'both'
      }
    })
  }

  const handleCancel = () => {
    setIsEditing(false)
    reset()
  }

  const handleJobTypeChange = (type, checked) => {
    const currentTypes = watchedJobType || []
    const newTypes = checked
      ? [...currentTypes, type]
      : currentTypes.filter(t => t !== type)
    
    // Update the form value
    register('preferences.jobType').onChange({
      target: { value: newTypes }
    })
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Settings</h1>
        <p className="text-gray-600">
          Manage your account information and job search preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Information */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
              {!isEditing && (
                <button
                  onClick={handleEdit}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <Edit3 className="h-4 w-4" />
                  <span>Edit</span>
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Name */}
              <div>
                <label htmlFor="name" className="label">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...register('name')}
                    type="text"
                    disabled={!isEditing}
                    className={`input-field pl-10 ${!isEditing ? 'bg-gray-50' : ''}`}
                    placeholder="Enter your full name"
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="label">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...register('email')}
                    type="email"
                    disabled={!isEditing}
                    className={`input-field pl-10 ${!isEditing ? 'bg-gray-50' : ''}`}
                    placeholder="Enter your email"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              {/* Job Search Preferences */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Search Preferences</h3>
                
                {/* Minimum Salary */}
                <div className="mb-4">
                  <label htmlFor="minSalary" className="label">
                    Minimum Salary (₹)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <DollarSign className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      {...register('preferences.minSalary')}
                      type="number"
                      disabled={!isEditing}
                      className={`input-field pl-10 ${!isEditing ? 'bg-gray-50' : ''}`}
                      placeholder="30000"
                    />
                  </div>
                  {errors.preferences?.minSalary && (
                    <p className="mt-1 text-sm text-red-600">{errors.preferences.minSalary.message}</p>
                  )}
                </div>

                {/* Company Type */}
                <div className="mb-4">
                  <label htmlFor="companyType" className="label">
                    Preferred Company Type
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Building className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      {...register('preferences.companyType')}
                      disabled={!isEditing}
                      className={`input-field pl-10 ${!isEditing ? 'bg-gray-50' : ''}`}
                    >
                      <option value="any">Any Company</option>
                      <option value="well-known">Well-Known Companies</option>
                      <option value="startup">Startups</option>
                    </select>
                  </div>
                </div>

                {/* Job Type */}
                <div className="mb-4">
                  <label className="label">Preferred Job Types</label>
                  <div className="space-y-2">
                    {['full-time', 'part-time', 'remote'].map((type) => (
                      <label key={type} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={watchedJobType?.includes(type) || false}
                          onChange={(e) => handleJobTypeChange(type, e.target.checked)}
                          disabled={!isEditing}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700 capitalize">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Search Mode */}
                <div className="mb-6">
                  <label htmlFor="mode" className="label">
                    Search Mode
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Briefcase className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      {...register('preferences.mode')}
                      disabled={!isEditing}
                      className={`input-field pl-10 ${!isEditing ? 'bg-gray-50' : ''}`}
                    >
                      <option value="both">Jobs & Freelance</option>
                      <option value="job">Jobs Only</option>
                      <option value="freelance">Freelance Only</option>
                    </select>
                  </div>
                </div>

                {/* Action Buttons */}
                {isEditing && (
                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary flex items-center space-x-2"
                    >
                      <Save className="h-4 w-4" />
                      <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Account Summary */}
        <div className="space-y-6">
          {/* Account Status */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Status</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-sm text-gray-700">Account Active</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-sm text-gray-700">Email Verified</span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-blue-600" />
                <span className="text-sm text-gray-700">
                  Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Resumes Uploaded</span>
                <span className="text-sm font-medium text-gray-900">0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Jobs Applied</span>
                <span className="text-sm font-medium text-gray-900">0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Saved Jobs</span>
                <span className="text-sm font-medium text-gray-900">0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Freelance Gigs</span>
                <span className="text-sm font-medium text-gray-900">0</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <a href="/upload" className="btn-primary w-full text-center block">
                Upload Resume
              </a>
              <a href="/dashboard" className="btn-secondary w-full text-center block">
                View Dashboard
              </a>
              <a href="/jobs" className="btn-secondary w-full text-center block">
                Browse Jobs
              </a>
              <a href="/freelancer" className="btn-secondary w-full text-center block">
                Freelancer Hub
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile

