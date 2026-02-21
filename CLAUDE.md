# CLAUDE.md - AI Resume Tailor

This file provides context for Claude Code to work effectively on this project.

## Project Overview

**AI Resume Tailor** is a bilingual (EN/ES) SaaS application that helps job seekers optimize their resumes for Applicant Tracking Systems (ATS). It provides AI-powered analysis with structured feedback, privacy-first design (no data storage), and zero-friction UX.

**Live:** https://ai-resume-tailor-client.vercel.app
**Status:** Production MVP (v2.0.0) - working toward full SaaS with monetization

---

> ## **IMPORTANT: Proactive Product Advisor**
>
> **You are not just an engineer - you are a product advisor.** Proactively challenge complexity and advocate for simplicity. Apply these principles without being asked:
>
> 1. **Simplify UX** - If a feature adds complexity users don't need, suggest removing it
> 2. **"It Just Works"** - Modern apps don't ask users to configure things that should be automatic
> 3. **Fewer Choices = Better** - Don't expose settings users shouldn't need to think about
> 4. **Challenge Requirements** - If something seems over-engineered, say so and propose simpler alternatives
> 5. **Think Like a User** - Would your mom understand this UI? If not, simplify it
>
> **Example phrases to use:**
> - *"Do users really need a Start/Stop button, or should the service just always run?"*
> - *"This setting adds complexity - can we just pick a sensible default?"*
> - *"Instead of 3 options, what if we just did the right thing automatically?"*
>
> **When implementing features, always ask:** Is there a way to deliver the same value with less UI, fewer options, or zero configuration?

---

## Claude Code Capabilities

**You have access to:**
- **Neon CLI** (`neonctl`) - Database management
- **File system** - Read/write all project files
- **Bash commands** - Git, pnpm, python, etc.

**Neon CLI Commands:**
```bash
# Authenticate
npx neonctl auth

# Database operations
npx neonctl databases list
npx neonctl connection-string

# Run SQL against the database
psql $DATABASE_URL -f server/schema.sql
```

## Quick Start Commands

```bash
# Frontend development (port 5173)
cd client && pnpm dev

# Backend development (port 5000)
cd server && venv\Scripts\activate && python app.py

# Full verify (typecheck + lint + build)
pnpm verify

# Health check
cd client && pnpm health-check
```

## Architecture

```
client/               # React 19 + Vite + TypeScript frontend
  src/
    components/       # UI components (shadcn/ui based)
      analyze/        # Analysis-specific (AnalysisReport, ValidatedTextArea, etc.)
      auth/           # Auth dialogs and modals
      subscription/   # Payment/upgrade components
      ui/             # Base shadcn components
    contexts/         # React Context (SubscriptionContext, SignInPromptContext)
    hooks/            # Custom hooks (useAnalysisLimit)
    i18n/             # Translations (en.ts, es.ts)
    lib/              # Utilities (api.ts, useAuth.ts, fetchWithAuth.ts, store.ts)
    pages/            # Route pages (Analyze, Landing, Login, etc.)
    types/            # TypeScript interfaces (analysis.ts)

server/               # Flask + Python 3.11 backend
  app.py              # Main Flask app with CORS, validation, Clerk auth
  ai_engine.py        # OpenAI GPT-4 integration
  scoring_engine.py   # ATS scoring algorithm
  database.py         # Neon Postgres database helpers
  clerk_webhooks.py   # Clerk webhook handlers (user.created, etc.)
  stripe_integration.py  # Stripe payment handling
  schema.sql          # Database schema (run against Neon)
  analyzers/          # Modular analysis modules
    resume_quality.py
    interview_prep.py
    cover_letter.py
    role_fit.py

docs/                 # Comprehensive documentation
  AI_STARTUP.md       # Read this first - project index
  AI_ENGINEERING_RULES.md
  DESIGN.md           # Design system, colors, typography
  LESSONS_LEARNED.md  # Solutions to past bugs
  WORLD_CLASS_SAAS_ROADMAP.md  # Feature roadmap
```

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, Vite, TypeScript, Tailwind CSS, shadcn/ui |
| State | Zustand, React Context, @tanstack/react-query |
| i18n | react-i18next (EN/ES) |
| Backend | Flask 3.0, Python 3.11, Gunicorn |
| AI | OpenAI GPT-4 with structured JSON output |
| Auth | Clerk (email/password, Google, LinkedIn OAuth) |
| Database | Neon Serverless Postgres |
| Payments | Stripe (in progress) |
| Hosting | Vercel (frontend), Render (backend) |

## Key Files to Know

| File | Purpose |
|------|---------|
| `client/src/pages/Analyze.tsx` | Main analysis page |
| `client/src/components/analyze/AnalysisReport.tsx` | Results visualization |
| `client/src/types/analysis.ts` | TypeScript interfaces + transformers |
| `client/src/lib/api.ts` | API client functions |
| `client/src/i18n/en.ts` | English translations |
| `server/app.py` | Flask API endpoints |
| `server/ai_engine.py` | OpenAI integration |
| `server/scoring_engine.py` | Scoring algorithm |

## API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/analyze` | POST | Resume analysis (main feature) |
| `/api/health` | GET | Backend health check |

## Code Patterns

### Adding a New Translation
1. Add key to `client/src/i18n/en.ts`
2. Add corresponding key to `client/src/i18n/es.ts`
3. Use with `const { t } = useTranslation(); t('key.path')`

### Adding a New UI Component
1. Use shadcn/ui as base: `npx shadcn@latest add [component]`
2. Extend in `client/src/components/ui/`
3. Follow existing patterns in `components/analyze/`

### API Response Types
- Always define in `client/src/types/analysis.ts`
- Use `transformAnalysisResult()` for backward compatibility
- Backend returns enterprise format, frontend transforms to display format

### State Management
- **Auth/Credits:** Zustand store (`lib/store.ts`)
- **Subscriptions:** SubscriptionContext
- **API Data:** @tanstack/react-query

## Environment Variables

**Frontend (.env):**
```
VITE_API_URL=https://ai-resume-tailor-hxpr.onrender.com/api
VITE_CLERK_PUBLISHABLE_KEY=pk_...
VITE_GUEST_CREDITS_TOTAL=5
```

**Backend (.env):**
```
OPENAI_API_KEY=sk-proj-...
OPENAI_MODEL=gpt-4o
FRONTEND_URL=https://ai-resume-tailor-client.vercel.app
CLERK_SECRET_KEY=sk_...
CLERK_WEBHOOK_SECRET=whsec_...
DATABASE_URL=postgres://user:pass@ep-xxx.region.aws.neon.tech/neondb
```

## Common Tasks

### Run Type Check
```bash
cd client && pnpm typecheck
```

### Fix Lint Issues
```bash
cd client && pnpm lint:fix
```

### Build for Production
```bash
cd client && pnpm build
```

### Test Backend Locally
```bash
cd server && python app.py
curl http://localhost:5000/api/health
```

## Current Priorities (from Roadmap)

1. **Stripe Integration** - Complete payment flow
2. **Error Monitoring** - Add Sentry
3. **Analysis History** - Backend API endpoints for CRUD operations

## Infrastructure

### Authentication (Clerk)
- **Google OAuth** - Primary social login (configured in Clerk Dashboard)
- **LinkedIn OAuth** - Perfect for job seekers context
- **Email/Password** - Built-in with Clerk

Configure in Clerk Dashboard > User & Authentication > Social Connections

### Database (Neon Postgres)
Tables:
- `profiles` - User profiles with credits tracking (auto-created via Clerk webhook)
- `analyses` - Saved analysis history

Schema: `server/schema.sql`

### Clerk Webhooks
- Endpoint: `/api/webhooks/clerk`
- Events: `user.created`, `user.updated`, `user.deleted`
- Auto-creates profiles in Neon when users sign up

## Design Tokens

See `docs/DESIGN.md` for full design system. Key colors:
- Primary: Blue-600 (`#2563eb`)
- Success: Green-500 (`#22c55e`)
- Warning: Amber-500 (`#f59e0b`)
- Critical: Red-500 (`#ef4444`)

## Things to Avoid

- **No hardcoded strings** - Use i18n translation keys
- **No hardcoded URLs** - Use environment variables
- **No storing sensitive data** - Privacy-first design
- **No breaking changes to API** - Transform for backward compatibility
- **No direct DOM manipulation** - Use React patterns

## Testing Guidelines

When tests exist:
```bash
cd client && pnpm test        # Unit tests (Vitest)
cd client && pnpm test:e2e    # E2E tests (Playwright)
cd server && pytest           # Backend tests
```

## Deployment

- **Frontend:** Auto-deploys to Vercel on push to `main`
- **Backend:** Auto-deploys to Render on push to `main`
- Always run `pnpm verify` before pushing

## Documentation Index

- `docs/AI_STARTUP.md` - Start here for orientation
- `docs/product/PRD.md` - Product requirements
- `docs/DESIGN.md` - Design system
- `docs/AI_ENGINEERING_RULES.md` - Coding standards
- `docs/LESSONS_LEARNED.md` - Bug solutions
- `docs/WORLD_CLASS_SAAS_ROADMAP.md` - Feature roadmap
- `docs/IMPLEMENTATION_PLAN.md` - Detailed implementation guide
- `docs/product/MONETIZATION_AND_ABUSE_CONTROLS.md` - Quota strategy

## Contact

**Owner:** Robert Cushman
**Email:** info@rankitbetter.com
**GitHub:** RCushmaniii
