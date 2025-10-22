# CareerVerse AI - Complete Architecture

## **User Journey**

```
1. ONBOARDING
   ├─ User lands on Landing page (modern hero)
   ├─ User clicks "Sign Up" or "Explore Jobs"
   ├─ User creates account (email/password)
   └─ User uploads resume (PDF/DOCX)

2. RESUME PARSING & SKILL EXTRACTION
   ├─ Backend receives resume file
   ├─ Parse PDF/DOCX → extract text
   ├─ NLP/AI extracts:
   │  ├─ Skills (React, Node.js, Python, etc.)
   │  ├─ Experience years
   │  ├─ Job titles
   │  ├─ Company names
   │  └─ Education
   └─ Store parsed data in user profile

3. BROWSING ACTIVE JOBS
   ├─ User navigates to /jobs page
   ├─ Frontend shows list of job platforms:
   │  ├─ LinkedIn Jobs
   │  ├─ Internshala
   │  ├─ Indeed
   │  ├─ Naukri
   │  ├─ Monster
   │  └─ Other platforms
   └─ Default: Show jobs from ALL platforms

4. FILTERING & SEARCHING
   ├─ User applies filters:
   │  ├─ Salary range (min-max)
   │  ├─ Job role (Developer, Designer, etc.)
   │  ├─ Experience level (Fresher, Junior, Senior)
   │  ├─ Location (Remote, On-site, Hybrid)
   │  ├─ Job type (Full-time, Part-time, Contract)
   │  └─ Platform (specific or all)
   ├─ User searches keywords (skill-based or free text)
   └─ Frontend sends query to backend

5. BACKEND JOB AGGREGATION
   ├─ Backend receives filter request
   ├─ Query external APIs:
   │  ├─ LinkedIn Jobs API
   │  ├─ Internshala API
   │  ├─ Indeed API
   │  ├─ Naukri API
   │  └─ Others
   ├─ Normalize results (consistent format)
   ├─ Apply filters server-side
   ├─ Cache results (1 hour TTL)
   └─ Return paginated results (20 per page)

6. DISPLAYING RESULTS
   ├─ Frontend receives jobs array
   ├─ Show:
   │  ├─ Job title
   │  ├─ Company name
   │  ├─ Salary (if available)
   │  ├─ Location
   │  ├─ Job type
   │  ├─ Required skills
   │  ├─ Platform badge (LinkedIn, Indeed, etc.)
   │  └─ Apply & Save buttons
   ├─ Sort by: Relevance, Date, Salary
   └─ Pagination: Next/Previous

7. JOB APPLICATION
   ├─ User clicks "Apply Now"
   ├─ Frontend shows application form (optional pre-fill from resume)
   ├─ User submits application
   ├─ Backend:
   │  ├─ Stores application in DB
   │  ├─ Gets job link from external platform
   │  ├─ Opens job in new tab OR
   │  ├─ Auto-fills form if API supports it
   │  └─ Logs application for tracking
   └─ Frontend shows success message

8. JOB MATCHING (AI)
   ├─ Backend compares:
   │  ├─ Resume skills vs Job requirements
   │  ├─ Experience vs Job experience level
   │  ├─ Salary expectations vs Job salary
   │  └─ Location preference vs Job location
   ├─ Calculate match score (0-100%)
   ├─ Rank jobs by match score
   └─ Show best-fit jobs first

9. SAVED JOBS & DASHBOARD
   ├─ User can save favorite jobs
   ├─ Dashboard shows:
   │  ├─ Recently viewed jobs
   │  ├─ Saved jobs
   │  ├─ Applied jobs history
   │  └─ Application status
   └─ User can revisit later
```

---

## **System Architecture**

```
┌─────────────────────────────────────────────────────────────┐
│                      FRONTEND (React)                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Landing.jsx ──┐                                           │
│                ├──→ Navbar.jsx (sticky header)             │
│  Login.jsx ────┤                                           │
│  Register.jsx ─┤                                           │
│  Jobs.jsx ─────┼──→ [Search] [Filters] [Results]           │
│  Freelancer.jsx─┤   Pagination | Sort                      │
│  Dashboard.jsx ─┤                                           │
│  UploadResume.jsx                                          │
│                                                             │
│  Context: AuthContext, JobContext                          │
│  API: jobAPI.getJobs(filters)                              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
         ↓ (HTTP/REST via Axios)
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND (Express.js)                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Routes:                                                    │
│  GET /api/jobs ──→ job.controller.getJobs()               │
│  GET /api/gigs ──→ freelance.controller.getGigs()         │
│  POST /api/match ──→ match.controller.getMatches()        │
│                                                             │
│  Services (Internal):                                      │
│  ├─ externalJobFetcher.service.js                         │
│  │  ├─ fetchFromLinkedIn(filters)                         │
│  │  ├─ fetchFromInternshala(filters)                      │
│  │  ├─ fetchFromIndeed(filters)                           │
│  │  ├─ fetchAllPlatforms(filters)                         │
│  │  └─ Cache results (1 hour TTL)                         │
│  │                                                         │
│  ├─ resumeParser.service.js                               │
│  │  ├─ parseResume(file)                                  │
│  │  └─ Extract skills, experience, etc.                   │
│  │                                                         │
│  └─ match.service.js                                      │
│     ├─ calculateMatchScore(resume, job)                   │
│     └─ Rank jobs by relevance                             │
│                                                             │
│  Models:                                                    │
│  ├─ User (name, email, resume data)                        │
│  ├─ Resume (parsed skills, experience)                     │
│  ├─ Application (job applied, status)                      │
│  ├─ Job (MongoDB - seeded for demo)                        │
│  └─ Gig (MongoDB - seeded for demo)                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
         ↓ (Direct API calls)
┌─────────────────────────────────────────────────────────────┐
│            EXTERNAL PLATFORMS (Job Sources)                 │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  LinkedIn Jobs API ──────┐                                 │
│  Internshala API ────────┼──→ Backend fetches              │
│  Indeed API ─────────────┤    Normalizes                   │
│  Naukri API ─────────────┤    Returns                      │
│  Monster API ────────────┘                                 │
│  Web scraping (if no API)                                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────────────────────┐
│                  DATABASE (MongoDB)                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Collections:                                               │
│  ├─ users                                                  │
│  ├─ resumes                                                │
│  ├─ applications                                           │
│  ├─ saved_jobs                                             │
│  ├─ jobs (seeded for demo)                                 │
│  └─ gigs (seeded for demo)                                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## **Data Flow Example: User Searches for Jobs**

```
User: Filters "Salary: 50k+, Role: Frontend Developer, Remote"
  ↓
Frontend: POST /api/jobs?salary=50000&role=frontend&remote=true
  ↓
Backend externalJobFetcher.fetchAllPlatforms():
  ├─ LinkedIn: search(frontend developer, salary >= 50k, remote)
  ├─ Internshala: search(frontend, location: remote)
  ├─ Indeed: search("frontend developer" filters)
  ├─ Naukri: search(frontend, remote, salary)
  └─ Merge + deduplicate + normalize
  ↓
Results:
[
  {
    id: "linkedin_1",
    title: "React Developer",
    company: "Google",
    salary: 80000,
    platform: "linkedin",
    url: "https://linkedin.com/...",
    ...
  },
  {
    id: "internshala_2",
    title: "Frontend Engineer",
    company: "Startup XYZ",
    salary: 60000,
    platform: "internshala",
    url: "https://internshala.com/...",
    ...
  },
  ...
]
  ↓
Frontend: Display results with pagination
  ↓
User: Click "Apply Now" → Opens job link in new tab
```

---

## **API Endpoints**

### **Public Routes**
```
GET  /api/jobs                      # Get aggregated jobs
GET  /api/jobs/stats                # Job statistics
POST /api/jobs/search-by-skills     # Search by resume skills

GET  /api/gigs                      # Get aggregated gigs
GET  /api/gigs/stats                # Gig statistics
POST /api/gigs/search-by-skills     # Search by resume skills
```

### **Auth Routes**
```
POST /api/auth/register             # Create account
POST /api/auth/login                # Login
GET  /api/auth/profile              # Get user profile
PUT  /api/auth/profile              # Update profile
```

### **Resume Routes**
```
POST /api/resume/upload             # Upload & parse resume
GET  /api/resume                    # Get user resumes
GET  /api/resume/:id                # Get specific resume
DELETE /api/resume/:id              # Delete resume
```

### **Match Routes**
```
GET  /api/match/:resumeId           # Get matched jobs
POST /api/match/:resumeId           # Calculate match scores
```

---

## **Filter Parameters**

```
Query Params:
├─ q: string                        # Search query (free text)
├─ salary: number                   # Min salary filter
├─ jobType: string                  # full-time, part-time, contract
├─ remote: boolean                  # Remote jobs only
├─ platform: string                 # linkedin, internshala, indeed, etc.
├─ role: string                     # Frontend, Backend, DevOps, etc.
├─ experience: number               # Years of experience
├─ location: string                 # City or country
├─ page: number                     # Pagination page (default: 1)
└─ limit: number                    # Results per page (default: 20)
```

---

## **Response Format**

```json
{
  "success": true,
  "data": {
    "jobs": [
      {
        "id": "job_123",
        "title": "Senior React Developer",
        "company": "Tech Corp",
        "description": "Build scalable web applications...",
        "salary": 120000,
        "salaryMax": 150000,
        "salaryCurrency": "INR",
        "remote": true,
        "jobType": "full-time",
        "location": {
          "city": "Bangalore",
          "state": "Karnataka",
          "country": "India"
        },
        "tags": ["react", "javascript", "node.js"],
        "platform": "linkedin",
        "url": "https://linkedin.com/jobs/...",
        "postedAt": "2024-10-20T10:00:00Z",
        "reputationScore": 9
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 50,
      "totalJobs": 987,
      "hasNext": true,
      "hasPrev": false,
      "limit": 20
    }
  }
}
```

---

## **Tech Stack Details**

### **Frontend**
- React 18
- React Router v6 (Client-side routing)
- Tailwind CSS (Styling)
- Lucide Icons
- Axios (HTTP client)
- React Hot Toast (Notifications)

### **Backend**
- Node.js v18+
- Express.js
- MongoDB + Mongoose
- JWT (Authentication)
- Multer (File uploads)
- PDF-Parse & Mammoth (Resume parsing)
- Nodemon (Dev server)

### **External APIs**
- LinkedIn Jobs API (OAuth required)
- Internshala API (if available)
- Indeed API (web scraping or official API)
- Naukri.com (web scraping)
- Others (as needed)

### **Deployment**
- Frontend: Vercel, Netlify
- Backend: Heroku, AWS, DigitalOcean
- Database: MongoDB Atlas (cloud)

---

## **Phase 1 (MVP) - Current**
✅ User auth
✅ Resume upload
🔧 Job aggregation from mock data
🔧 Job search & filters
❌ Real API integrations
❌ Smart matching
❌ Application tracking

## **Phase 2 - Extended**
- Real API integrations
- Resume skill extraction (NLP)
- Smart matching algorithm
- Application tracking
- Saved jobs
- User recommendations

## **Phase 3 - Advanced**
- Browser extension
- Mobile app
- AI-powered job recommendations
- Email notifications
- Interview prep tools
- Salary insights
