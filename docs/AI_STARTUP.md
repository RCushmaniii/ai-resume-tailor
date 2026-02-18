# AI STARTUP

**File:** `docs/AI_STARTUP.md`
**Purpose:** Index of critical context. Read this first to orient yourself.

---

## 1. Project Identity

**Name:** AI Resume Tailor
**Context:** A bilingual (EN/ES) AI-powered resume analysis tool that helps job seekers optimize their resumes for Applicant Tracking Systems (ATS).
**Core Philosophy:** Privacy-first, no data storage. Real-time AI analysis with structured feedback. Zero-friction UX with instant access.

---

## 2. Project Context

**For Product Requirements:**

- [docs/product/PRD.md](docs/product/PRD.md)
- _Contains:_ Product vision, feature specifications, AI analysis engine, and implementation notes.

**For Project Architecture:**

- [README.md](README.md)
- _Contains:_ Quick start guide, tech stack, project structure, and deployment instructions.

**For Design & Branding:**

- [docs/DESIGN.md](docs/DESIGN.md)
- _Contains:_ Design system, color palette, typography, component patterns, and UI guidelines.

**For Coding Principles:**

- [docs/AI_ENGINEERING_RULES.md](docs/AI_ENGINEERING_RULES.md)
- _Contains:_ Engineering best practices, architecture patterns, and code quality standards.

**For AI Collaboration:**

- [docs/SKILL-WORKING-WITH-HUMANS.md](docs/SKILL-WORKING-WITH-HUMANS.md)
- _Contains:_ Communication style, how to handle ambiguity, and collaboration protocols.

**For History & Patterns:**

- [docs/LESSONS_LEARNED.md](docs/LESSONS_LEARNED.md)
- _Contains:_ Solutions to previous bugs, implementation decisions, and lessons from building this project.

**For Deployment:**

- [docs/development/DEPLOYMENT.md](docs/development/DEPLOYMENT.md)
- _Contains:_ Deployment guide for backend and frontend services.

**For Backend API:**

- [docs/backend/AI_ENGINE.md](docs/backend/AI_ENGINE.md)
- _Contains:_ AI analysis engine documentation, OpenAI integration, and structured output.

**For Roadmap:**

- [docs/WORLD_CLASS_SAAS_ROADMAP.md](docs/WORLD_CLASS_SAAS_ROADMAP.md)
- _Contains:_ Planned features, future enhancements, and version history.

---

## 3. Quick Technical Facts

- **Frontend Framework:** React 19 + Vite
- **Backend Framework:** Flask (Python 3.11)
- **Language:** TypeScript (frontend), Python (backend)
- **Styling:** Tailwind CSS + shadcn/ui
- **State Management:** React Context + Zustand
- **i18n:** react-i18next (EN/ES bilingual support)
- **AI Engine:** OpenAI GPT-4 with structured JSON output
- **Auth:** Clerk (Google OAuth, LinkedIn OAuth, email/password)
- **Database:** Neon Serverless Postgres
- **Payments:** Stripe (embedded checkout, webhooks, customer portal)
- **Deployment:** Vercel (frontend) + Render (backend)
- **Key Feature:** Real-time ATS-focused resume analysis with privacy-first design

---

## 4. Tech Stack

**Frontend:**

- React 19 + Vite
- TypeScript 5
- Tailwind CSS + shadcn/ui
- Lucide React (icons)
- react-i18next (internationalization)
- Sonner (toast notifications)
- React Router DOM

**Backend:**

- Flask 3.0+
- Python 3.11
- OpenAI API (GPT-4)
- Flask-CORS
- Gunicorn (WSGI server)

**State & Data:**

- React Context API
- Zustand (auth/credits state)
- Clerk (authentication)
- Neon Postgres (database)
- Stripe (payments)
- @tanstack/react-query (data fetching)

**Development:**

- ESLint + Prettier
- TypeScript strict mode
- pnpm (package management)
