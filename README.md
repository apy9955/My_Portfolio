# Aman Kumar — Developer & Systems Portfolio

A full-stack, cinematic developer portfolio featuring an interactive 3D Solar System, realistic 3D Celestial Knowledge Universe constellation, APY Terminal (verified knowledge graph & NLP), and a secure Node.js/SQLite backend.

---

## Architecture & Technology Stack

- **Frontend:** React 19, TypeScript, Vite 7, Tailwind CSS v4, Framer Motion, Lucide Icons.
- **3D Graphics & Shaders:** Three.js, React Three Fiber, React Three Drei (custom procedural star shaders and particle systems).
- **Backend & APIs:** Express 5, Node.js v22+ native `node:sqlite` database, CORS, rate limiting, and input sanitization.
- **Persistence:** Local SQLite database (`data/portfolio.db`) with WAL mode, parameterized queries, and native `VACUUM INTO` snapshot backups.
- **Security:** HMAC-SHA256 authenticated admin sessions, constant-time credential comparison, brute-force lockout, anonymized IP hashing, and security headers.

---

## Quick Start

### 1. Development Mode
Runs both the React client and the backend API on `http://localhost:5173`:
```bash
npm install
npm run dev
```

### 2. Production Build
Type-checks the codebase, builds the production bundle, and generates static route entry points:
```bash
npm run build
```

### 3. Production Backend Server
Runs the standalone production server serving static assets and API routes:
```bash
npm run server
```

---

## API Endpoints Reference

| Method | Endpoint | Access | Description |
|---|---|:---:|---|
| `GET` | `/api/health` | Public | System status, node version, and database connectivity. |
| `GET` | `/api/projects` | Public | Custom projects and featured GitHub repository metadata. |
| `GET` | `/api/github/stats` | Public | Real-time GitHub statistics, follower count, and contribution graph. |
| `POST` | `/api/contact` | Public (Rate-limited) | Validated contact form submission with SQLite persistence and optional SMTP email dispatch. |
| `POST` | `/api/terminal/query` | Public (Rate-limited) | Natural language query processor grounded in verified academic and project data. |
| `GET` | `/api/universe/graph` | Public | Dynamic 3D celestial graph nodes and links (`?cluster=...&tier=...`). |
| `POST` | `/api/admin/login` | Public (Brute-force protected) | Authenticates admin credentials and returns an HMAC-SHA256 session token. |
| `GET` | `/api/admin/verify` | Admin | Validates an active admin session token. |
| `GET` | `/api/contact/messages` | Admin | Retrieves visitor contact messages from the database. |
| `POST` | `/api/admin/backup` | Admin | Generates a point-in-time SQLite snapshot backup in `data/backups/`. |

---

## Environment Configuration

Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Key configuration options:
- `PORT`: Standalone backend port (default: `3001`).
- `ADMIN_USERNAME` & `ADMIN_PASSWORD`: Admin login credentials.
- `ADMIN_SECRET`: 32-byte secret for signing session tokens.
- `ADMIN_API_KEY`: Optional static API key for CLI access (`X-Admin-Key` header).
- `ALLOWED_ORIGINS`: Comma-separated list of allowed CORS origins.
- `GITHUB_TOKEN`: Personal Access Token to raise GitHub API rate limits.
- `SMTP_*`: Optional mail server credentials to receive real-time email notifications for incoming contact inquiries.

---

## SQLite Persistence & Deployment Guide

The portfolio uses an embedded SQLite database stored in `data/portfolio.db`.
- **Persistent Platforms (Recommended):** Deploy with a persistent disk/volume on VPS (Ubuntu/Debian), Docker, Fly.io (`fly volumes create`), Railway, or Render with disk storage.
- **Serverless / Ephemeral Hosting:** If deploying purely static frontend to Vercel/Netlify, client-side fallback continues to work seamlessly with cached snapshots and direct email draft capability.
