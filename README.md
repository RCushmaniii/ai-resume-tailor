# AI Resume Tailor

**Live App:** [https://ai-resume-tailor-client.vercel.app](https://ai-resume-tailor-client.vercel.app)
**Repository:** [github.com/RCushmaniii/ai-resume-tailor](https://github.com/RCushmaniii/ai-resume-tailor)

**Release:** v2.0.0 - World-Class Analysis System
**Documentation:** See sections below for complete documentation index

Over 75% of resumes are rejected by Applicant Tracking Systems (ATS) before reaching human recruiters. AI Resume Tailor provides instant, AI-powered analysis that translates complex ATS requirements into clear, actionable feedback.

**Key Features:**

- **Structured AI Analysis** with JSON output for type-safe data handling
- **Bilingual Support** (English/Spanish) with full internationalization
- **Visual Severity Coding** for priority-based improvement guidance
- **Professional UI Components** with skeleton loaders and smooth animations
- **Real-time Validation** with character counting and smart error handling
- **Stripe Integration** for premium features and subscription management
- **Clerk Authentication** with Google and LinkedIn OAuth
- **Developer Tools** including health check and reset utilities

---

## Quick Start

### Health Check (Recommended)

```bash
cd client && pnpm health-check
```

Run this first to verify your development environment is properly configured.

### Development Setup

```bash
# Option 1: Use the batch file (Windows)
START_DEV.bat

# Option 2: Manual startup
# Backend (port 5000)
cd server && venv\Scripts\activate && python app.py

# Frontend (port 5173)
cd client && pnpm dev
```

### Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed development guidelines, code style, and contribution process.

## What It Does

AI Resume Tailor identifies exactly what recruiters want to see:

- **Quantified Compatibility** via 0-100 match score with granular breakdown
- **Missing Keywords** with visual priority indicators (Critical/Warning/Tip)
- **Actionable Suggestions** categorized by severity with color-coded cards
- **Bilingual Experience** supporting English and Spanish users
- **Real-time Feedback** with character limits and validation warnings

**Key Design Principles:**

- **Privacy-first** (no data storage, real-time processing only)
- **World-class Accessibility** (screen reader support, semantic HTML)
- **Production-ready Infrastructure** with auto-deployment

---

## Architecture

```
┌──────────────────┐         ┌───────────────────┐         ┌──────────────┐
│  React + Vite    │  HTTPS  │   Flask API       │   API   │   OpenAI     │
│  (Vercel)        │────────>│   (Render)        │────────>│   GPT-4      │
│                  │         │                   │         │              │
│ • World-class UI │         │ • Structured JSON │         │ • ATS-focused│
│ • i18n Support   │         │ • Clerk auth      │         │   prompts    │
│ • Skeleton       │         │ • Stripe billing  │         │ • Suggestions│
│   Loaders        │         │ • Error handling  │         │              │
└──────────────────┘         └───────────────────┘         └──────────────┘
        |                              |
   TypeScript types            Python 3.11 runtime
   Tailwind + shadcn/ui        Gunicorn WSGI server
   Clerk (auth)                Neon Postgres (DB)
```

---

## World-Class Features

### 1. Structured Analysis System

**Backend Integration:**

- **JSON Mode Output:** Strict structured response from OpenAI API
- **Type-Safe Interfaces:** TypeScript contracts for all API responses
- **Backward Compatibility:** Seamless handling of legacy data formats

**Frontend Visualization:**

- **Hero Section:** Circular progress score with executive summary
- **Keywords Analysis:** Missing vs. found keywords with visual indicators
- **Score Breakdown:** Detailed metrics (Hard Skills, Semantic, Tone)
- **Optimization Plan:** Actionable suggestions with severity coding

### 2. Internationalization (i18n)

**Bilingual Support:**

- **Complete Translation Coverage:** All UI elements localized
- **Dynamic Language Switching:** Runtime language changes
- **Cultural Adaptation:** Industry-specific terminology in both languages

**Implementation:**

- **React i18next:** Industry-standard internationalization library
- **Translation Keys:** Organized by feature and component
- **Fallback Handling:** Graceful degradation for missing translations

### 3. World-Class UI Components

**Loading States:**

- **AnalysisSkeleton:** Layout-perfect skeleton loading
- **No Layout Shifts:** Skeletons match final component structure exactly
- **Smooth Transitions:** Professional animations and micro-interactions

**Input Validation:**

- **ValidatedTextArea:** Reusable component with character counting
- **Visual Warnings:** Color-coded character limits (orange/red)
- **Smart Errors:** Contextual validation with blur timing
- **Clear Functionality:** Individual clear buttons for both inputs

**Visual Hierarchy:**

- **Severity Coding:** Red (critical), amber (warning), blue (tips)
- **Icon Communication:** Instant visual recognition of priority
- **Success States:** Positive reinforcement for perfect matches

---

## Technical Highlights

### 1. World-Class Analysis Engine

**Structured JSON Output:**

```typescript
interface AnalysisResult {
  score: number;
  score_breakdown: {
    keywords: number;
    semantic: number;
    tone: number;
  };
  keywords: {
    missing: string[];
    present: string[];
  };
  suggestions: {
    type: 'critical' | 'warning' | 'tip';
    title: string;
    description: string;
  }[];
  summary: string;
}
```

**ATS-Focused Prompts:**

- **System Prompt:** Mimics Taleo/Greenhouse ATS algorithms
- **Low Temperature:** Deterministic responses (0.1)
- **Keyword Extraction:** Hard skills focus with semantic understanding

### 2. Type-Safe Frontend Architecture

**Union Types for Backward Compatibility:**

```typescript
type DisplayAnalysisResult = AnalysisResult | LegacyAnalysisResult;

function transformAnalysisResult(
  apiResult: AnalysisResult | LegacyAnalysisResult
): DisplayAnalysisResult {
  // Safe transformation with type guards
}
```

**Component Composition:**

- **AnalysisReport:** World-class visualization component
- **ValidatedTextArea:** Reusable input with validation
- **SuggestionsList:** Severity-coded actionable feedback

### 3. Internationalization Implementation

**Translation Structure:**

```typescript
// English
{
  "results": {
    "reportTitle": "Analysis Report",
    "missingKeywords": "Missing Keywords (Critical)",
    "optimizationPlan": "Optimization Plan"
  }
}

// Spanish
{
  "results": {
    "reportTitle": "Informe de Análisis",
    "missingKeywords": "Palabras Clave Faltantes (Críticas)",
    "optimizationPlan": "Plan de Optimización"
  }
}
```

---

## Tech Stack Justification

| Technology                   | Purpose              | Why This Choice                                                                       |
| ---------------------------- | -------------------- | ------------------------------------------------------------------------------------- |
| **React 19 + TypeScript**    | Frontend framework   | Type safety catches bugs at compile time; React's component model scales well         |
| **Vite**                     | Build tool           | 10x faster than Create React App; native ESM support                                  |
| **Tailwind CSS + shadcn/ui** | Styling              | Rapid development with consistent design system; accessible by default                |
| **React i18next**            | Internationalization | Industry-standard i18n library with comprehensive features                            |
| **Flask**                    | Backend API          | Lightweight; perfect for single-purpose APIs; excellent for Python ML/AI integrations |
| **OpenAI GPT-4**             | AI analysis          | Industry-leading semantic understanding; structured JSON output for scoring           |
| **Clerk**                    | Authentication       | Google + LinkedIn OAuth, email/password; drop-in React components                     |
| **Neon Postgres**            | Database             | Serverless Postgres with branching; scales to zero when idle                          |
| **Stripe**                   | Payments             | Industry-standard billing; embedded checkout, webhooks, customer portal               |
| **Vercel + Render**          | Hosting              | Free tier with auto-deploy from GitHub; production-ready infrastructure               |

---

## Deployment

### Production URLs

- **Frontend:** https://ai-resume-tailor-client.vercel.app
- **Backend API:** https://ai-resume-tailor-hxpr.onrender.com

### Environment Variables

**Vercel (Frontend):**

```bash
VITE_API_URL=https://ai-resume-tailor-hxpr.onrender.com/api
VITE_CLERK_PUBLISHABLE_KEY=pk_...
VITE_GUEST_CREDITS_TOTAL=5
```

**Render (Backend):**

```bash
OPENAI_API_KEY=sk-proj-xxxxx
OPENAI_MODEL=gpt-4o
FRONTEND_URL=https://ai-resume-tailor-client.vercel.app
CLERK_SECRET_KEY=sk_...
CLERK_WEBHOOK_SECRET=whsec_...
DATABASE_URL=postgres://user:pass@ep-xxx.region.aws.neon.tech/neondb
```

---

## Local Development

### Prerequisites

- Node.js 18+ with pnpm
- Python 3.11+
- OpenAI API key

### Quick Start

```bash
# Clone and setup
git clone https://github.com/RCushmaniii/ai-resume-tailor.git
cd ai-resume-tailor

# Backend setup
cd server
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Add your OPENAI_API_KEY to .env

# Frontend setup
cd ../client
pnpm install
cp .env.example .env

# Run servers
# Terminal 1: Backend (port 5000)
cd server && python app.py

# Terminal 2: Frontend (port 5173)
cd client && pnpm dev
```

Visit `http://localhost:5173`

---

## Key Enhancements (v2.0.0)

### Analysis System Overhaul

- **Structured JSON Output** from OpenAI API
- **Type-Safe Interfaces** with backward compatibility
- **ATS-Focused Prompts** for better keyword matching
- **Low Temperature** responses for determinism

### World-Class UI Components

- **AnalysisReport** with hero section and visual hierarchy
- **AnalysisSkeleton** with layout-perfect loading states
- **ValidatedTextArea** with character counting and clear buttons
- **SuggestionsList** with severity-coded cards
- **MatchScoreCard** with compact donut chart design

### Internationalization & UX

- **Complete i18n Support** for English/Spanish
- **Visual Severity Coding** (red/amber/blue)
- **Success State Handling** for perfect matches
- **Smooth Animations** and micro-interactions
- **Accessibility Features** with semantic HTML

---

## Future Enhancements

- [ ] **PDF Upload:** Currently text-only; would add PDF parsing with `pdfplumber` or `PyPDF2`
- [ ] **Multi-Version Comparison:** A/B test different resume versions side-by-side
- [ ] **Export Reports:** Generate downloadable PDF reports with branding
- [ ] **Industry-Specific Models:** Fine-tune scoring for tech, healthcare, finance sectors
- [ ] **Browser Extension:** One-click analysis from LinkedIn/Indeed job postings
- [ ] **Additional Languages:** Expand i18n support to more languages
- [ ] **Real-time Collaboration:** Multi-user resume editing sessions

---

## Project Structure

```
ai-resume-tailor/
├── client/                  # Frontend (React + TypeScript)
│   ├── src/
│   │   ├── components/      # UI components
│   │   │   ├── analyze/     # Analysis-specific components
│   │   │   ├── auth/        # Auth dialogs and modals
│   │   │   ├── subscription/# Payment/upgrade components
│   │   │   └── ui/          # Base shadcn components
│   │   ├── contexts/        # React Context (Subscription, SignInPrompt)
│   │   ├── hooks/           # Custom hooks (useAnalysisLimit)
│   │   ├── i18n/            # Internationalization (en.ts, es.ts)
│   │   ├── lib/             # Utilities (api, useAuth, fetchWithAuth, store)
│   │   ├── pages/           # Route pages (Analyze, Landing, Login, etc.)
│   │   └── types/           # TypeScript type definitions
│   └── public/              # Static assets
├── server/                  # Backend (Flask API)
│   ├── app.py               # Main Flask application
│   ├── ai_engine.py         # AI analysis engine
│   ├── scoring_engine.py    # ATS scoring algorithm
│   ├── database.py          # Neon Postgres database helpers
│   ├── clerk_webhooks.py    # Clerk webhook handlers
│   ├── stripe_integration.py# Stripe payment handling
│   ├── schema.sql           # Database schema
│   └── requirements.txt     # Python dependencies
└── docs/                    # Documentation
    ├── product/             # PRD, monetization strategy
    ├── development/         # Security, testing, deployment guides
    ├── backend/             # API and AI engine documentation
    └── phases/              # Development phase summaries
```

---

## Documentation Index

### Start Here

- **[AI Startup Guide](./docs/AI_STARTUP.md)** - Project orientation and index
- **[Contributing](./CONTRIBUTING.md)** - Development guidelines

### Product

- **[PRD](./docs/product/PRD.md)** - Product requirements
- **[Roadmap](./docs/WORLD_CLASS_SAAS_ROADMAP.md)** - Planned enhancements
- **[Monetization & Abuse Controls](./docs/product/MONETIZATION_AND_ABUSE_CONTROLS.md)** - Quotas, feature gating, and anti-abuse strategy

### Development

- **[Security](./docs/development/SECURITY.md)** - Security measures and validation
- **[Testing](./docs/development/TESTING.md)** - Consolidated testing guide
- **[Deployment Guide](./docs/development/DEPLOYMENT.md)** - Backend deployment instructions
- **[Coding Principles](./docs/development/CODING_PRINCIPLES.md)**
- **[Changelog](./docs/development/CHANGELOG.md)**

### Backend Documentation

- **[Backend Overview](./docs/backend/README.md)** - Backend API documentation
- **[AI Engine](./docs/backend/AI_ENGINE.md)** - AI analysis engine documentation

---

## Project Status

- **Phase 0 Complete** - Project scaffold with FE/BE round-trip
- **Phase 1 Complete** - Core analysis engine implementation
- **Phase 2 Complete** - Form validation and security
- **v2.0.0 Complete** - World-class analysis system with i18n
- **In Progress** - Stripe integration, Clerk auth, Neon database

---

## About This Project

AI Resume Tailor is a SaaS product built by [CushLabs AI Services](https://rankitbetter.com), helping job seekers optimize their resumes for ATS systems with AI-powered analysis.

**Demonstrates:**

- **Full-stack Development** (React + TypeScript, Flask + Python)
- **AI/ML Integration** (OpenAI GPT-4 API with structured output)
- **SaaS Infrastructure** (Clerk auth, Stripe payments, Neon Postgres)
- **World-Class UX** (Internationalization, accessibility, animations)
- **Production Deployment** with CI/CD (Vercel + Render)

---

## Contact

**Robert Cushman**
Founder, CushLabs AI Services
Guadalajara, Mexico

info@rankitbetter.com
[GitHub](https://github.com/RCushmaniii) | [LinkedIn](https://linkedin.com/in/robertcushman) | [Portfolio](https://rankitbetter.com)

---

## License

MIT License - Free to use for personal or commercial projects.

---

_Updated: February 2026 - v2.0.0 World-Class Analysis System_
