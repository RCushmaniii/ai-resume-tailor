# AI Resume Tailor

![React](https://img.shields.io/badge/React_19-61DAFB?style=flat&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Flask](https://img.shields.io/badge/Flask_3.0-000000?style=flat&logo=flask&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI_GPT--4-412991?style=flat&logo=openai&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-635BFF?style=flat&logo=stripe&logoColor=white)

> Bilingual AI-powered ATS resume optimization — instant structured feedback, zero friction, privacy by design.

## Overview

AI Resume Tailor is a bilingual (EN/ES) SaaS application that helps job seekers understand exactly why Applicant Tracking Systems reject their resumes and what to do about it. Users paste a resume and a job description, and the system returns a structured analysis: a 0-100 match score, missing keywords with severity coding, and actionable optimization suggestions.

The product runs a React 19 frontend on Vercel with a Flask backend on Render. OpenAI GPT-4 handles analysis through ATS-focused prompts with structured JSON output. Authentication flows through Clerk (Google, LinkedIn, email/password), payments through Stripe embedded checkout, and user data through Neon serverless Postgres.

The design prioritizes zero friction — guests get 5 free analyses with no signup required — and privacy by architecture: no resume data is stored, all processing happens in a single request/response cycle.

## The Challenge

Over 75% of resumes are rejected by ATS software before a human recruiter ever sees them. Job seekers are submitting into a black box with no visibility into why they're being filtered out.

Existing tools either charge upfront, require account creation before showing value, or deliver generic advice ("use action verbs") that isn't tied to the specific job posting. The Latin American market is further underserved — Spanish-speaking job seekers get machine-translated afterthoughts instead of native-language analysis.

The result: job seekers waste time tailoring resumes by intuition, with no feedback loop telling them what's actually missing.

## The Solution

**Structured ATS Analysis:** The AI engine mimics enterprise ATS behavior (Taleo, Greenhouse) through carefully engineered prompts. GPT-4 returns structured JSON — match score, keyword gaps, severity-coded suggestions — parsed into type-safe TypeScript interfaces on the frontend.

**Zero-Friction Access:** Guest users get 5 free analyses before any signup prompt. The product delivers value first, asks for commitment second. Credit tracking uses local storage for guests with server-side validation for authenticated users.

**Bilingual by Design:** Full i18n coverage across every UI element, error message, and analysis output. English and Spanish are first-class citizens with localized industry terminology for both markets.

**Privacy-First Architecture:** No resume data is persisted. Analysis happens in a single request/response cycle. The trust model is simple — user data doesn't exist after the response completes.

## Technical Highlights

- **Structured JSON Output:** GPT-4 with strict JSON mode and low temperature (0.1) for deterministic, parseable responses
- **Type-Safe API Contract:** TypeScript interfaces with union types and transformation functions for backward compatibility across API versions
- **Modular Analysis Engine:** Separate scoring, keyword extraction, and suggestion modules — each independently testable
- **Severity-Coded UI:** Red/amber/blue visual hierarchy maps directly to AI output severity levels
- **Embedded Stripe Checkout:** Guest-to-paid conversion with post-payment account creation — no signup wall before purchase
- **Clerk Webhook Pipeline:** Automatic profile provisioning in Neon Postgres across all auth methods
- **Skeleton Loading States:** Layout-perfect skeletons matching final render dimensions — zero content layout shift

## Getting Started

### Prerequisites

- Node.js >= 18 with pnpm
- Python 3.11+
- OpenAI API key
- Clerk account (for auth)
- Neon database (for user data)

### Installation

```powershell
# Clone the repository
git clone https://github.com/RCushmaniii/ai-resume-tailor.git
cd ai-resume-tailor

# Backend setup
cd server
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Add your API keys to .env

# Frontend setup
cd ..\client
pnpm install
cp .env.example .env
# Add your Clerk publishable key to .env
```

### Running Locally

```powershell
# Terminal 1: Backend (port 5000)
cd server
venv\Scripts\activate
python app.py

# Terminal 2: Frontend (port 5173)
cd client
pnpm dev
```

Visit `http://localhost:5173`

### Environment Variables

**Frontend (.env):**

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API URL |
| `VITE_CLERK_PUBLISHABLE_KEY` | Clerk publishable key |
| `VITE_GUEST_CREDITS_TOTAL` | Free analyses for guests (default: 5) |

**Backend (.env):**

| Variable | Description |
|----------|-------------|
| `OPENAI_API_KEY` | OpenAI API key |
| `OPENAI_MODEL` | Model to use (default: gpt-4o) |
| `FRONTEND_URL` | Frontend origin for CORS |
| `CLERK_SECRET_KEY` | Clerk secret key |
| `CLERK_WEBHOOK_SECRET` | Clerk webhook signing secret |
| `DATABASE_URL` | Neon Postgres connection string |

## Live Demo

**[Try it live](https://ai-resume-tailor-client.vercel.app)**

Test scenarios to try:

1. **Quick analysis** — Paste any resume and job description, click Analyze. No account required.
2. **Language switch** — Toggle to Spanish in the header to see full bilingual support.
3. **Severity coding** — Review the results to see critical (red), warning (amber), and tip (blue) suggestions.

## Project Structure

```
ai-resume-tailor/
├── client/                    # React 19 + Vite + TypeScript frontend
│   ├── src/
│   │   ├── components/        # UI components (shadcn/ui based)
│   │   │   ├── analyze/       # Analysis-specific (AnalysisReport, ValidatedTextArea)
│   │   │   ├── auth/          # Auth dialogs and modals
│   │   │   ├── subscription/  # Payment/upgrade components
│   │   │   └── ui/            # Base shadcn components
│   │   ├── contexts/          # React Context (Subscription, SignInPrompt)
│   │   ├── hooks/             # Custom hooks (useAnalysisLimit)
│   │   ├── i18n/              # Translations (en.ts, es.ts)
│   │   ├── lib/               # Utilities (api, useAuth, fetchWithAuth, store)
│   │   ├── pages/             # Route pages (Analyze, Landing, Login, Pricing)
│   │   └── types/             # TypeScript type definitions
│   └── public/                # Static assets
├── server/                    # Flask + Python 3.11 backend
│   ├── app.py                 # Main Flask app with CORS, validation, Clerk auth
│   ├── ai_engine.py           # OpenAI GPT-4 integration
│   ├── scoring_engine.py      # ATS scoring algorithm
│   ├── database.py            # Neon Postgres database helpers
│   ├── clerk_webhooks.py      # Clerk webhook handlers
│   ├── stripe_integration.py  # Stripe payment handling
│   ├── schema.sql             # Database schema
│   └── analyzers/             # Modular analysis modules
└── docs/                      # Documentation
    ├── product/               # PRD, monetization strategy
    ├── development/           # Security, testing, deployment
    └── backend/               # API and AI engine docs
```

## Deployment

- **Frontend:** Auto-deploys to [Vercel](https://ai-resume-tailor-client.vercel.app) on push to `main`
- **Backend:** Auto-deploys to [Render](https://ai-resume-tailor-hxpr.onrender.com) on push to `main`

```powershell
# Verify before pushing
cd client
pnpm verify    # typecheck + lint + build
```

## Security

- [x] Clerk JWT verification on all authenticated endpoints
- [x] CORS restricted to frontend origin
- [x] Input validation with character limits (server-enforced)
- [x] No resume data storage — privacy by architecture
- [x] Stripe webhook signature verification
- [x] Clerk webhook signature verification (svix)
- [x] Environment variables for all secrets (never hardcoded)
- [x] Rate limiting via guest credit system

## Results

| Metric | Detail |
|--------|--------|
| Analysis speed | Structured feedback in < 10 seconds |
| Guest conversion | 5 free analyses before any signup prompt |
| Language support | Full EN/ES coverage across all UI and analysis output |
| Data retention | Zero — no resume data stored, by design |

**What this project demonstrates:**

- Full-stack production SaaS with AI, auth, payments, and database
- Clean separation between AI engine, scoring logic, and presentation layer
- Internationalization architecture that scales to additional languages without refactoring
- Privacy-by-design approach that eliminates an entire category of data liability
- Guest-to-paid conversion funnel with embedded checkout

## Contact

**Robert Cushman**
Business Solution Architect & Full-Stack Developer
Guadalajara, Mexico

📧 info@cushlabs.ai
🔗 [GitHub](https://github.com/RCushmaniii) • [LinkedIn](https://linkedin.com/in/robertcushman) • [Portfolio](https://cushlabs.ai)

## License

© 2026 Robert Cushman. All rights reserved. See [LICENSE](./LICENSE) for details.

---

*Last Updated: 2026-02-21*
