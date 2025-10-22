# 🚀 CareerVerse AI - Smart Career Platform

> AI-Powered Job Search, Resume Parsing, and Career Management Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.x-green.svg)](https://www.mongodb.com/)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

## 🌟 Overview

**CareerVerse AI** is a comprehensive career management platform that combines job search, freelance opportunities, AI-powered resume parsing, and intelligent job matching into one seamless application. It aggregates opportunities from multiple platforms (LinkedIn, Indeed, Internshala, Upwork, Fiverr) and provides smart recommendations based on your skills and experience.

### Problem We Solve

- ❌ Checking multiple job sites daily
- ❌ Manual resume formatting for each application
- ❌ No intelligent job matching
- ❌ Difficulty tracking applications
- ❌ Separate platforms for jobs vs freelance work

### Our Solution

- ✅ One platform for all job sources
- ✅ AI-powered resume parsing
- ✅ Smart job recommendations
- ✅ Centralized application tracking
- ✅ Jobs + Gigs in one place

## ✨ Features

### 🔍 Smart Job Search
- Browse jobs from LinkedIn, Indeed, Internshala
- Advanced filters (job type, remote, company type, platform)
- Real-time search with keyword matching
- Save jobs and quick apply functionality

### 💼 Freelancer Hub
- Gig marketplace (Fiverr, Upwork, Freelancer.com)
- Filter by skills, budget, duration
- Accept and save gig opportunities
- Project-based work discovery

### 🤖 AI Resume Parser (In Development)
- Upload PDF/DOCX resumes
- Automatic data extraction
- Profile auto-population
- Multiple resume management

### 🎯 Intelligent Matching (Planned)
- AI-powered job recommendations
- Compatibility scoring
- Skill gap analysis
- Personalized suggestions

### 📊 User Dashboard
- Activity overview
- Application tracking
- Analytics and insights
- Quick actions

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 18 with Vite
- **Routing:** React Router v6
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **HTTP Client:** Axios
- **Notifications:** react-hot-toast
- **State Management:** React Context API

### Backend
- **Runtime:** Node.js with Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT + bcrypt
- **File Upload:** Multer
- **Resume Parsing:** pdf-parse, mammoth
- **API Design:** RESTful

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (v6 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/NitinTyagi954/CAREERVERSE-AI.git
   cd CAREERVERSE-AI
   ```

2. **Install Backend Dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Set up Environment Variables**

   Create `.env` file in the `server` directory:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/careerverse
   JWT_SECRET=your_super_secret_jwt_key_here
   UPLOAD_DIR=./uploads
   NODE_ENV=development
   ```

5. **Start MongoDB**
   ```bash
   # Windows
   net start MongoDB
   
   # macOS/Linux
   sudo systemctl start mongod
   ```

6. **Start Backend Server**
   ```bash
   cd server
   npm start
   ```
   Server runs on `http://localhost:5000`

7. **Start Frontend Development Server**
   ```bash
   cd client
   npm run dev
   ```
   Frontend runs on `http://localhost:3001`

8. **Open in Browser**
   ```
   http://localhost:3001
   ```

### Quick Start (Development Mode)

```bash
# Terminal 1 - Backend
cd server && npm start

# Terminal 2 - Frontend
cd client && npm run dev
```

## 📁 Project Structure

```
CareerVerse/
├── client/                     # Frontend React Application
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   ├── contexts/          # React Context providers
│   │   ├── pages/             # Page components
│   │   ├── services/          # API services
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── server/                     # Backend Node.js Application
│   ├── controllers/           # Business logic
│   ├── middleware/            # Express middleware
│   ├── models/                # Mongoose schemas
│   ├── routes/                # API routes
│   ├── services/              # Business services
│   ├── server.js
│   └── package.json
│
└── README.md
```

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Public Endpoints

#### Jobs
```http
GET /api/jobs              # Get all jobs with filters
GET /api/jobs/:id          # Get specific job
```

#### Gigs
```http
GET /api/gigs              # Get all gigs with filters
GET /api/gigs/:id          # Get specific gig
```

### Authentication Endpoints
```http
POST /api/auth/register    # Register new user
POST /api/auth/login       # Login user
GET  /api/auth/profile     # Get user profile (requires token)
PUT  /api/auth/profile     # Update profile (requires token)
```

### Protected Endpoints

#### Resume
```http
POST   /api/resume/upload   # Upload resume (requires token)
GET    /api/resume          # Get user resumes (requires token)
GET    /api/resume/:id      # Get specific resume (requires token)
DELETE /api/resume/:id      # Delete resume (requires token)
```

## 🔒 Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT token authentication
- ✅ Input validation
- ✅ CORS protection
- ✅ MongoDB injection prevention
- ✅ XSS protection via React
- ✅ File upload validation

## 🗺️ Roadmap

### Phase 1 (Current) ✅
- [x] Job listings with search and filters
- [x] Freelance gig marketplace
- [x] User authentication system
- [x] Responsive UI design

### Phase 2 (In Progress) 🔧
- [ ] AI Resume Parser implementation
- [ ] Job matching algorithm
- [ ] Application tracking
- [ ] Dashboard enhancements

### Phase 3 (Planned) 📋
- [ ] Email notifications
- [ ] Advanced analytics
- [ ] Company profiles
- [ ] Salary insights

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👥 Authors

- **Nitin Tyagi** - [GitHub](https://github.com/NitinTyagi954)

## 📧 Contact

For questions or support, create an issue in this repository.

---

<div align="center">
  <p>Made with ❤️ by the CareerVerse Team</p>
  <p>⭐ Star this repo if you find it helpful!</p>
</div>
