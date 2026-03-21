# Jobbify 🚀

> Backend for a modern job board platform with smart hiring tools.

[![Node.js](https://img.shields.io/badge/Node.js-18.x-green)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-lightgrey)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.x-brightgreen)](https://www.mongodb.com/)
[![Redis](https://img.shields.io/badge/Redis-7.x-red)](https://redis.io/)
[![License](https://img.shields.io/badge/License-MIT-blue)](LICENSE)

---

## 📖 Overview

**Jobbify** is a production-ready backend for a modern job board platform. It allows recruiters to post and manage job listings while applicants can search, filter, and apply seamlessly. Built with clean architecture, smart caching, real-time aggregation, and secure authentication — the way real-world backends are built.

---

## ✨ Features

- 🔐 **JWT Authentication** — Register, login, refresh tokens with role-based access control (`recruiter` / `applicant`)
- 📋 **Job Management** — Full CRUD for job listings with status, salary range, tags, and location
- 🔍 **Full-Text Search** — MongoDB text indexes for searching by title and description
- 📊 **Aggregation Pipelines** — Real-time job statistics (avg salary by location, count by tag) using `$group`, `$facet`, `$lookup`
- ⚡ **Redis Caching** — Cache-aside pattern with TTL-based invalidation for high-read endpoints
- 🛡️ **Rate Limiting** — Per-route rate limiting backed by Redis (strict on auth, relaxed on reads)
- 📄 **Cursor Pagination** — Scalable cursor-based pagination using `createdAt + _id` — no `skip()` performance cliff
- 📁 **File Upload** — Resume upload via Multer with MIME type validation (PDF only, max 2MB)
- 🗂️ **MongoDB Indexing** — Compound indexes, text indexes, and sort-optimized indexes
- 🧱 **Clean Architecture** — Modular folder structure with separated routers, controllers, services, and models

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js 18+ |
| Framework | Express.js |
| Database | MongoDB + Mongoose |
| Cache / Rate Limit | Redis + ioredis |
| Authentication | JWT + bcrypt |
| File Upload | Multer |
| Validation | express-validator |
| Environment | dotenv |

---

## 📁 Folder Structure

```
jobbify/
├── src/
│   ├── config/
│   │   ├── db.js              # MongoDB connection
│   │   ├── redis.js           # Redis client setup
│   │   └── env.js             # Environment variable validation
│   ├── middleware/
│   │   ├── auth.js            # JWT verify + role guard
│   │   ├── rateLimit.js       # Rate limiter configurations
│   │   ├── cache.js           # Redis cache middleware
│   │   ├── upload.js          # Multer config + MIME validation
│   │   └── errorHandler.js    # Global error handler
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.router.js
│   │   │   ├── auth.controller.js
│   │   │   └── auth.service.js
│   │   ├── jobs/
│   │   │   ├── job.router.js
│   │   │   ├── job.controller.js
│   │   │   ├── job.service.js
│   │   │   └── job.model.js
│   │   └── upload/
│   │       ├── upload.router.js
│   │       └── upload.controller.js
│   ├── utils/
│   │   ├── ApiError.js        # Custom error class
│   │   ├── asyncHandler.js    # Async error wrapper
│   │   └── paginate.js        # Cursor pagination helper
│   └── app.js                 # Express app setup
├── uploads/                   # Uploaded resumes (local)
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB 7+
- Redis 7+

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/jobbify.git
cd jobbify

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
```

### Environment Variables

```env
# App
PORT=5000
NODE_ENV=development

# MongoDB
MONGO_URI=mongodb://localhost:27017/jobbify

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRES_IN=7d

# File Upload
MAX_FILE_SIZE_MB=2
UPLOAD_PATH=./uploads
```

### Run the Server

```bash
# Development (with nodemon)
npm run dev

# Production
npm start
```

Server runs at `http://localhost:5000`

---

## 📡 API Reference

All routes are prefixed with `/api/v1`.

### Auth

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/auth/register` | Public | Register a new user |
| POST | `/auth/login` | Public | Login and get tokens |
| POST | `/auth/refresh` | Public | Refresh access token |
| GET | `/auth/me` | Private | Get current user |

### Jobs

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/jobs` | Public | List jobs with filters + cursor pagination |
| GET | `/jobs/:id` | Public | Get a single job (cached) |
| POST | `/jobs` | Recruiter | Create a new job listing |
| PATCH | `/jobs/:id` | Recruiter | Update a job listing |
| DELETE | `/jobs/:id` | Recruiter | Delete a job listing |
| GET | `/jobs/stats` | Public | Aggregated stats (cached) |
| GET | `/jobs/search` | Public | Full-text search with facets |

### Upload

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/upload/resume` | Applicant | Upload resume (PDF, max 2MB) |

---

## 🔍 API Response Format

All responses follow a consistent shape:

```json
{
  "success": true,
  "message": "Jobs fetched successfully",
  "data": [],
  "pagination": {
    "nextCursor": "abc123",
    "total": 245
  }
}
```

Error responses:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "field": "salary.min", "message": "Must be a positive number" }
  ]
}
```

---

## 🗄️ Database Indexes

```js
// Compound index — filters by location + status
jobSchema.index({ location: 1, status: 1 });

// Full-text search on title and description
jobSchema.index({ title: 'text', description: 'text' });

// Sort optimization — latest jobs first
jobSchema.index({ createdAt: -1 });

// Cursor pagination support
jobSchema.index({ createdAt: -1, _id: -1 });
```

---

## ⚡ Caching Strategy

Jobbify uses the **cache-aside pattern** with Redis:

- `GET /jobs/:id` — cached for **60 seconds**, invalidated on update/delete
- `GET /jobs/stats` — cached for **300 seconds**, invalidated on any job write
- Cache key format: `jobbify:jobs:<id>`, `jobbify:stats`

---

## 🛡️ Rate Limiting

| Route Group | Window | Max Requests |
|---|---|---|
| Auth (login/register) | 15 min | 10 |
| General API | 15 min | 100 |
| File Upload | 15 min | 20 |

---

## 📊 Aggregation Pipeline Example

```js
// GET /jobs/stats — salary stats + job count by location
db.jobs.aggregate([
  { $match: { status: 'open' } },
  {
    $group: {
      _id: '$location',
      avgSalary: { $avg: '$salary.max' },
      jobCount: { $sum: 1 }
    }
  },
  { $sort: { jobCount: -1 } },
  { $limit: 10 }
]);
```

---

## 📄 Pagination Example

```
GET /api/v1/jobs?limit=10&cursor=eyJjcmVhdGVkQXQiOi4uLn0=
```

Response includes `nextCursor` for the next page. No `skip()` used — scales to millions of documents.

---

## 🤝 Contributing

1. Fork the repo
2. Create your branch: `git checkout -b feat/your-feature`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push to the branch: `git push origin feat/your-feature`
5. Open a pull request

---

## 📝 License

This project is licensed under the [MIT License](LICENSE).

---

<p align="center">Built with ❤️ by <strong>Jobbify</strong></p>
