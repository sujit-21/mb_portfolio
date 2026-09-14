# Manish — Video Editor Portfolio (MERN Stack)

A cinematic, modern, full-stack video editor portfolio built with **React (Vite)**, **Node.js (Express)**, and **MongoDB**. Designed with high visual polish, bespoke dark-mode typography, smooth micro-interactions, an integrated video showreel modal, and a content management drawer.

---

## 🎬 Features

- **Cinematic Aesthetics**: Dark luxury palette (`#0D0C0A`, Bebas Neue headline typography, warm cream and gold accents) tailored for creative video editors.
- **Dynamic Showreel & Video Modal**: High-definition video preview player with full playback control and custom modal animations.
- **Interactive Project Showcase**: Filterable portfolio grid supporting YouTube embeds, direct video links, and project metadata (category, duration, client, software tools).
- **Services & Offerings**: Comprehensive breakdown of post-production services (commercial editing, YouTube optimization, motion graphics, color grading, sound design).
- **Testimonials & Client Endorsements**: Social proof section featuring client feedback and credibility stats.
- **Inquiry & Contact Form**: Functional client contact workflow with database persistence and email alerts.
- **Admin Control Drawer**: Authenticated management interface to dynamically update profile details, stats, projects, and review inquiries.
- **Seed Scripts & Data Backup**: Automated seeding utilities for fast database bootstrapping.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Lucide Icons, Vanilla CSS with custom design tokens.
- **Backend**: Node.js, Express.js, CORS, JSON Web Tokens (JWT), Bcrypt.js.
- **Database**: MongoDB (Local or MongoDB Atlas) with Mongoose ODM.
- **Email Delivery**: Nodemailer (SMTP) & Resend API support.

---

## 📁 Project Structure

```
mb14_manish_portfolio/
├── client/                     # Vite + React Frontend
│   ├── src/
│   │   ├── components/         # Hero, Work, Services, Admin, Navbar, etc.
│   │   ├── config/             # API client endpoints
│   │   ├── App.jsx             # Main application layout
│   │   ├── index.css           # Global typography & styling
│   │   └── main.jsx
│   ├── .env.example            # Client env template
│   └── package.json
├── server/                     # Express Backend
│   ├── config/                 # Database connection (Mongoose)
│   ├── models/                 # Schemas (Project, Profile, Service, Admin, etc.)
│   ├── routes/                 # REST API endpoints
│   ├── scripts/                # Database seeding scripts
│   ├── server.js               # Express application entrypoint
│   ├── .env.example            # Server env template
│   └── package.json
├── portfolio_manish.html       # Standalone reference design
├── package.json                # Root package & concurrency scripts
└── README.md
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18 or higher
- **MongoDB**: Local MongoDB instance (Compass) or MongoDB Atlas connection string

### 2. Installation

Install all root, backend, and frontend dependencies:

```bash
npm run install:all
```

Or install manually:
```bash
npm install
cd server && npm install
cd ../client && npm install
cd ..
```

### 3. Environment Configuration

#### Backend (`server/.env`):
Create `server/.env` based on `server/.env.example`:
```bash
cp server/.env.example server/.env
```
Key variables:
- `PORT=5000`
- `MONGODB_URI=mongodb://127.0.0.1:27017/manish_portfolio_v2`
- `CLIENT_URL=http://localhost:5173`
- `ADMIN_USERNAME=admin`
- `ADMIN_PASSWORD=your_secure_password`
- `JWT_SECRET=your_jwt_secret`

#### Frontend (`client/.env`):
Create `client/.env` based on `client/.env.example`:
```bash
cp client/.env.example client/.env
```
Key variables:
- `VITE_API_BASE_URL=/api`

---

## ⚡ Running the Application

### Development Mode (Both Frontend & Backend)
Run concurrently with one command from the project root:
```bash
npm run dev
```
- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000/api](http://localhost:5000/api)

### Database Seeding
To populate the database with default projects, services, profile info, and admin credentials:
```bash
npm run seed
```

### Free Up Occupied Ports
If ports `5000` or `5173` are occupied by lingering processes:
```bash
npm run kill:ports
```

---

## 📄 License
ISC License. Built for Manish Video Editing Portfolio.
