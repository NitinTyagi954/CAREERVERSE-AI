# CareerVerse AI Backend

A comprehensive MERN stack backend for CareerVerse AI - an AI-assisted job & freelance discovery platform.

## 🚀 Features

- **User Authentication**: JWT-based authentication with secure password hashing
- **Resume Parsing**: Extract skills, education, and experience from PDF/DOCX files
- **Job Matching**: AI-powered job matching with explainable scoring
- **Freelance Hub**: Curated gig listings with filtering capabilities
- **Application Drafts**: Pre-filled application forms for quick submissions
- **RESTful API**: Clean, documented API endpoints
- **File Upload**: Secure file handling with validation
- **Database**: MongoDB with Mongoose ODM
- **Testing**: Jest test suite with MongoDB memory server
- **Docker**: Containerized deployment with Docker Compose

## 🛠 Tech Stack

- **Runtime**: Node.js 20+
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT + bcrypt
- **File Processing**: pdf-parse, mammoth
- **File Upload**: Multer
- **Validation**: Joi
- **Testing**: Jest + Supertest
- **Containerization**: Docker + Docker Compose

## 📋 Prerequisites

- Node.js 20+ 
- MongoDB 7.0+
- Docker & Docker Compose (optional)

## 🚀 Quick Start

### Option 1: Docker Compose (Recommended)

```bash
# Clone the repository
git clone <repository-url>
cd careerverse/server

# Copy environment file
cp env.example .env

# Start services
docker-compose up --build

# The server will be available at http://localhost:5000
# MongoDB will be available at mongodb://localhost:27017
# MongoDB Express UI at http://localhost:8081 (admin/admin123)
```

### Option 2: Local Development

```bash
# Install dependencies
npm install

# Copy environment file
cp env.example .env

# Start MongoDB (make sure MongoDB is running)
# On Windows: Start MongoDB service
# On macOS: brew services start mongodb-community
# On Linux: sudo systemctl start mongod

# Start development server
npm run dev

# The server will be available at http://localhost:5000
```

## 🔧 Environment Variables

Create a `.env` file in the server directory:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/careerverse
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
UPLOAD_DIR=./uploads
MIN_STIPEND=30000
USE_OPENAI=false
OPENAI_API_KEY=optional_openai_key_here
NODE_ENV=development
ADMIN_EMAILS=admin@careerverse.com,test@careerverse.com
```

## 📚 API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/preferences` - Update user preferences (protected)
- `PUT /api/auth/profile` - Update user profile (protected)
- `DELETE /api/auth/profile` - Deactivate account (protected)

### Resume Endpoints

- `POST /api/resume/upload` - Upload and parse resume (protected)
- `GET /api/resume` - Get user's resumes (protected)
- `GET /api/resume/:id` - Get specific resume (protected)
- `PUT /api/resume/:id` - Update resume data (protected)
- `DELETE /api/resume/:id` - Delete resume (protected)
- `GET /api/resume/stats` - Get resume statistics (protected)

### Job Endpoints

- `GET /api/jobs` - Get jobs with filtering
- `GET /api/jobs/:id` - Get job details
- `GET /api/jobs/stats` - Get job statistics
- `POST /api/jobs/search-by-skills` - Search jobs by skills (protected)
- `POST /api/jobs/seed` - Seed sample jobs (admin only)

### Matching Endpoints

- `POST /api/match` - Get job matches for resume (protected)
- `POST /api/match/recommendations` - Get job recommendations by skills (protected)
- `POST /api/match/companies` - Get top companies for resume (protected)
- `GET /api/match/stats` - Get match statistics (protected)

### Freelance Endpoints

- `GET /api/gigs` - Get freelance gigs with filtering
- `GET /api/gigs/:id` - Get gig details
- `GET /api/gigs/stats` - Get gig statistics
- `POST /api/gigs/search-by-skills` - Search gigs by skills (protected)
- `POST /api/gigs/seed` - Seed sample gigs (admin only)

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm test -- --coverage
```

## 🔍 Linting

```bash
# Check for linting errors
npm run lint

# Fix linting errors
npm run lint:fix
```

## 📊 Database Seeding

```bash
# Seed sample jobs and gigs
npm run seed

# Or use the API endpoints (admin only)
curl -X POST http://localhost:5000/api/jobs/seed \
  -H "Authorization: Bearer <admin-token>"

curl -X POST http://localhost:5000/api/gigs/seed \
  -H "Authorization: Bearer <admin-token>"
```

## 🏗 Project Structure

```
server/
├── controllers/          # Request handlers
│   ├── auth.controller.js
│   ├── resume.controller.js
│   ├── job.controller.js
│   ├── match.controller.js
│   └── freelance.controller.js
├── routes/              # API routes
│   ├── auth.routes.js
│   ├── resume.routes.js
│   ├── job.routes.js
│   ├── match.routes.js
│   └── freelance.routes.js
├── models/              # Mongoose schemas
│   ├── User.js
│   ├── Resume.js
│   ├── Job.js
│   ├── Gig.js
│   └── ApplicationDraft.js
├── services/            # Business logic
│   ├── auth.service.js
│   ├── resumeParser.service.js
│   ├── file.service.js
│   └── match.service.js
├── middleware/          # Express middleware
│   ├── auth.middleware.js
│   └── error.middleware.js
├── utils/               # Utility files
│   ├── skills.json
│   ├── reputation-companies.json
│   ├── sample-jobs.json
│   ├── sample-gigs.json
│   └── validators.js
├── tests/               # Test files
├── uploads/             # File upload directory
├── server.js            # Main server file
├── package.json
├── Dockerfile
└── docker-compose.yml
```

## 🔐 Security Features

- Password hashing with bcrypt
- JWT token authentication
- File upload validation
- Input sanitization and validation
- CORS configuration
- Rate limiting ready
- SQL injection protection (MongoDB)
- XSS protection

## 📈 Performance Features

- Database indexing
- Pagination for large datasets
- File size limits
- Memory-efficient file processing
- Connection pooling
- Error handling and logging

## 🚀 Deployment

### Docker Deployment

```bash
# Build production image
docker build -t careerverse-backend .

# Run with environment variables
docker run -p 5000:5000 \
  -e MONGO_URI=mongodb://your-mongo-host:27017/careerverse \
  -e JWT_SECRET=your-production-secret \
  careerverse-backend
```

### Environment-Specific Configuration

- **Development**: Hot reloading, detailed error messages
- **Production**: Optimized performance, security headers
- **Testing**: In-memory database, isolated test environment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support, email support@careerverse.com or create an issue in the repository.

## 🔄 API Response Format

All API responses follow this format:

```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message"
}
```

Error responses:

```json
{
  "success": false,
  "message": "Error message",
  "errors": ["Detailed error messages"]
}
```

## 📊 Health Check

Check if the server is running:

```bash
curl http://localhost:5000/health
```

Response:
```json
{
  "success": true,
  "message": "CareerVerse AI Backend is running",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "environment": "development"
}
```



