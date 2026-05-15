<p align="center">
  <img src="https://img.shields.io/badge/Node.js-20+-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-Strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind" />
</p>

# 📸 SnapBooth

> A modern, production-ready **web-based photobooth** platform — designed for kiosk deployments at events, exhibitions, and interactive installations.

SnapBooth provides an end-to-end digital photobooth experience: from live camera capture with countdown timers, through template-based layout customization and CSS filters, all the way to direct printing via IPP protocol and instant sharing through WhatsApp.

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [1. Clone the Repository](#1-clone-the-repository)
  - [2. Backend Setup](#2-backend-setup)
  - [3. Frontend Setup](#3-frontend-setup)
- [Environment Variables](#environment-variables)
- [Database Schema](#database-schema)
- [API Documentation](#api-documentation)
- [Application Flow](#application-flow)
- [Available Scripts](#available-scripts)
- [Deployment Notes](#deployment-notes)
- [License](#license)

---

## Overview

SnapBooth is a **monorepo** consisting of two independent applications:

| Component | Directory | Description |
|-----------|-----------|-------------|
| **Backend API** | `snapbooth-backend/` | Express.js REST API with PostgreSQL, Prisma ORM, Cloudinary storage, IPP printing, and WhatsApp integration |
| **Frontend App** | `snapbooth-frontend/` | Next.js 16 (App Router) interface optimized for touchscreen kiosks, with Zustand state management and `html2canvas` rendering |

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    User Device                          │
│              (Tablet / Desktop Kiosk)                   │
│                                                         │
│  ┌───────────┐  ┌──────────┐  ┌───────────┐            │
│  │  Camera    │  │ Template │  │  Result   │            │
│  │  Capture   │→ │  Editor  │→ │  Screen   │            │
│  │(getUserMedia)│ │ (Canvas) │  │(QR/Print) │            │
│  └───────────┘  └──────────┘  └─────┬─────┘            │
└──────────────────────────────────────┼──────────────────┘
                                       │
                          HTTP REST API │
                                       ▼
┌─────────────────────────────────────────────────────────┐
│                  Backend Server                         │
│               (Express.js + TypeScript)                 │
│                                                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───────────┐  │
│  │   Auth   │ │ Sessions │ │  Photos  │ │ Templates │  │
│  │  (JWT)   │ │  Module  │ │ (Upload) │ │ & Filters │  │
│  └──────────┘ └──────────┘ └──────────┘ └───────────┘  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                │
│  │  Print   │ │ WhatsApp │ │  Admin   │                │
│  │  (IPP)   │ │ (Fonnte) │ │ (CRUD)  │                │
│  └──────────┘ └──────────┘ └──────────┘                │
│                       │                                 │
│              ┌────────┴────────┐                        │
│              ▼                 ▼                        │
│        ┌──────────┐    ┌─────────────┐                  │
│        │PostgreSQL│    │ Cloudinary  │                  │
│        │  (Data)  │    │  (Storage)  │                  │
│        └──────────┘    └─────────────┘                  │
└─────────────────────────────────────────────────────────┘
```

---

## Tech Stack

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js 20+ | Runtime environment |
| Express.js 5 | HTTP framework |
| TypeScript (Strict) | Language |
| Prisma | ORM & database migrations |
| PostgreSQL | Relational database |
| JWT + bcrypt | Authentication & password hashing |
| Cloudinary | Cloud-based image storage |
| Sharp | Server-side image processing (resize for print) |
| node-cron | Scheduled cleanup jobs |
| Zod | Runtime schema validation |
| IPP Protocol | Network printer communication |
| Fonnte API | WhatsApp message delivery |
| Helmet / CORS / Rate Limit | Security middleware |

### Frontend
| Technology | Purpose |
|------------|---------|
| Next.js 16 (App Router) | React framework with file-based routing |
| TypeScript | Language |
| Tailwind CSS 4 | Utility-first styling |
| Zustand | Lightweight state management |
| html2canvas | DOM-to-image rendering for final composites |
| qrcode.react | QR code generation |
| Lucide React | Icon library |

---

## Project Structure

```
cbp-rupiah-photobooth/
├── snapbooth-backend/
│   ├── prisma/
│   │   ├── schema.prisma          # Database models & relations
│   │   └── seed.ts                # Default admin, filters, templates
│   ├── src/
│   │   ├── config/                # Database, Cloudinary, Env, Printer
│   │   ├── middleware/            # Auth, Admin guard, Upload, Rate limiter
│   │   ├── modules/
│   │   │   ├── auth/              # Login, Logout, Me, Change password
│   │   │   ├── sessions/          # Session lifecycle management
│   │   │   ├── photos/            # Upload, retake, filter application
│   │   │   ├── templates/         # CRUD for layout templates
│   │   │   ├── filters/           # CRUD for CSS photo filters
│   │   │   ├── print/             # IPP printing integration
│   │   │   ├── whatsapp/          # wa.me link + Fonnte API
│   │   │   └── admin/             # Analytics, sessions list, config
│   │   ├── jobs/                  # Scheduled cleanup (monthly)
│   │   ├── utils/                 # Response helpers, logger, image utils
│   │   ├── types/                 # TypeScript interfaces
│   │   ├── app.ts                 # Express app configuration
│   │   └── server.ts              # Server entry point
│   ├── .env.example
│   └── package.json
│
├── snapbooth-frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx           # Home / Landing screen
│   │   │   ├── capture/page.tsx   # Camera capture with countdown
│   │   │   ├── edit/page.tsx      # Template & filter editor
│   │   │   └── result/page.tsx    # QR code, print, WhatsApp share
│   │   ├── components/
│   │   │   └── templates/         # TemplateClassic, Polaroid, Editorial
│   │   ├── store/
│   │   │   └── useBoothStore.ts   # Zustand global state
│   │   ├── hooks/
│   │   │   └── useCamera.ts       # getUserMedia custom hook
│   │   └── utils/
│   │       └── renderImage.ts     # html2canvas wrapper
│   └── package.json
│
├── openapi.yaml                   # Swagger/OpenAPI spec
└── README.md
```

---

## Prerequisites

Ensure the following are installed on your system before proceeding:

- **Node.js** ≥ 20.x — [Download](https://nodejs.org/)
- **npm** ≥ 10.x (bundled with Node.js)
- **PostgreSQL** ≥ 14.x — [Download](https://www.postgresql.org/download/)
- **Git** — [Download](https://git-scm.com/)

Optional (for full feature set):
- A [Cloudinary](https://cloudinary.com/) account (free tier works)
- A [Fonnte](https://fonnte.com/) API key (for WhatsApp delivery)
- A network printer with IPP support

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/muhammadazharr/cbp-rupiah-photobooth.git
cd cbp-rupiah-photobooth
```

### 2. Backend Setup

```bash
cd snapbooth-backend

# Install dependencies
npm install

# Copy environment template and configure
cp .env.example .env
```

Edit `.env` with your actual credentials:

```env
PORT=5050
DATABASE_URL=postgresql://your_user@localhost:5432/snapbooth
JWT_SECRET=your_secure_random_string
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

> **⚠️ macOS Users:** Port `5000` is reserved by AirPlay Receiver. Use `5050` or another free port.

Create and seed the database:

```bash
# Create the PostgreSQL database (if not exists)
createdb snapbooth

# Run Prisma migrations
npx prisma migrate dev --name init

# Generate Prisma client
npx prisma generate

# Seed default data (admin, filters, templates)
npm run db:seed
```

Start the development server:

```bash
npm run dev
```

The API will be available at `http://localhost:5050`. Interactive API docs (Swagger) are at `http://localhost:5050/api-docs`.

**Default admin credentials:**
| Field | Value |
|-------|-------|
| Username | `admin` |
| Password | `admin123` |

### 3. Frontend Setup

Open a **new terminal**:

```bash
cd snapbooth-frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will be available at `http://localhost:3000`.

> **Tip:** For best results, open the frontend in Chrome and allow camera access when prompted.

---

## Environment Variables

All backend configuration is managed via environment variables. See `snapbooth-backend/.env.example` for the complete reference:

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | No | Server port (default: `5000`) |
| `NODE_ENV` | No | `development` / `production` / `test` |
| `DATABASE_URL` | **Yes** | PostgreSQL connection string |
| `JWT_SECRET` | **Yes** | Secret key for signing JWT tokens |
| `JWT_EXPIRES_IN` | No | Token expiry duration (default: `8h`) |
| `CLOUDINARY_CLOUD_NAME` | **Yes** | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | **Yes** | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | **Yes** | Cloudinary API secret |
| `FONNTE_API_KEY` | No | Fonnte API key for WhatsApp auto-send |
| `PRINTER_IP` | **Yes** | Network printer IP address |
| `PRINTER_PORT` | No | Printer port (default: `631`) |
| `ALLOWED_ORIGIN` | No | CORS origin for frontend (default: `http://localhost:3000`) |

---

## Database Schema

The application uses **7 models** with full relational integrity:

```
Admin ──────────────────────────────────────────
AppConfig ──────────────────────────────────────
Template ──── 1:N ──── Session ──── 1:N ──── Photo
                          │                    │
                          │                    └── N:1 ── Filter
                          ├──── 1:N ──── Print
                          └──── 1:N ──── WhatsappSend
```

Key enums: `SessionStatus` (IN_PROGRESS, COMPLETED, EXPIRED), `PrintStatus` (PENDING, PRINTING, SUCCESS, FAILED), `WhatsappStatus` (PENDING, SENT, FAILED).

Use Prisma Studio to visually inspect your data:

```bash
cd snapbooth-backend
npm run db:studio
```

---

## API Documentation

Once the backend is running, visit the **Swagger UI** at:

```
http://localhost:5050/api-docs
```

### Key Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth/login` | — | Authenticate admin, receive JWT |
| `POST` | `/api/sessions` | — | Create a new photobooth session |
| `GET` | `/api/sessions/:id` | — | Get session details with photos |
| `PATCH` | `/api/sessions/:id/complete` | — | Mark session as completed |
| `POST` | `/api/photos/upload` | — | Upload a photo (multipart) |
| `PATCH` | `/api/photos/:id/retake` | — | Retake a photo (max 3 retakes) |
| `PATCH` | `/api/photos/:id/filter` | — | Apply a filter to a photo |
| `GET` | `/api/templates` | — | List active templates |
| `GET` | `/api/filters` | — | List active filters |
| `POST` | `/api/print` | — | Send session to printer |
| `POST` | `/api/whatsapp/send` | — | Generate WA link & auto-send |
| `GET` | `/api/admin/analytics` | Admin | Dashboard analytics |
| `GET` | `/api/admin/sessions` | Admin | Paginated session history |

---

## Application Flow

The frontend guides users through a 4-step photobooth experience:

### Step 1 — Home Screen
Clean landing page with a prominent **"START 📸"** call-to-action button and glassmorphism effects over a soft pink gradient background.

### Step 2 — Camera Capture
- Full-screen camera view using the `getUserMedia` API
- Rule-of-thirds grid overlay for composition guidance
- **3-second countdown timer** before each shot
- White flash effect on capture
- Sequential capture of **4 photos** with thumbnail indicators
- Auto-navigates to the editor when all 4 shots are taken

### Step 3 — Template Editor
- Live preview of selected template with all 4 photos
- **3 layout options:** Classic Strip, Polaroid Grid, The Daily Paper (editorial)
- **3 filter options:** Normal, B&W Classic, Vintage 90s
- Real-time preview updates as selections change
- **"Finish & Save"** renders the entire template to a high-res JPEG via `html2canvas`

### Step 4 — Result Screen
- Display the final composite image
- **QR Code** for smartphone download
- **WhatsApp sharing** with phone number input
- **Browser print** or backend IPP print integration
- **"Finish"** button to reset state and return home

---

## Available Scripts

### Backend (`snapbooth-backend/`)

| Script | Command | Description |
|--------|---------|-------------|
| Development | `npm run dev` | Start with hot-reload (ts-node-dev) |
| Build | `npm run build` | Compile TypeScript to `dist/` |
| Production | `npm start` | Run compiled output |
| Migrate | `npm run db:migrate` | Run Prisma migrations |
| Generate | `npm run db:generate` | Regenerate Prisma client |
| Seed | `npm run db:seed` | Populate default data |
| Studio | `npm run db:studio` | Open Prisma visual editor |

### Frontend (`snapbooth-frontend/`)

| Script | Command | Description |
|--------|---------|-------------|
| Development | `npm run dev` | Start Next.js dev server |
| Build | `npm run build` | Create production build |
| Production | `npm start` | Serve production build |
| Lint | `npm run lint` | Run ESLint |

---

## Deployment Notes

### Production Checklist

- [ ] Set `NODE_ENV=production` in backend `.env`
- [ ] Use a strong, randomly generated `JWT_SECRET` (`openssl rand -base64 32`)
- [ ] Configure Cloudinary with a dedicated upload preset
- [ ] Set `ALLOWED_ORIGIN` to your production frontend URL
- [ ] Run `npm run build` in both `snapbooth-backend` and `snapbooth-frontend`
- [ ] Use a process manager (PM2, systemd) for the backend
- [ ] Set up HTTPS via reverse proxy (nginx, Caddy)
- [ ] Configure PostgreSQL with connection pooling for high traffic

### Kiosk Mode Tips

For a dedicated kiosk deployment on a tablet or touchscreen monitor:

```bash
# Chrome kiosk mode (Linux/macOS)
google-chrome --kiosk --disable-translate --no-first-run http://localhost:3000

# Or use Chromium
chromium --kiosk --disable-features=TranslateUI http://localhost:3000
```

---

## License

This project is developed for internal use. All rights reserved.

---

<p align="center">
  <sub>Built with ❤️ for interactive event experiences</sub>
</p>
