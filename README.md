# Centeric Solutions — Technology Academy Platform

Full-stack web application for **Centeric Solutions**, a technology academy offering practical, industry-shaped courses. Built with React (Vite) on the frontend and Express.js + PostgreSQL on the backend.

## Tech Stack

**Frontend:** React 19, React Router 7, Vite, Lucide React, CSS (custom, responsive)

**Backend:** Express 4, PostgreSQL, express-session + connect-pg-simple, bcryptjs, nodemailer, multer

## Features

### Public Website
- Homepage with hero carousel, featured courses, testimonials, trust bar
- Course catalog with detail pages and enrollment form
- Instructor profiles with social links
- Blog with pagination, excerpts, and dynamic image placement
- Testimonials page with expandable quotes
- Contact form, FAQ accordion, About page
- Authentication: login, registration with OTP verification (email/SMS), forgot password
- Split-screen page transition animations

### Admin Dashboard (`/admin`)
- **Dashboard** — Overview with pending counts and quick stats
- **Courses** — Create, edit, delete; mark featured; publish notifications
- **Instructors** — Manage profiles, stats, social links
- **Blog** — Write/edit posts with excerpt and image placement options
- **Testimonials** — Manage student reviews, mark featured
- **Students** — View registered students and course enrollments
- **Messages** — Contact form inbox with read/unread status
- **Heroes** — Configure hero carousel slides per page
- **About** — Edit mission, vision, values, team members
- **FAQ** — Manage questions and answers
- **Settings** — Site-wide configuration (name, tagline, branding, SEO, analytics, social links, feature toggles)

### Notifications
- **Admin:** Bell icon with dropdown shows unread messages, pending enrollments, unpublished posts — polls every 15s
- **Student:** In-app notifications when new blog posts, courses, or testimonials are published — polls every 30s

### Dynamic Branding
Branding colors (primary, secondary, accent) are stored as `site_settings` and applied via CSS custom properties (`--primary`, `--secondary`, `--accent`). Change them in **Settings → Branding** and they propagate site-wide.

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+

### Setup

```bash
# 1. Clone and install dependencies
cd server && npm install
cd .. && npm install

# 2. Configure environment
cp server/.env.example server/.env
# Edit server/.env with your DB credentials

# 3. Create database and run schema
cd server && node src/setup-db.js

# 4. Seed initial data (admin user, courses, instructors, etc.)
node src/seed.js

# 5. Start development
# Terminal 1 — Backend
cd server && npm run dev

# Terminal 2 — Frontend
cd .. && npm run dev
```

The frontend runs on `http://localhost:5173` and the API on `http://localhost:4000`.

### Default Admin Login
- **Email:** `admin@centericsolutions.com`
- **Password:** `admin123`

## Project Structure

```
├── src/                    # Frontend React app
│   ├── components/         # Reusable UI components
│   ├── context/            # React context providers
│   ├── data/               # Static/mock data files
│   ├── pages/              # Page-level components
│   │   └── admin/          # Admin dashboard pages
│   ├── utils/              # Utility functions
│   ├── api.js              # API client
│   └── App.jsx             # Root with routing
├── server/                 # Express backend
│   └── src/
│       ├── routes/         # API route handlers
│       ├── middleware/      # Auth, rate limiting, idle timeout
│       ├── services/       # Email, SMS, notifications
│       ├── app.js          # Express app setup
│       └── server.js       # Entry point (port 4000)
├── database/
│   ├── schema.sql          # Full PostgreSQL schema
│   └── migrations/         # Incremental migrations
└── Database Handler/       # Table-to-feature reference docs
```

## Database

20 tables including `users`, `courses`, `instructors`, `blog_posts`, `testimonials`, `enrollments`, `students`, `hero_pages`, `hero_slides`, `about_*`, `faqs`, `site_settings`, `notifications`, and `sessions`. See `database/schema.sql` for the full schema.

## API Routes

| Prefix | Description |
|---|---|
| `/api/auth` | Login, register, OTP, profile, password |
| `/api/courses` | Course CRUD |
| `/api/instructors` | Instructor CRUD |
| `/api/blog` | Blog post CRUD |
| `/api/testimonials` | Testimonial CRUD |
| `/api/messages` | Contact messages |
| `/api/students` | Student CRUD |
| `/api/enrollments` | Course enrollments |
| `/api/heroes` | Hero pages & slides |
| `/api/about` | About page, values, team |
| `/api/faqs` | FAQ CRUD |
| `/api/settings` | Site settings CRUD |
| `/api/notifications` | Student notifications |
| `/api/admin/notifications` | Admin notification counts |
| `/api/upload` | File uploads |

## Scripts

| Script | Directory | Description |
|---|---|---|
| `npm run dev` | root | Vite frontend dev server |
| `npm run build` | root | Production frontend build |
| `npm run dev` | server | Backend with auto-restart |
| `npm run start` | server | Production backend start |
| `npm run db:migrate` | server | Run schema migration |
| `npm run lint` | root | Oxlint static analysis |
