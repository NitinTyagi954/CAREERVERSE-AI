import React, { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { resumeAPI } from '../services/api'
import toast from 'react-hot-toast'
import { Upload, FileText, CheckCircle, AlertCircle, Loader } from 'lucide-react'

const UploadResume = () => {
  const [uploading, setUploading] = useState(false)
  const [uploadedFile, setUploadedFile] = useState(null)
  const [parsedData, setParsedData] = useState(null)

  const onDrop = async (acceptedFiles) => {
    const file = acceptedFiles[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a PDF or DOCX file')
      return
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB')
      return
    }

    setUploading(true)
    setUploadedFile(file)

    try {
      const formData = new FormData()
      formData.append('resume', file)

      const response = await resumeAPI.upload(formData)
      
      // Backend returns response.data.data with the resume object
      const resumeData = response.data?.data || response.data
      
      if (resumeData && resumeData.skills) {
        setParsedData(resumeData)
        toast.success('Resume uploaded and parsed successfully!')
      } else {
        toast.error('Failed to parse resume - no data returned')
      }
    } catch (error) {
      console.error('Upload error:', error)
      toast.error(error.response?.data?.message || 'Failed to upload resume')
    } finally {
      setUploading(false)
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    multiple: false,
    disabled: uploading
  })

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Your Resume</h1>
        <p className="text-gray-600">
          Upload your resume in PDF or DOCX format. Our AI will analyze it and extract your skills, experience, and education.
        </p>
      </div>

      {/* Upload Area */}
      <div className="card mb-8">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-primary-500 bg-primary-50'
              : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
          } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <input {...getInputProps()} />
          
          {uploading ? (
            <div className="flex flex-col items-center">
              <Loader className="h-12 w-12 text-primary-600 animate-spin mb-4" />
              <p className="text-lg font-medium text-gray-900">Uploading and parsing...</p>
              <p className="text-gray-600">Please wait while we process your resume</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <Upload className="h-12 w-12 text-gray-400 mb-4" />
              <p className="text-lg font-medium text-gray-900 mb-2">
                {isDragActive ? 'Drop your resume here' : 'Drag & drop your resume here'}
              </p>
              <p className="text-gray-600 mb-4">or click to browse files</p>
              <p className="text-sm text-gray-500">
                Supports PDF and DOCX files up to 5MB
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Uploaded File Info */}
      {uploadedFile && (
        <div className="card mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <FileText className="h-6 w-6 text-primary-600" />
            <h3 className="text-lg font-semibold text-gray-900">Uploaded File</h3>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">{uploadedFile.name}</p>
                <p className="text-sm text-gray-600">
                  {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
      )}

      {/* Parsed Data */}
      {parsedData && (
        <div className="space-y-6">
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-6 w-6 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Parsed Information</h3>
          </div>

          {/* Skills */}
          {parsedData.skills && parsedData.skills.length > 0 && (
            <div className="card">
              <h4 className="text-md font-semibold text-gray-900 mb-3">Skills</h4>
              <div className="flex flex-wrap gap-2">
                {parsedData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Experience */}
          {parsedData.experience && parsedData.experience.length > 0 && (
            <div className="card">
              <h4 className="text-md font-semibold text-gray-900 mb-3">Experience</h4>
              <div className="space-y-3">
                {parsedData.experience.map((exp, index) => (
                  <div key={index} className="border-l-4 border-primary-200 pl-4">
                    <h5 className="font-medium text-gray-900">{exp.title}</h5>
                    <p className="text-gray-600">{exp.company}</p>
                    {exp.bullets && exp.bullets.length > 0 && (
                      <ul className="mt-2 text-sm text-gray-600">
                        {exp.bullets.map((bullet, bulletIndex) => (
                          <li key={bulletIndex} className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {parsedData.education && parsedData.education.length > 0 && (
            <div className="card">
              <h4 className="text-md font-semibold text-gray-900 mb-3">Education</h4>
              <div className="space-y-3">
                {parsedData.education.map((edu, index) => (
                  <div key={index} className="border-l-4 border-primary-200 pl-4">
                    <h5 className="font-medium text-gray-900">{edu.degree}</h5>
                    <p className="text-gray-600">{edu.institution}</p>
                    {edu.year && (
                      <p className="text-sm text-gray-500">{edu.year}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Raw Text Preview */}
          {parsedData.text && (
            <div className="card">
              <h4 className="text-md font-semibold text-gray-900 mb-3">Extracted Text</h4>
              <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto">
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {parsedData.text.substring(0, 1000)}
                  {parsedData.text.length > 1000 && '...'}
                </p>
              </div>
            </div>
          )}

          {/* Next Steps */}
          <div className="card bg-primary-50 border-primary-200">
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-6 w-6 text-primary-600 mt-1" />
              <div>
                <h4 className="text-md font-semibold text-primary-900 mb-2">
                  Resume Successfully Processed!
                </h4>
                <p className="text-primary-700 mb-4">
                  Your resume has been analyzed and your profile has been updated. 
                  You can now get personalized job recommendations.
                </p>
                <div className="flex space-x-3">
                  <a
                    href="/dashboard"
                    className="btn-primary"
                  >
                    View Recommendations
                  </a>
                  <a
                    href="/jobs"
                    className="btn-secondary"
                  >
                    Browse Jobs
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="card bg-blue-50 border-blue-200 mt-8">
        <div className="flex items-start space-x-3">
          <AlertCircle className="h-6 w-6 text-blue-600 mt-1" />
          <div>
            <h4 className="text-md font-semibold text-blue-900 mb-2">
              Tips for Better Results
            </h4>
            <ul className="text-blue-700 space-y-1 text-sm">
              <li>• Use a clear, well-formatted resume with standard sections</li>
              <li>• Include specific skills and technologies you know</li>
              <li>• Mention your years of experience for each role</li>
              <li>• Keep your resume up to date with recent projects</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UploadResume

