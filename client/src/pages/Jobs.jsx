import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { MapPin, DollarSign, Briefcase, Clock, Save, Send, Loader } from 'lucide-react';
import axiosInstance from '../services/api';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ jobType: '', remote: '', companyType: '', platform: '' });
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, hasNextPage: false, hasPrevPage: false, totalJobs: 0 });

  const fetchJobs = async (page = 1, q = '', filterParams = filters) => {
    setLoading(true);
    try {
      const params = { page, limit: 10, q: q || searchTerm, ...filterParams };
      const response = await axiosInstance.get('/api/jobs', { params });
      if (response.data.success) {
        setJobs(response.data.data.jobs);
        setPagination(response.data.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to load jobs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (value) => {
    setSearchTerm(value);
    setTimeout(() => fetchJobs(1, value, filters), 500);
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    fetchJobs(1, searchTerm, newFilters);
  };

  const handleSaveJob = (jobId) => {
    // Authentication removed - save feature available to all
    toast.success('Job saved successfully!');
  };

  const handleApply = (jobId) => {
    // Authentication removed - apply feature available to all
    toast.success('Application submitted successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-2">Job Listings</h1>
        <p className="text-gray-600 mb-8">Find opportunities</p>
        <div className="bg-yellow-100 border border-yellow-400 p-4 mb-4 rounded">
          DEBUG: Jobs loaded: {jobs.length}, Loading: {loading ? 'YES' : 'NO'}, Auth: {isAuthenticated ? 'YES' : 'NO'}
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => handleSearch(e.target.value)} className="w-full px-4 py-2 border rounded-lg mb-4 focus:ring-2 focus:ring-blue-500" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <select value={filters.jobType} onChange={(e) => handleFilterChange('jobType', e.target.value)} className="px-4 py-2 border rounded-lg"><option value="">All Types</option><option value="Full-time">Full-time</option><option value="Internship">Internship</option></select>
            <select value={filters.remote} onChange={(e) => handleFilterChange('remote', e.target.value)} className="px-4 py-2 border rounded-lg"><option value="">All Modes</option><option value="remote">Remote</option><option value="office">Office</option><option value="hybrid">Hybrid</option></select>
            <select value={filters.companyType} onChange={(e) => handleFilterChange('companyType', e.target.value)} className="px-4 py-2 border rounded-lg"><option value="">All Companies</option><option value="Startup">Startup</option><option value="Product">Product</option><option value="Enterprise">Enterprise</option></select>
            <select value={filters.platform} onChange={(e) => handleFilterChange('platform', e.target.value)} className="px-4 py-2 border rounded-lg"><option value="">All Platforms</option><option value="LinkedIn">LinkedIn</option><option value="Internshala">Internshala</option><option value="Indeed">Indeed</option></select>
          </div>
        </div>

        {loading && <div className="flex justify-center py-12"><Loader className="animate-spin" size={32} /></div>}

        {!loading && jobs.length > 0 && (
          <div className="space-y-4">
            {jobs.map((job) => (
              <div key={job.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between">
                  <div className="flex-1">
                    <h2 className="text-xl font-bold">{job.title}</h2>
                    <p className="text-gray-600">{job.company}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm mt-2">
                      <div className="flex items-center gap-1"><MapPin size={14} />{job.location}</div>
                      <div className="flex items-center gap-1"><DollarSign size={14} />{job.salary}</div>
                      <div className="flex items-center gap-1"><Briefcase size={14} />{job.jobType}</div>
                      <div className="flex items-center gap-1"><Clock size={14} />{job.posted}</div>
                    </div>
                    <div className="flex gap-2 mt-2">
                      {job.tags.map((tag, i) => (<span key={i} className="bg-blue-100 text-xs px-2 py-1 rounded">{tag}</span>))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button onClick={() => handleSaveJob(job.id)} className="px-3 py-2 bg-gray-100 rounded text-sm"><Save size={14} /> Save</button>
                    <button onClick={() => handleApply(job.id)} className="px-3 py-2 bg-blue-500 text-white rounded text-sm"><Send size={14} /> Apply</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && jobs.length === 0 && <div className="text-center py-12"><p>No jobs found</p></div>}

        {pagination.totalPages > 1 && (
          <div className="mt-8 flex justify-center gap-4">
            <button onClick={() => fetchJobs(pagination.currentPage - 1, searchTerm, filters)} disabled={!pagination.hasPrevPage} className="px-4 py-2 bg-gray-200 rounded">Prev</button>
            <span>Page {pagination.currentPage} of {pagination.totalPages}</span>
            <button onClick={() => fetchJobs(pagination.currentPage + 1, searchTerm, filters)} disabled={!pagination.hasNextPage} className="px-4 py-2 bg-blue-500 text-white rounded">Next</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;
