# ♿ InclusiveHire — AI-Powered Inclusive Recruitment Platform

An AI-powered full-stack web platform that connects people with disabilities to compatible job opportunities, using NLP, OCR, and Speech technologies to ensure full accessibility and intelligent ability-based matching.

---

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the App](#running-the-app)
- [Environment Variables](#environment-variables)
- [System Architecture](#system-architecture)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [AI & Technology Layer](#ai--technology-layer)
- [Accessibility Features](#accessibility-features)
- [Authentication](#authentication)
- [Admin Dashboard](#admin-dashboard)
- [Project Structure](#project-structure)
- [Development Roadmap](#development-roadmap)
- [Future Scalability](#future-scalability)
- [Deployment](#deployment)
- [License](#license)

---

## 📌 Project Overview

**InclusiveHire** is a dual-portal recruitment platform designed to ethically and intelligently match candidates with disabilities to suitable job opportunities — not by exclusion, but through an **AI-powered compatibility scoring engine**.

| Portal | Target User | Core Features |
| :--- | :--- | :--- |
| 👤 Candidate Portal | Job seekers with disabilities | Accessible registration, CV upload & OCR, AI profile summary, job recommendations |
| 🏢 Employer Portal | Companies & recruiters | Post jobs, define physical/communication requirements, AI compatibility scoring, matched candidate dashboard |
| 🛡️ Admin Dashboard | Platform administrators | Manage users, jobs, applications, and platform data |

**Core value proposition:**
- Ability-Based Matching (not exclusion-based filtering)
- OCR-powered CV parsing with NLP skill extraction
- Text-to-Speech for blind users & Speech-to-Text for deaf users
- Full WCAG accessibility compliance (screen readers, keyboard navigation, high contrast)
- JWT + Passport.js secure authentication with role-based access control

---

## 🧰 Tech Stack

| Layer | Technology |
| :--- | :--- |
| Frontend | React.js + TypeScript + Vite |
| Styling | Tailwind CSS |
| Backend | Node.js + Express.js |
| Database | MongoDB Atlas + Mongoose |
| Authentication | JWT + Passport.js + bcryptjs |
| State Management | Redux Toolkit / Context API |
| HTTP Client | Axios |
| Runtime / Package Manager | Bun |
| OCR | Tesseract.js / Google Vision API |
| NLP | OpenAI API / SpaCy |
| Text-to-Speech | Google Text-to-Speech / Amazon Polly |
| Speech-to-Text | OpenAI Whisper / Google Speech-to-Text |
| File Uploads | Multer + Cloudinary |
| Environment Config | dotenv |
| Deployment | Vercel (FE) · Render (BE) · MongoDB Atlas (DB) |

**Backend dependencies (`package.json`):**
```json
{
  "express":       "^4.18.2",
  "mongoose":      "^7.5.0",
  "dotenv":        "^16.3.1",
  "jsonwebtoken":  "^9.0.2",
  "bcryptjs":      "^2.4.3",
  "passport":      "latest",
  "cors":          "^2.8.5",
  "cookie-parser": "^1.4.6",
  "multer":        "^1.4.5-lts.1",
  "tesseract.js":  "^4.0.0"
}
```

---

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (used as runtime & package manager)
- [Node.js](https://nodejs.org/) v18 or higher
- A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ZiadMohamedxx/Advanced-Web-Project.git
   cd Advanced-Web-Project
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

### Running the App

```bash
bun run dev
```

- Frontend: `http://localhost:5173`
- API Server: `http://localhost:5000`

---

## 🔐 Environment Variables

> ⚠️ The `.env` file is listed in `.gitignore` and is **never** committed to the repository.

**`.env` (project root):**
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/inclusivehire?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_minimum_32_chars
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173

# Cloudinary (CV & profile image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Google APIs
GOOGLE_TTS_API_KEY=your_google_tts_key
GOOGLE_STT_API_KEY=your_google_stt_key
GOOGLE_VISION_API_KEY=your_google_vision_key

# OpenAI (NLP + Whisper)
OPENAI_API_KEY=your_openai_key
```

---

## 🏗 System Architecture

```
[ User Browser ]
       │ HTTPS
       ▼
[ VERCEL — React SPA (TypeScript + Vite + Tailwind) ]
       │ REST + JWT (Axios)
       ▼
[ RENDER — Express API (Node.js + Passport.js) ]
       │
       ├──► [ Mongoose ] ──► [ MONGODB ATLAS ]
       │                       users | jobs | applications | ai_scores
       │
       ├──► [ OCR Service ]       Tesseract.js / Google Vision API
       ├──► [ NLP Service ]       OpenAI API / SpaCy
       ├──► [ TTS Service ]       Google Text-to-Speech / Amazon Polly
       └──► [ STT Service ]       OpenAI Whisper / Google Speech-to-Text
```

---

## 🗄️ Database Schema

### `users`
| Field | Type | Description |
| :--- | :--- | :--- |
| `_id` | ObjectId | Auto-generated primary key |
| `name` | String | Full name |
| `email` | String | Unique login identifier |
| `password` | String | bcrypt-hashed, never returned in queries |
| `role` | Enum | `'candidate'`, `'employer'`, `'admin'` |
| `avatar` | String | Profile image URL |
| `isActive` | Boolean | Soft-delete flag |
| `createdAt` / `updatedAt` | Date | Auto-managed timestamps |

### `candidates` (extends user)
| Field | Type | Description |
| :--- | :--- | :--- |
| `userId` | ObjectId | Ref → `User` |
| `disability_type` | String | Type of disability |
| `hearing_capability` | Enum | `'full'`, `'partial'`, `'none'` |
| `vision_capability` | Enum | `'full'`, `'partial'`, `'none'` |
| `mobility_capability` | Enum | `'full'`, `'partial'`, `'none'` |
| `assistive_tools` | Array | e.g. `['screen reader', 'hearing aid']` |
| `skills` | Array | Extracted from CV via OCR + NLP |
| `cv_url` | String | Uploaded CV file URL |
| `work_preference` | Enum | `'remote'`, `'onsite'`, `'hybrid'` |

### `jobs`
| Field | Type | Description |
| :--- | :--- | :--- |
| `_id` | ObjectId | Auto-generated primary key |
| `employer_id` | ObjectId | Ref → `User` |
| `title` | String | Job title |
| `description` | String | Job description |
| `communication_type` | Enum | `'verbal'`, `'written'`, `'none'` |
| `vision_dependency` | Enum | `'high'`, `'medium'`, `'low'`, `'none'` |
| `hearing_dependency` | Enum | `'high'`, `'medium'`, `'low'`, `'none'` |
| `mobility_requirement` | Enum | `'high'`, `'medium'`, `'low'`, `'none'` |
| `remote_possible` | Boolean | Whether remote work is available |
| `isActive` | Boolean | Job visibility flag |

### `applications`
| Field | Type | Description |
| :--- | :--- | :--- |
| `candidate_id` | ObjectId | Ref → `User` |
| `job_id` | ObjectId | Ref → `Job` |
| `compatibility_score` | Number | AI-calculated score (0–100%) |
| `status` | Enum | `'pending'`, `'reviewed'`, `'accepted'`, `'rejected'` |
| `appliedAt` | Date | Timestamp |

---

## 📡 API Endpoints

### Auth
| Method | Route | Access |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public |
| `POST` | `/api/auth/login` | Public |

### Candidates
| Method | Route | Access |
| :--- | :--- | :--- |
| `GET` | `/api/candidates/me` | Candidate |
| `PUT` | `/api/candidates/me` | Candidate |
| `POST` | `/api/candidates/upload-cv` | Candidate |
| `GET` | `/api/candidates` | Admin |

### Jobs
| Method | Route | Access |
| :--- | :--- | :--- |
| `GET` | `/api/jobs` | Public |
| `GET` | `/api/jobs/:id` | Public |
| `POST` | `/api/jobs` | Employer |
| `PUT` | `/api/jobs/:id` | Employer |
| `DELETE` | `/api/jobs/:id` | Employer / Admin |

### Applications
| Method | Route | Access |
| :--- | :--- | :--- |
| `POST` | `/api/applications` | Candidate |
| `GET` | `/api/applications/my` | Candidate |
| `GET` | `/api/applications/job/:jobId` | Employer |
| `PUT` | `/api/applications/:id/status` | Employer |
| `GET` | `/api/applications` | Admin |

### AI Services
| Method | Route | Access |
| :--- | :--- | :--- |
| `POST` | `/api/ai/ocr` | Candidate |
| `POST` | `/api/ai/match/:jobId` | Candidate |
| `POST` | `/api/ai/tts` | Candidate |
| `POST` | `/api/ai/stt` | Candidate |

---

## 🤖 AI & Technology Layer

### 1. AI Matching Engine
Calculates a **compatibility score (0–100%)** between a candidate's ability profile and a job's requirements. Starts with rule-based logic, upgradeable to an ML classification model.

### 2. OCR — CV Analyzer
- Candidate uploads CV (PDF or image)
- **Tesseract.js / Google Vision API** extracts raw text
- **OpenAI NLP / SpaCy** parses skills, experience, and education
- Structured profile is auto-generated

### 3. Text-to-Speech *(for blind/visually impaired users)*
- Any page content can be read aloud
- Powered by **Google Text-to-Speech** or **Amazon Polly**

### 4. Speech-to-Text *(for deaf/hard-of-hearing users)*
- Voice input converted to text across forms and search
- Powered by **OpenAI Whisper** or **Google Speech-to-Text**

---

## ♿ Accessibility Features

| Feature | Detail |
| :--- | :--- |
| High Contrast Mode | Toggle for visually impaired users |
| Screen Reader Support | Full ARIA labels on all components |
| Keyboard Navigation | All interactions reachable without a mouse |
| Voice Navigation | Navigate the platform by voice command |
| Text-to-Speech | Any content read aloud on demand |
| Speech-to-Text | Fill forms by speaking |
| Video Subtitles | All video content has captions |
| Font Resize | Adjustable text size controls |

---

## 🔑 Authentication

**Flow:** `Register → Select Role → Login → JWT Issued → Passport.js Middleware → Role-Based Route Access`

| Security Measure | Detail |
| :--- | :--- |
| Password Hashing | bcryptjs, salt round 12 |
| Auth Strategy | Passport.js (Local + JWT strategies) |
| JWT Signing | Strong secret from `.env` |
| Token Expiry | 7 days (configurable) |
| `select: false` | Password never returned in queries |
| Role Guard | Middleware enforced per role: `candidate`, `employer`, `admin` |
| CORS | Restricted to `CLIENT_URL` only |

---

## 🖥️ Admin Dashboard

| Route | Features |
| :--- | :--- |
| `/admin` | Platform stats: users, jobs, applications, match scores |
| `/admin/users` | View all users, change role, activate/deactivate, delete |
| `/admin/jobs` | View and moderate all job postings |
| `/admin/applications` | View all applications and AI scores |

---

## 📁 Project Structure

```
Advanced-Web-Project/
├── Controllers/
│   ├── authController.js
│   ├── userController.js
│   ├── candidateController.js
│   ├── jobController.js
│   ├── applicationController.js
│   └── aiController.js
├── Middleware/
│   ├── authMiddleware.js
│   └── errorMiddleware.js
├── Models/
│   ├── User.js
│   ├── Candidate.js
│   ├── Job.js
│   └── Application.js
├── Routers/
│   ├── authRoutes.js
│   ├── candidateRoutes.js
│   ├── jobRoutes.js
│   ├── applicationRoutes.js
│   └── aiRoutes.js
├── src/                             # React + TypeScript frontend
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── AccessibilityBar.tsx
│   │   ├── AdminRoute.tsx
│   │   └── ProtectedRoute.tsx
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Login.tsx / Register.tsx
│   │   ├── candidate/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Profile.tsx
│   │   │   ├── UploadCV.tsx
│   │   │   └── JobRecommendations.tsx
│   │   ├── employer/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── PostJob.tsx
│   │   │   └── CandidateMatches.tsx
│   │   └── admin/
│   │       ├── Dashboard.tsx
│   │       ├── ManageUsers.tsx
│   │       ├── ManageJobs.tsx
│   │       └── ManageApplications.tsx
│   ├── redux/
│   │   ├── store.ts
│   │   └── authSlice.ts
│   ├── services/api.ts
│   └── App.tsx
├── public/
├── uploads/
├── utils/
├── database.js
├── passport.js
├── index.js
├── index.html
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── .env
├── .gitignore
└── README.md
```

---

## 📅 Development Roadmap

| Phase | Goal | Status |
| :--- | :--- | :--- |
| Phase 1 | Auth system, two portals, job posting & applying | ✅ Done |
| Phase 2 | Ability fields + rule-based compatibility scoring | ✅ Done |
| Phase 3 | CV upload + OCR text extraction + NLP skill parsing | ✅ Done |
| Phase 4 | Text-to-Speech + Speech-to-Text API integration | ✅ Done |
| Phase 5 | AI enhancements, recommendation system, NLP improvements | 🔄 In Progress |

---

## 💡 Future Scalability

- 🏛️ Government disability verification integration
- 🏆 Inclusive employer certification badge system
- 🤖 AI mock interview assistant with speech analysis
- 🌐 Real-time sign language avatar
- 🕵️ Anonymous application option for privacy
- 🌍 Multi-language support

---

## ☁️ Deployment

### MongoDB Atlas
1. Create a free cluster at [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Create a database user and whitelist IPs
3. Copy the connection string → set as `MONGO_URI` in `.env`





## ⚖️ Ethical Considerations

- This platform uses **ability-based compatibility scoring**, never exclusion-based discrimination.
- All candidate disability data is handled with strict privacy protection.
- Employers are guided toward inclusive job definitions.
- Platform is compliant with accessibility standards (WCAG 2.1).

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---


