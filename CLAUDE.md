# CLAUDE.md - AI Resume Tailor

This file provides context for Claude Code to work effectively on this project.

## Project Overview

**AI Resume Tailor** is a bilingual (EN/ES) SaaS application that helps job seekers optimize their resumes for Applicant Tracking Systems (ATS). It provides AI-powered analysis with structured feedback, privacy-first design (no data storage), and zero-friction UX.

**Live:** https://ai-resume-tailor-client.vercel.app
**Status:** Production MVP (v2.0.0) - working toward full SaaS with monetization

## Claude Code Capabilities

**You have access to:**
- **Supabase CLI** - Full database management, migrations, auth configuration
- **File system** - Read/write all project files
- **Bash commands** - Git, pnpm, python, etc.

**Supabase CLI Commands:**
```bash
# Login (if needed)
npx supabase login

# Link to project
npx supabase link --project-ref [project-id]

# Database operations
npx supabase db push          # Push migrations
npx supabase db reset         # Reset database
npx supabase db diff          # Generate migration from changes

# Generate types from database
npx supabase gen types typescript --local > client/src/types/database.ts
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
    lib/              # Utilities (api.ts, supabaseClient.ts, store.ts)
    pages/            # Route pages (Analyze, Landing, Login, etc.)
    types/            # TypeScript interfaces (analysis.ts)

server/               # Flask + Python 3.11 backend
  app.py              # Main Flask app with CORS, validation, auth
  ai_engine.py        # OpenAI GPT-4 integration
  scoring_engine.py   # ATS scoring algorithm
  stripe_integration.py  # Stripe payment handling (WIP)
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
| Auth | Supabase Auth |
| Database | Supabase Postgres (for user data/subscriptions) |
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
VITE_SUPABASE_URL=https://[project].supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJ...
VITE_GUEST_CREDITS_TOTAL=5
```

**Backend (.env):**
```
OPENAI_API_KEY=sk-proj-...
OPENAI_MODEL=gpt-4o
FRONTEND_URL=https://ai-resume-tailor-client.vercel.app
SUPABASE_URL=https://[project].supabase.co
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
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

1. **OAuth Providers** - Google + LinkedIn login (Supabase Auth)
2. **File Upload** - PDF + DOCX support with text extraction
3. **Database Schema** - User profiles, analysis history, subscriptions
4. **Stripe Integration** - Complete payment flow
5. **Error Monitoring** - Add Sentry

## Planned Features

### Authentication (OAuth)
- **Google** - Primary social login
- **LinkedIn** - Perfect for job seekers context
- **Email/Password** - Already implemented as fallback

Configure in Supabase Dashboard > Authentication > Providers

### File Upload (PDF + DOCX)
- **PDF parsing**: Use `pdf-parse` (Node.js) or `pdfplumber` (Python)
- **DOCX parsing**: Use `mammoth` (converts to HTML/text)
- **Skip .doc**: Legacy format, not worth complexity
- **Max file size**: 5MB recommended
- **Process in memory**: Don't store files, extract text only

### Database Schema (Supabase Postgres)
Tables in use:
- `profiles` - User profiles with credits tracking (auto-created on signup)
- `analyses` - Saved analysis history

Stripe data (via Stripe Sync Engine):
- `stripe.customers` - Synced from Stripe
- `stripe.subscriptions` - Synced from Stripe
- `stripe.prices` / `stripe.products` - Synced from Stripe

### Stripe Sync Engine
Instead of manual webhooks, use Supabase's Stripe Sync Engine:
1. Enable in Supabase Dashboard → Integrations → Stripe Sync Engine
2. Add restricted Stripe API key
3. Run `supabase/stripe_sync_views.sql` in SQL Editor after sync completes

See `docs/STRIPE_SYNC_SETUP.md` for full instructions.

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
- `docs/STRIPE_SYNC_SETUP.md` - Stripe Sync Engine setup
- `docs/product/MONETIZATION_AND_ABUSE_CONTROLS.md` - Quota strategy

## Contact

**Owner:** Robert Cushman
**Email:** info@rankitbetter.com
**GitHub:** RCushmaniii
