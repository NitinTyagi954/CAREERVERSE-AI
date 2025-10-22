# 🎨 Jobs Component - Architecture Diagram

## System Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                        USER BROWSER                              │
│                    http://localhost:3002                         │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Landing Page                        Jobs Page (/jobs)           │
│  ┌──────────────────────────┐      ┌──────────────────────────┐ │
│  │ Hero Section             │      │ Search Bar               │ │
│  │ Features Section:        │      │ Filter Panel             │ │
│  │ ┌────────────────────┐   │      │ ┌────────────────────┐   │ │
│  │ │ For Job Seekers    │   │      │ │ 5 Job Cards:       │   │ │
│  │ │ - Resume Analysis  │   │      │ │ 1. Internshala 1   │   │ │
│  │ │ - Smart Recs       │   │      │ │ 2. Internshala 2   │   │ │
│  │ │                    │   │      │ │ 3. LinkedIn 1      │   │ │
│  │ │ [Explore Jobs] ←──────────────┤ │ 4. LinkedIn 2      │   │ │
│  │ └────────────────────┘   │      │ │ 5. Indeed 1        │   │ │
│  └──────────────────────────┘      │ └────────────────────┘   │ │
│                                     │ [< Pagination >]         │ │
│                                     └──────────────────────────┘ │
│                                              ↑                    │
│                                    GET /api/jobs                  │
│                                         (JSON)                    │
└──────────────────────────────────────────────────────────────────┘
                                    ↕
                          (HTTP over Network)
                                    ↕
┌──────────────────────────────────────────────────────────────────┐
│                    EXPRESS.JS BACKEND                            │
│                  http://localhost:5000                           │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  job.controller.js                                               │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ getJobs(req, res)                                        │  │
│  │ ├─ Extract query params                                  │  │
│  │ ├─ Call externalJobFetcher.fetchAllPlatforms()          │  │
│  │ ├─ Paginate results (skip, limit)                       │  │
│  │ └─ Return { success: true, data: { jobs: [...] } }     │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              ↓                                   │
│  externalJobFetcher.service.js                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ fetchAllPlatforms(filters)                               │  │
│  │ ├─ Check cache (1-hour TTL)                              │  │
│  │ ├─ If cached: Return cached data                         │  │
│  │ └─ Else:                                                 │  │
│  │    ├─ fetchFromInternshala() → 2 jobs                   │  │
│  │    ├─ fetchFromLinkedIn() → 2 jobs                      │  │
│  │    └─ fetchFromIndeed() → 1 job                         │  │
│  │       └─ Aggregate all (5 jobs)                          │  │
│  │       └─ Filter by search query                          │  │
│  │       └─ Filter by salary, type, remote                 │  │
│  │       └─ Sort by date (newest first)                    │  │
│  │       └─ Cache result                                   │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  Database (MongoDB)                                              │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ User collection (for login/profile)                      │  │
│  │ Resume collection (for stored resumes)                   │  │
│  │ Job collection (NOT USED - using external APIs)         │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
                                    ↑
                        External Job Platforms
                        (Currently Mocked)
┌──────────────────────────────────────────────────────────────────┐
│                     EXTERNAL PLATFORMS                           │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Internshala              LinkedIn              Indeed           │
│  ┌─────────────────┐   ┌─────────────────┐   ┌────────────────┐ │
│  │ • Backend Dev   │   │ • Senior Backend│   │ • Data Science │ │
│  │ • UI/UX Designer│   │ • Frontend Dev  │   │                │ │
│  └─────────────────┘   └─────────────────┘   └────────────────┘ │
│  (Mock data)           (Mock data)           (Mock data)         │
│                                                                  │
│  Future: Real API integrations                                  │
│  • LinkedIn Jobs API (with OAuth)                               │
│  • Internshala API (if available, else scraping)                │
│  • Indeed Publisher API                                         │
│  • Naukri.com (web scraping)                                    │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## Data Flow Sequence Diagram

```
┌─────────────────┐         ┌──────────────────────────┐
│  USER BROWSER   │         │   BACKEND SERVER         │
│                 │         │                          │
│ Landing Page    │         │ job.controller.js        │
└────────┬────────┘         └──────────────┬───────────┘
         │                                 │
         │ 1. Click "Explore Jobs"         │
         │                                 │
         │ 2. navigate('/jobs')            │
         ├─────────────────────────────────┤
         │ 3. Jobs.jsx mounts              │
         │    useEffect fires              │
         │                                 │
         │ 4. fetchJobs()                  │
         │    🎯 Console: "mounted"        │
         │                                 │
         │ 5. GET /api/jobs────────────────┼────────────→
         │    🔍 Console: "called with {}" │
         │                                 │
         │                                 │ 6. getJobs() executed
         │                                 │    ├─ Extract params
         │                                 │    ├─ Call aggregator
         │                                 │    ├─ Paginate
         │                                 │    └─ Format response
         │                                 │
         │                       ┌─────────▼──────┐
         │                       │ externalFetcher│
         │                       │                │
         │                       │ Aggregate:     │
         │                       │ • Internshala  │
         │                       │ • LinkedIn     │
         │                       │ • Indeed       │
         │                       │ = 5 jobs       │
         │                       └─────────┬──────┘
         │                                 │
         │ 7. ← JSON Response              │
         │    { success: true, data: {...}}│
         │    🔍 Console: "received"       │
         │                                 │
         │ 8. setJobs([5 jobs])            │
         │    📋 Console: "count: 5"       │
         │                                 │
         │ 9. Re-render Jobs.jsx           │
         │    🎬 Console: "rendering 5"    │
         │                                 │
         │ 10. map() job cards             │
         │                                 │
         │ 11. User sees 5 jobs ✅         │
         │                                 │
```

---

## Component Hierarchy

```
App.jsx (Root)
│
├─ Provider: AuthProvider
│
├─ Provider: JobProvider
│   │
│   ├─ Route: "/" → Landing
│   │   │
│   │   └─ Landing.jsx
│   │       ├─ Hero Section
│   │       ├─ Features Section
│   │       │   └─ "Explore Jobs" Button ← USER CLICKS
│   │       ├─ Testimonials
│   │       └─ Footer
│   │
│   ├─ Route: "/jobs" → Container
│   │   │
│   │   └─ Jobs.jsx (462 lines)
│   │       ├─ useJobs() ← Pulls from JobContext
│   │       ├─ Search Component
│   │       ├─ Filter Panel
│   │       ├─ Jobs List
│   │       │   └─ map(job) → Job Card × 5
│   │       │       ├─ Job Title + Badge
│   │       │       ├─ Company + Location
│   │       │       ├─ Description
│   │       │       ├─ Tags
│   │       │       ├─ Salary
│   │       │       └─ Buttons (Apply, Save)
│   │       └─ Pagination
│   │
│   ├─ Route: "/freelancer" → FreelancerHub
│   │   └─ (Similar structure as Jobs)
│   │
│   └─ Route: "/dashboard" → Dashboard
│       └─ (Future: Personalized recommendations)
│
└─ Navbar (sticky header)
```

---

## State Management Flow

```
JobContext (React Context API)
│
├─ State:
│  ├─ jobs: [] ← Set by fetchJobs()
│  ├─ loading: false ← During API call
│  ├─ error: null ← If API fails
│  ├─ filters: {minSalary: 30000, ...}
│  └─ jobsPagination: {page: 1, totalPages: 1, ...}
│
├─ Functions:
│  ├─ fetchJobs(searchParams) ← Called from Jobs.jsx
│  │   ├─ Set loading: true
│  │   ├─ Call jobAPI.getJobs(searchParams)
│  │   ├─ Parse response.data.data
│  │   ├─ setJobs(response.jobs)
│  │   ├─ setJobsPagination(response.pagination)
│  │   └─ Set loading: false
│  │
│  ├─ updateFilters(newFilters) ← Called from Jobs.jsx
│  │
│  └─ goToJobPage(pageNum) ← Called from Jobs.jsx
│
└─ Consumers:
   └─ Jobs.jsx
       ├─ const { jobs, loading, error, fetchJobs } = useJobs()
       ├─ useEffect(() => { fetchJobs() }, [])
       └─ Render jobs array
```

---

## API Request/Response Format

```
REQUEST:
═════════════════════════════════════════════════════════════
Method: GET
URL: http://localhost:5000/api/jobs
Query Parameters:
  ?q=developer              (search by title/company/skills)
  &minSalary=50000          (filter minimum salary)
  &jobType=full-time        (filter job type)
  &remote=true              (filter remote only)
  &page=1                   (pagination)
  &limit=20                 (items per page)

Headers:
  Content-Type: application/json
  Authorization: Bearer [token] (if authenticated)


RESPONSE:
═════════════════════════════════════════════════════════════
Status: 200 OK
Body:
{
  "success": true,
  "data": {
    "jobs": [
      {
        "id": "internshala_1",
        "title": "Full Stack Developer Internship",
        "company": "TechStartup Inc",
        "description": "Build scalable web applications...",
        "salaryMin": 15000,
        "salaryMax": 25000,
        "salaryCurrency": "INR",
        "remote": true,
        "jobType": "internship",
        "tags": ["node.js", "react", "javascript", "mongodb"],
        "reputationScore": 7,
        "url": "https://internshala.com/...",
        "source": "internshala",
        "location": {
          "city": "Bangalore",
          "state": "Karnataka",
          "country": "India"
        },
        "postedAt": "2025-10-20T08:30:00Z"
      },
      ... 4 more jobs ...
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 1,
      "totalJobs": 5,
      "hasNext": false,
      "hasPrev": false,
      "limit": 20
    }
  }
}
```

---

## File Structure

```
CareerVerse/
├── client/
│   └── src/
│       ├── pages/
│       │   ├── Landing.jsx        [Has "Explore Jobs" button]
│       │   ├── Jobs.jsx           [462 lines, job listing page]
│       │   └── ...
│       ├── contexts/
│       │   ├── JobContext.jsx     [State management + API calls]
│       │   └── AuthContext.jsx
│       └── services/
│           └── api.js             [Axios client, jobAPI.getJobs()]
│
├── server/
│   ├── controllers/
│   │   └── job.controller.js      [GET /api/jobs endpoint]
│   ├── services/
│   │   └── externalJobFetcher.service.js [259 lines, aggregator]
│   └── models/
│       └── Job.js                 [Schema for DB, not used]
│
└── Documentation/
    ├── JOBS_QUICK_REFERENCE.md
    ├── JOBS_COMPONENT_GUIDE.md
    ├── JOBS_VISUAL_GUIDE.md
    ├── JOBS_IMPLEMENTATION_COMPLETE.md
    └── JOBS_READY_FOR_TESTING.md
```

---

## Network Layer

```
Browser (React App)
  │
  │ HTTP/HTTPS
  │
  ▼
http://localhost:3002 (Vite Dev Server)
  │
  │ Serves index.html, CSS, JS
  │ Handles Client-side Routing (/jobs)
  │
  │ When user clicks "Apply" or "Save":
  │ API Call to Backend
  │
  ▼
http://localhost:5000 (Express Backend)
  │
  ├─ GET /api/jobs          ← Jobs listing
  ├─ GET /api/gigs          ← Freelance gigs
  ├─ POST /auth/login        ← User authentication
  ├─ POST /resume/upload     ← Resume upload
  └─ ... other endpoints
  │
  ▼
MongoDB (Port 27017)
  │
  ├─ Collection: users
  ├─ Collection: resumes
  ├─ Collection: jobs (not used for external data)
  └─ Collection: applications
```

---

## Caching Strategy

```
External Fetcher Cache:
═══════════════════════════════════════════
Input: Filter object (JSON string)
  ├─ Example: '{"minSalary": 30000, "q": "developer"}'
  │
  └─ Generate cache key: JSON.stringify(filters)
     │
     └─ Check if key exists in Map
        ├─ If YES & not expired (< 1 hour):
        │   └─ Return cached data immediately
        │       (No API calls to external platforms)
        │
        └─ If NO or expired:
            ├─ Fetch from all platforms
            ├─ Filter and sort results
            ├─ Store in cache with timestamp
            └─ Return fresh data
               (TTL: 1 hour = 3600000 ms)

Benefits:
• Reduced latency on repeat requests
• Fewer calls to external APIs (future)
• Better performance under load
• Configurable expiration (can change TTL)
```

---

## Error Handling Flow

```
Jobs.jsx fetches jobs
    │
    ├─ SUCCESS (HTTP 200)
    │  └─ Parse response
    │     ├─ Set jobs array
    │     ├─ Set pagination
    │     └─ Render job cards
    │
    └─ ERROR (Network/API)
       ├─ Catch error
       ├─ Set error message
       ├─ Display error banner (red box)
       ├─ Show "Try Again" button
       └─ User can retry manually

Backend Error Handling:
├─ If API call fails → Return empty jobs array
├─ If DB error → Return error message
├─ If invalid params → Parse gracefully
└─ Response always includes:
   {
     "success": true/false,
     "data": {
       "jobs": [],
       "pagination": {...}
     }
   }
```

---

## Performance Optimization

```
Frontend Optimizations:
├─ Debounced Search (500ms delay)
│   └─ Prevents excessive API calls while typing
├─ Lazy Loading (pagination)
│   └─ Only loads 20 jobs per page
├─ React memoization (job cards)
│   └─ Re-render only changed jobs
└─ CSS optimization
    └─ Tailwind CSS with purge

Backend Optimizations:
├─ In-memory Cache (1-hour TTL)
│   └─ Avoid repeated aggregation
├─ Pagination on sorted results
│   └─ Only process needed data
├─ Async/await with Promise.all()
│   └─ Parallel platform fetching
└─ Request validation
    └─ Fail fast on bad params

Network Optimizations:
├─ JSON compression
├─ Request timeout (10s)
├─ Connection pooling
└─ CDN-ready structure
```

---

## Testing Points

```
Frontend Testing:
├─ Navigation flow (Landing → Jobs)
├─ API call success/failure
├─ Rendering 5 job cards
├─ Search functionality
├─ Filter changes
├─ Pagination buttons
├─ Loading state
├─ Error state
└─ Empty state

Backend Testing:
├─ Endpoint responds (200 status)
├─ Returns 5 jobs from 3 platforms
├─ Applies filters correctly
├─ Paginates results
├─ Caches properly
├─ Handles errors gracefully
└─ Response format valid

Integration Testing:
├─ Click → API call → Display
├─ Search → Filter → Display
├─ Pagination → Fetch → Display
└─ Error → Retry → Success
```

---

**Architecture Last Updated**: October 22, 2025  
**Status**: 🟢 Ready for Production Testing
