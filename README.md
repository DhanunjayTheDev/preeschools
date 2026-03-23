# KOHSHA ACADEMY — Complete Preschool Management System

A production-grade preschool management system with an Apple-level user website, admin dashboard, and Express.js backend.

## Architecture

```
kohsha-system/
├── client/     → User Website (Next.js 14, Three.js, Framer Motion)
├── admin/      → Admin Panel  (Next.js 14, Shadcn-style UI)
└── server/     → Backend API  (Express.js, MongoDB, JWT, Multer)
```

## Tech Stack

| Layer    | Technologies |
|----------|-------------|
| Frontend | Next.js 14, React 18, TailwindCSS, Framer Motion, Three.js, React Three Fiber, GSAP, Lenis |
| Admin    | Next.js 14, TailwindCSS, React Hook Form, Zod, Lucide Icons |
| Backend  | Node.js, Express.js, MongoDB, Mongoose, JWT, Multer, Helmet |

## Quick Start

### 1. Backend Server

```bash
cd server
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm install
node seed.js          # Seeds admin user + programs
npm run dev           # Runs on http://localhost:5000
```

Default admin credentials:
- Email: `admin@kohsha.com`
- Password: `kohsha2024`

### 2. Client Website

```bash
cd client
npm install
npm run dev           # Runs on http://localhost:3000
```

### 3. Admin Panel

```bash
cd admin
npm install
npm run dev           # Runs on http://localhost:3001
```

## API Endpoints

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/admin/login` | No | Admin login |
| POST | `/api/admin/register` | No | Admin register |
| GET | `/api/admin/profile` | Yes | Get admin profile |
| POST | `/api/admissions` | No | Submit admission |
| GET | `/api/admissions` | Yes | List all admissions |
| GET | `/api/admissions/stats` | Yes | Admission statistics |
| PATCH | `/api/admissions/:id` | Yes | Update admission |
| DELETE | `/api/admissions/:id` | Yes | Delete admission |
| GET | `/api/programs` | No | List programs |
| POST | `/api/programs` | Yes | Create program |
| PATCH | `/api/programs/:id` | Yes | Update program |
| GET | `/api/gallery` | No | List gallery images |
| POST | `/api/gallery/upload` | Yes | Upload image |
| DELETE | `/api/gallery/:id` | Yes | Delete image |
| GET | `/api/testimonials` | No | List testimonials |
| POST | `/api/testimonials` | Yes | Create testimonial |
| PATCH | `/api/testimonials/:id` | Yes | Update testimonial |
| DELETE | `/api/testimonials/:id` | Yes | Delete testimonial |

## Features

### User Website
- 3D animated hero with playground (Three.js)
- Programs with real-time pricing from API
- Masonry gallery with lightbox and category filters
- Admission form with confetti animation
- Smooth scroll (Lenis), page transitions (Framer Motion)
- Scroll progress bar, floating background shapes
- Full SEO with OpenGraph tags
- Responsive design (mobile-first)

### Admin Panel
- JWT-authenticated dashboard
- Admission management (approve/reject/delete)
- Program pricing management
- Gallery image upload with Multer
- Testimonial CRUD
- Overview stats dashboard

### Security
- JWT authentication with bcrypt password hashing
- Helmet security headers
- Rate limiting (100 req/15min)
- Input validation (express-validator)
- CORS configuration
- File type + size validation for uploads

## Deployment

| Service | Target |
|---------|--------|
| Client | Vercel |
| Admin | Vercel |
| Server | Render / Railway / AWS |
| Database | MongoDB Atlas |

Set environment variables on each platform accordingly.