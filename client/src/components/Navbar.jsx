import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Briefcase, 
  User, 
  LogOut, 
  Upload, 
  BarChart3,
  Users,
  Menu,
  X,
  ArrowRight,
  Search,
  Bell,
  ChevronDown,
  Settings
} from 'lucide-react';
import toast from 'react-hot-toast';

/**
 * Navbar Component
 * Professional navigation bar for CareerVerse AI platform
 */
const Navbar = () => {
  // Authentication disabled - showing all menu items to everyone
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Detect scroll for navbar styling changes
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const userMenu = document.getElementById('user-menu');
      if (userMenu && !userMenu.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav 
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-md' 
          : 'bg-white'
      } ${location.pathname === '/' && !scrolled ? 'border-b border-white/10' : 'border-b border-gray-200'}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18">
          {/* Logo - Left */}
          <Link 
            to="/" 
            className="flex items-center space-x-3 flex-shrink-0 group py-4"
          >
            <div className="relative">
              <div className="absolute -inset-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg blur opacity-30 group-hover:opacity-70 transition-opacity"></div>
              <div className="relative bg-white p-1.5 rounded-lg">
                <Briefcase className="h-6 w-6 text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text" />
              </div>
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-gray-900">CareerVerse</h1>
              <p className="text-xs text-gray-500 -mt-1">AI-Powered Career Platform</p>
            </div>
          </Link>

          {/* Center Navigation - Desktop Only - All items visible without auth */}
          <div className="hidden md:flex items-center space-x-1">
            <Link
              to="/"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                isActive('/')
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <span>Home</span>
            </Link>

            <Link
              to="/dashboard"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                isActive('/dashboard')
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <BarChart3 className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>

            <Link
              to="/jobs"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                isActive('/jobs')
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Briefcase className="h-4 w-4" />
              <span>Jobs</span>
            </Link>

            <Link
              to="/freelancer"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                isActive('/freelancer')
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Users className="h-4 w-4" />
              <span>Freelancer</span>
            </Link>

            <Link
              to="/about"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                isActive('/about')
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <span>About</span>
            </Link>
          </div>

          {/* Right Side - Upload Button */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <Link
              to="/upload"
              className="hidden lg:flex items-center space-x-2 px-4 py-2 bg-indigo-50 rounded-lg text-indigo-700 font-medium hover:bg-indigo-100 transition-all duration-200"
            >
              <Upload className="h-4 w-4" />
              <span>Upload Resume</span>
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - All items visible */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white py-3 px-4 shadow-lg space-y-2 overflow-hidden transition-all duration-300">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center justify-between px-4 py-3 rounded-lg font-medium transition-all ${
              isActive('/') 
                ? 'bg-indigo-50 text-indigo-700' 
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <span>Home</span>
            {isActive('/') && <div className="h-2 w-2 rounded-full bg-indigo-600"></div>}
          </Link>
          
          <Link
            to="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center justify-between px-4 py-3 rounded-lg font-medium transition-all ${
              isActive('/dashboard') 
                ? 'bg-indigo-50 text-indigo-700' 
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center space-x-3">
              <BarChart3 className="h-5 w-5" />
              <span>Dashboard</span>
            </div>
            {isActive('/dashboard') && <div className="h-2 w-2 rounded-full bg-indigo-600"></div>}
          </Link>

          <Link
            to="/jobs"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center justify-between px-4 py-3 rounded-lg font-medium transition-all ${
              isActive('/jobs') 
                ? 'bg-indigo-50 text-indigo-700' 
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center space-x-3">
              <Briefcase className="h-5 w-5" />
              <span>Jobs</span>
            </div>
            {isActive('/jobs') && <div className="h-2 w-2 rounded-full bg-indigo-600"></div>}
          </Link>

          <Link
            to="/freelancer"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center justify-between px-4 py-3 rounded-lg font-medium transition-all ${
              isActive('/freelancer') 
                ? 'bg-indigo-50 text-indigo-700' 
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center space-x-3">
              <Users className="h-5 w-5" />
              <span>Freelancer</span>
            </div>
            {isActive('/freelancer') && <div className="h-2 w-2 rounded-full bg-indigo-600"></div>}
          </Link>

          <Link
            to="/upload"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center justify-between px-4 py-3 rounded-lg font-medium transition-all ${
              isActive('/upload') 
                ? 'bg-indigo-50 text-indigo-700' 
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center space-x-3">
              <Upload className="h-5 w-5" />
              <span>Upload Resume</span>
            </div>
            {isActive('/upload') && <div className="h-2 w-2 rounded-full bg-indigo-600"></div>}
          </Link>

          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center justify-between px-4 py-3 rounded-lg font-medium transition-all ${
              isActive('/about') 
                ? 'bg-indigo-50 text-indigo-700' 
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <span>About</span>
            {isActive('/about') && <div className="h-2 w-2 rounded-full bg-indigo-600"></div>}
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
