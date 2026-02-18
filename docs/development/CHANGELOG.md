# Changelog

## [v2.0.0] - 2025-12-23

### World-Class Analysis System

- **Structured AI Analysis** — OpenAI GPT-4 with JSON mode for type-safe, deterministic results
- **AnalysisReport Component** — Hero score section, keywords analysis, score breakdown, optimization plan
- **Visual Severity Coding** — Red (critical), amber (warning), blue (tips) across all suggestions
- **Bilingual Support** — Full English/Spanish internationalization with react-i18next
- **ValidatedTextArea** — Reusable input with character counting, visual warnings, clear buttons
- **AnalysisSkeleton** — Layout-perfect skeleton loading with no layout shifts
- **Backward Compatibility** — Union types and transformers for legacy API response formats
- **Clerk Authentication** — Google OAuth, LinkedIn OAuth, email/password sign-in
- **Neon Postgres Database** — User profiles, credits tracking, analysis history
- **Stripe Integration** — Embedded checkout, subscription management, guest checkout flow

### Infrastructure

- **Frontend:** React 19 + Vite + TypeScript on Vercel (port 5173)
- **Backend:** Flask 3.0 + Python 3.11 on Render (port 5000)
- **Auth:** Clerk with webhook-based profile creation
- **Database:** Neon Serverless Postgres
- **Payments:** Stripe with embedded checkout and webhooks

## [v1.0.0] - 2025-12-15

### Initial Major Release

- **Resume vs Job Description Analysis** — Analyze pasted resume text against a pasted job description
- **Match Scoring + Breakdown** — Returns a 0-100 score with breakdown dimensions
- **Missing Keywords + Suggestions** — Structured results for improving ATS match
- **Input Validation + Security** — Client + server checks for suspicious content and length limits
- **Modern Frontend UI** — React + Vite + Tailwind + shadcn/ui
- **Production Deployment Ready** — Environment-based configuration and documented deployment approach
- **Documentation Consolidation** — Canonical docs live under `/docs`
