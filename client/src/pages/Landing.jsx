import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Briefcase, 
  Zap, 
  TrendingUp, 
  Users, 
  CheckCircle, 
  ArrowRight, 
  Sparkles,
  Target,
  Shield,
  Clock,
  Star,
  ChevronDown,
  BookOpen
} from 'lucide-react';

/**
 * Landing Page Component
 * Professional landing page for CareerVerse AI platform
 */
const Landing = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isVisible, setIsVisible] = useState({});
  const [openFaq, setOpenFaq] = useState(null);
  
  // Simplified testimonials for new startup
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Software Developer",
      company: "TechCorp",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      content: "CareerVerse AI matched me with a great job opportunity that aligned perfectly with my skills. The platform was intuitive and saved me hours of searching.",
      rating: 5
    }
  ];

  // Professional and concise FAQs
  const faqs = [
    {
      question: "How does the matching algorithm work?",
      answer: "Our AI analyzes your resume data points and compares them against job listings to find ideal matches based on skills, experience, and career goals."
    },
    {
      question: "Is my resume data secure?",
      answer: "We use industry-standard encryption to protect all your personal information. Your data is never sold to third parties."
    }
  ];

  /**
   * Handles the Get Started button click
   * Navigates to dashboard if authenticated, otherwise to registration
   */
  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/register');
    }
  };

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(prev => ({
            ...prev,
            [entry.target.id]: entry.isIntersecting
          }));
        });
      },
      { threshold: 0.1 }
    );

    const sections = document.querySelectorAll('.animate-on-scroll');
    sections.forEach(section => {
      if (section) {
        observer.observe(section);
      }
    });

    return () => {
      sections.forEach(section => {
        if (section) observer.unobserve(section);
      });
    };
  }, []);

  // Testimonial carousel
  useEffect(() => {
    if (testimonials.length <= 1) return;
    
    const interval = setInterval(() => {
      setActiveTestimonial(prev => (prev + 1) % testimonials.length);
    }, 6000);
    
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-24">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-8 border border-white/30 animate-fade-in-down">
              <Sparkles className="h-4 w-4" />
              AI-Powered Career Platform
            </div>
            
            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight animate-fade-in-down animation-delay-300">
              Your Dream Career
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-pink-200">
                Starts Here
              </span>
            </h1>
            
            {/* Subheading */}
            <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-3xl mx-auto leading-relaxed font-light animate-fade-in-down animation-delay-500">
              Let AI match you with perfect opportunities. Upload your resume, get instant matches, 
              and land your dream job faster than ever.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fade-in-down animation-delay-700">
              <button
                onClick={handleGetStarted}
                className="group px-10 py-5 bg-white text-indigo-600 rounded-xl font-bold hover:bg-gray-50 transition-all duration-300 flex items-center justify-center gap-3 text-lg shadow-2xl hover:shadow-3xl hover:scale-105"
                aria-label="Get started for free"
              >
                Get Started Free
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button
                onClick={() => navigate('/login')}
                className="px-10 py-5 bg-transparent border-2 border-white text-white rounded-xl font-bold hover:bg-white hover:text-indigo-600 transition-all duration-300 text-lg backdrop-blur-sm"
                aria-label="Sign in"
              >
                Sign In
              </button>
            </div>

            {/* Stats - Modest numbers for a new startup */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto animate-fade-in-up">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:translate-y-[-5px]">
                <div className="text-5xl font-black text-white mb-2">500+</div>
                <p className="text-white/80 font-medium">Active Jobs</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:translate-y-[-5px]">
                <div className="text-5xl font-black text-white mb-2">100+</div>
                <p className="text-white/80 font-medium">Freelance Gigs</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:translate-y-[-5px]">
                <div className="text-5xl font-black text-white mb-2">90%</div>
                <p className="text-white/80 font-medium">Match Rate</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 200" className="w-full">
            <path fill="#f9fafb" fillOpacity="1" d="M0,192L60,186.7C120,181,240,171,360,144C480,117,600,75,720,74.7C840,75,960,117,1080,138.7C1200,160,1320,160,1380,160L1440,160L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
          </svg>
        </div>
      </section>

      {/* Partners Section - Simple */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-600 text-lg mb-8">Partnering with industry leaders</p>
          <div className="flex flex-wrap justify-center gap-12 items-center opacity-70">
            {/* Placeholder logos - replace with actual partners when available */}
            <div className="w-32 h-10 bg-gray-200 rounded flex items-center justify-center">
              <span className="text-gray-500 font-medium">Partner 1</span>
            </div>
            <div className="w-32 h-10 bg-gray-200 rounded flex items-center justify-center">
              <span className="text-gray-500 font-medium">Partner 2</span>
            </div>
            <div className="w-32 h-10 bg-gray-200 rounded flex items-center justify-center">
              <span className="text-gray-500 font-medium">Partner 3</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-white animate-on-scroll">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 rounded-full text-indigo-700 text-sm font-semibold mb-6">
              <Target className="h-4 w-4" />
              Simple Process
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Three simple steps to transform your career journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className={`group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 ${isVisible['how-it-works'] ? 'animate-fade-in-right' : 'opacity-0'}`}>
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                1
              </div>
              <div className="flex items-center justify-center h-20 w-20 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 mb-6 mx-auto group-hover:scale-110 transition-transform duration-500">
                <Briefcase className="h-10 w-10 text-indigo-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center">Upload Resume</h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Drop your PDF or DOCX. Our AI analyzes your skills, experience, and qualifications instantly.
              </p>
            </div>

            {/* Step 2 */}
            <div className={`group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 ${isVisible['how-it-works'] ? 'animate-fade-in-up animation-delay-300' : 'opacity-0'}`}>
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                2
              </div>
              <div className="flex items-center justify-center h-20 w-20 rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 mb-6 mx-auto group-hover:scale-110 transition-transform duration-500">
                <Zap className="h-10 w-10 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center">Get Matches</h3>
              <p className="text-gray-600 text-center leading-relaxed">
                AI finds the perfect jobs and gigs based on your profile, experience, and career goals.
              </p>
            </div>

            {/* Step 3 */}
            <div className={`group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 ${isVisible['how-it-works'] ? 'animate-fade-in-left animation-delay-600' : 'opacity-0'}`}>
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-pink-500 to-orange-500 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                3
              </div>
              <div className="flex items-center justify-center h-20 w-20 rounded-2xl bg-gradient-to-br from-pink-100 to-orange-100 mb-6 mx-auto group-hover:scale-110 transition-transform duration-500">
                <Target className="h-10 w-10 text-pink-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center">Land the Job</h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Apply with one click. Streamline applications and accelerate your career growth.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Split Design */}
      <section id="features" className="py-24 bg-gray-50 animate-on-scroll">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Job Seekers */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
            <div className={`order-2 lg:order-1 ${isVisible['features'] ? 'animate-fade-in-right' : 'opacity-0'}`}>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 rounded-full text-indigo-700 text-sm font-semibold mb-6">
                <Briefcase className="h-4 w-4" />
                For Job Seekers
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
                Find Your Perfect Role
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Let AI do the heavy lifting. Get matched with opportunities that align perfectly with your skills and career goals.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-white transition-colors duration-300 group">
                  <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg mb-1">AI Resume Analysis</h4>
                    <p className="text-gray-600">Instant insights and optimization suggestions for your resume</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-white transition-colors duration-300 group">
                  <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg mb-1">Smart Recommendations</h4>
                    <p className="text-gray-600">Personalized job matches based on your unique profile</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-white transition-colors duration-300 group">
                  <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg mb-1">Quick Applications</h4>
                    <p className="text-gray-600">Apply to multiple jobs in seconds, not hours</p>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => navigate('/jobs')}
                className="group px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-2xl transition-all duration-300 flex items-center gap-2 hover:scale-105"
                aria-label="Explore jobs"
              >
                Explore Jobs
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className={`order-1 lg:order-2 ${isVisible['features'] ? 'animate-fade-in-left' : 'opacity-0'}`}>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-200 to-purple-200 rounded-3xl transform rotate-3"></div>
                <div className="relative bg-white rounded-3xl p-8 shadow-2xl">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl p-6 text-center">
                      <Briefcase className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-gray-900">50+</div>
                      <div className="text-sm text-gray-600">Companies</div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-6 text-center">
                      <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-gray-900">85%</div>
                      <div className="text-sm text-gray-600">Success Rate</div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-pink-100 to-orange-100 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                      <span className="font-semibold text-gray-900">Profile Verified</span>
                    </div>
                    <div className="space-y-2">
                      <div className="h-2 bg-white rounded-full w-full"></div>
                      <div className="h-2 bg-white rounded-full w-4/5"></div>
                      <div className="h-2 bg-white rounded-full w-3/5"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Freelancers */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className={`${isVisible['features'] ? 'animate-fade-in-right animation-delay-300' : 'opacity-0'}`}>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-200 to-pink-200 rounded-3xl transform -rotate-3"></div>
                <div className="relative bg-white rounded-3xl p-8 shadow-2xl">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-6 text-center">
                      <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-gray-900">30+</div>
                      <div className="text-sm text-gray-600">Active Gigs</div>
                    </div>
                    <div className="bg-gradient-to-br from-pink-100 to-orange-100 rounded-2xl p-6 text-center">
                      <Shield className="h-8 w-8 text-pink-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-gray-900">100%</div>
                      <div className="text-sm text-gray-600">Secure</div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-semibold text-gray-900">Earnings Potential</span>
                      <TrendingUp className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">$3,240</div>
                    <div className="text-sm text-gray-600">Monthly Average</div>
                  </div>
                </div>
              </div>
            </div>

            <div className={`${isVisible['features'] ? 'animate-fade-in-left animation-delay-300' : 'opacity-0'}`}>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-full text-purple-700 text-sm font-semibold mb-6">
                <Users className="h-4 w-4" />
                For Freelancers
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
                Build Your Freelance Empire
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Access curated gig opportunities that match your expertise. Work on your terms, get paid fairly.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-white transition-colors duration-300 group">
                  <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg mb-1">Curated Opportunities</h4>
                    <p className="text-gray-600">Hand-picked gigs matched to your skills and experience</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-white transition-colors duration-300 group">
                  <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg mb-1">Flexible Schedule</h4>
                    <p className="text-gray-600">Work when you want, where you want, how you want</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-white transition-colors duration-300 group">
                  <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg mb-1">Secure Payments</h4>
                    <p className="text-gray-600">Get paid on time, every time, with secure transactions</p>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => navigate('/freelancer')}
                className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:shadow-2xl transition-all duration-300 flex items-center gap-2 hover:scale-105"
                aria-label="Browse gigs"
              >
                Browse Gigs
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section - Minimal */}
      <section id="testimonials" className="py-24 bg-white animate-on-scroll">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-100 rounded-full text-pink-700 text-sm font-semibold mb-6">
              <Star className="h-4 w-4" />
              Early Success
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
              What Our Beta Users Say
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Early adopters are already seeing results with our platform
            </p>
          </div>
          
          {testimonials.length > 0 && (
            <div className={`relative mx-auto max-w-4xl ${isVisible['testimonials'] ? 'animate-fade-in-up' : 'opacity-0'}`}>
              <div className="overflow-hidden">
                <div className="flex transition-all duration-1000 ease-in-out" style={{ transform: `translateX(-${activeTestimonial * 100}%)` }}>
                  {testimonials.map((testimonial) => (
                    <div key={testimonial.id} className="min-w-full px-4">
                      <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100">
                        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-6">
                          <img 
                            src={testimonial.avatar} 
                            alt={testimonial.name} 
                            className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                          />
                          <div className="text-center md:text-left">
                            <div className="flex justify-center md:justify-start items-center gap-1 mb-1">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`h-5 w-5 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                                />
                              ))}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">{testimonial.name}</h3>
                            <p className="text-gray-600">{testimonial.role} at {testimonial.company}</p>
                          </div>
                        </div>
                        <blockquote className="text-xl md:text-2xl text-gray-800 font-light italic leading-relaxed text-center">
                          "{testimonial.content}"
                        </blockquote>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Core Features - Professional */}
      <section id="app-features" className="py-24 bg-gray-50 animate-on-scroll">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 rounded-full text-indigo-700 text-sm font-semibold mb-6">
              <Sparkles className="h-4 w-4" />
              Platform Features
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
              Streamlined Career Solutions
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Professional tools designed to accelerate your career journey
            </p>
          </div>

          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ${isVisible['app-features'] ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl mx-auto flex items-center justify-center mb-6 transform -rotate-6">
                <Briefcase className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Resume Analysis</h3>
              <p className="text-gray-600">
                AI-powered resume analysis that identifies your strengths and suggests improvements.
              </p>
            </div>
            
            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mx-auto flex items-center justify-center mb-6 transform -rotate-6">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Career Resources</h3>
              <p className="text-gray-600">
                Access industry insights, salary guides, and interview preparation tools.
              </p>
            </div>
            
            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-orange-500 rounded-2xl mx-auto flex items-center justify-center mb-6 transform -rotate-6">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Professional Network</h3>
              <p className="text-gray-600">
                Connect with industry professionals and expand your career opportunities.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section id="faq" className="py-24 bg-white animate-on-scroll">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 rounded-full text-indigo-700 text-sm font-semibold mb-6">
              <ChevronDown className="h-4 w-4" />
              Common Questions
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get answers to common questions about our platform
            </p>
          </div>
          
          <div className={`space-y-6 ${isVisible['faq'] ? 'animate-fade-in-up' : 'opacity-0'}`}>
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className="bg-white rounded-2xl p-6 shadow-md border border-gray-100"
              >
                <button 
                  className="flex justify-between items-center w-full text-left"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  aria-expanded={openFaq === index}
                  aria-controls={`faq-answer-${index}`}
                >
                  <h3 className="text-xl font-bold text-gray-900">{faq.question}</h3>
                  <ChevronDown 
                    className={`h-5 w-5 text-gray-500 transition-transform ${openFaq === index ? 'transform rotate-180' : ''}`} 
                  />
                </button>
                <div 
                  id={`faq-answer-${index}`}
                  className={`mt-4 text-gray-600 overflow-hidden transition-all duration-300 ${
                    openFaq === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 py-24 animate-on-scroll" id="cta">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full mix-blend-overlay filter blur-2xl"></div>
        </div>
        
        <div className={`relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center ${isVisible['cta'] ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-6">
            Ready to Transform Your Career?
          </h2>
          <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto font-light">
            Join the professionals who are already leveraging AI to advance their careers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleGetStarted}
              className="group px-10 py-5 bg-white text-indigo-600 rounded-xl font-bold hover:bg-gray-50 transition-all duration-300 flex items-center justify-center gap-3 text-lg shadow-2xl hover:scale-105"
              aria-label="Start your journey"
            >
              Start Your Journey
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-10 py-5 bg-transparent border-2 border-white text-white rounded-xl font-bold hover:bg-white hover:text-indigo-600 transition-all duration-300 text-lg"
              aria-label="Sign in"
            >
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <h4 className="text-white font-bold text-2xl mb-4">CareerVerse AI</h4>
              <p className="text-gray-400 text-base mb-6 max-w-md">
                The future of job searching. AI-powered matching that connects talented professionals 
                with their dream opportunities.
              </p>
              <div className="flex gap-4">
                <button className="h-10 w-10 rounded-full bg-gray-800 hover:bg-indigo-600 transition-colors flex items-center justify-center" aria-label="Facebook">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </button>
                <button className="h-10 w-10 rounded-full bg-gray-800 hover:bg-indigo-600 transition-colors flex items-center justify-center" aria-label="Twitter">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                </button>
                <button className="h-10 w-10 rounded-full bg-gray-800 hover:bg-indigo-600 transition-colors flex items-center justify-center" aria-label="LinkedIn">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </button>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4 text-lg">Platform</h4>
              <ul className="space-y-3">
                <li><a href="/jobs" className="hover:text-white transition-colors">Find Jobs</a></li>
                <li><a href="/freelancer" className="hover:text-white transition-colors">Find Gigs</a></li>
                <li><a href="/dashboard" className="hover:text-white transition-colors">Dashboard</a></li>
                <li><a href="/upload-resume" className="hover:text-white transition-colors">Upload Resume</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4 text-lg">Company</h4>
              <ul className="space-y-3">
                <li><a href="/about" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="/contact" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="/terms" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500">
              &copy; 2025 CareerVerse AI. All rights reserved.
            </p>
            <p className="text-sm text-gray-500 mt-4 md:mt-0">
              Made with ❤️ for job seekers and freelancers
            </p>
          </div>
        </div>
      </footer>

      {/* Add CSS for animations */}
      <style>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInLeft {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeInRight {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        .animate-fade-in-down {
          animation: fadeInDown 0.7s ease-out forwards;
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.7s ease-out forwards;
        }
        
        .animate-fade-in-left {
          animation: fadeInLeft 0.7s ease-out forwards;
        }
        
        .animate-fade-in-right {
          animation: fadeInRight 0.7s ease-out forwards;
        }
        
        .animation-delay-300 {
          animation-delay: 300ms;
        }
        
        .animation-delay-500 {
          animation-delay: 500ms;
        }
        
        .animation-delay-600 {
          animation-delay: 600ms;
        }
        
        .animation-delay-700 {
          animation-delay: 700ms;
        }
      `}</style>
    </div>
  );
};

export default Landing;
