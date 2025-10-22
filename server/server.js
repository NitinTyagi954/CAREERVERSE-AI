require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
// Import middleware
const { errorMiddleware, notFoundMiddleware } = require('./middleware/error.middleware');

// Import routes
const authRoutes = require('./routes/auth.routes');
const resumeRoutes = require('./routes/resume.routes');
const jobRoutes = require('./routes/job.routes');
const freelanceRoutes = require('./routes/freelance.routes');

const app = express();

// Trust proxy for deployment platforms
app.set('trust proxy', 1);

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.CLIENT_URL 
    : ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Create uploads directory if it doesn't exist
const uploadDir = process.env.UPLOAD_DIR || './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'CareerVerse AI Backend is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API documentation endpoint
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'CareerVerse AI API Documentation',
    version: '1.0.0',
    endpoints: {
      auth: {
        'POST /api/auth/register': 'Register a new user',
        'POST /api/auth/login': 'Login user',
        'GET /api/auth/profile': 'Get user profile',
        'PUT /api/auth/profile': 'Update user profile'
      },
      resume: {
        'POST /api/resume/upload': 'Upload and parse resume',
        'GET /api/resume': 'Get user resumes',
        'GET /api/resume/:id': 'Get specific resume',
        'DELETE /api/resume/:id': 'Delete resume'
      },
      jobs: {
        'GET /api/jobs': 'Get job listings with filters',
        'GET /api/jobs/:id': 'Get specific job'
      },
      gigs: {
        'GET /api/gigs': 'Get freelance gigs with filters',
        'GET /api/gigs/:id': 'Get specific gig'
      }
    },
    timestamp: new Date().toISOString()
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/gigs', freelanceRoutes);

// Serve static files from uploads directory (for development)
if (process.env.NODE_ENV === 'development') {
  app.use('/uploads', express.static(uploadDir));
}

// 404 handler for undefined routes
app.use(notFoundMiddleware);

// Global error handler
app.use(errorMiddleware);

// MongoDB connection
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/careerverse';
    
    await mongoose.connect(mongoURI);

    console.log('✅ MongoDB connected successfully');
    // Indexes are created via Mongoose schema definitions where applicable
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Handle MongoDB connection events
mongoose.connection.on('disconnected', () => {
  console.log('⚠️ MongoDB disconnected');
});

mongoose.connection.on('error', (error) => {
  console.error('❌ MongoDB error:', error);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down server...');
  await mongoose.connection.close();
  console.log('✅ MongoDB connection closed');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Shutting down server...');
  await mongoose.connection.close();
  console.log('✅ MongoDB connection closed');
  process.exit(0);
});

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/health`);
      console.log(`📚 API docs: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();

module.exports = app;
