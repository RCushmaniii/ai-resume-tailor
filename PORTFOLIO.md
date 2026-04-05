---
# =============================================================================
# PORTFOLIO.md — AI Resume Tailor
# =============================================================================
portfolio_enabled: true
portfolio_priority: 10
portfolio_featured: true
portfolio_last_reviewed: "2026-03-18"

title: "AI Resume Tailor"
tagline: "AI-powered ATS resume optimization with bilingual support and instant feedback"
slug: "ai-resume-tailor"

category: "AI Automation"
target_audience: "Job seekers who want to understand why ATS systems reject their resumes"
tags:
  - "ai"
  - "saas"
  - "resume"
  - "ats"
  - "job-search"
  - "bilingual"
  - "openai"
  - "stripe"
  - "clerk"
  - "flask"

thumbnail: "/images/ai-resume-tailor-thumb.jpg"
hero_images:
  - "/images/ai-resume-tailor-01.png"
  - "/images/ai-resume-tailor-02.png"
  - "/images/ai-resume-tailor-03.png"
  - "/images/ai-resume-tailor-04.png"
  - "/images/ai-resume-tailor-05.png"
  - "/images/ai-resume-tailor-06.png"
demo_video_url: "/video/ai-resume-tailor-brief.mp4"

live_url: "https://ai-resume-tailor-client.vercel.app"
demo_url: "https://ai-resume-tailor-client.vercel.app/analyze"
case_study_url: ""

problem_solved: |
  Over 75% of resumes are rejected by Applicant Tracking Systems before a human ever sees them.
  Job seekers submit into a black box with no visibility into why they're filtered out. Existing
  tools charge upfront, require accounts, or provide generic advice not tied to the specific posting.
  The Latin American market is further underserved by English-only tools.

key_outcomes:
  - "Structured ATS feedback in under 10 seconds"
  - "5 free analyses before any signup prompt — value delivered first"
  - "Zero resume data stored — privacy by architecture"
  - "Full EN/ES bilingual coverage across UI and AI-generated analysis"
  - "Guest-to-paid conversion funnel with embedded Stripe checkout"

tech_stack:
  - "React 19"
  - "TypeScript"
  - "Flask / Python 3.11"
  - "OpenAI GPT-4"
  - "Stripe"
  - "Clerk"
  - "Neon PostgreSQL"
  - "Tailwind CSS"
  - "shadcn/ui"
  - "Vercel"
  - "Render"

complexity: "Production"

# === REPO HEALTH STATUS ===
# Last audited: 2026-04-04
# Standards defined in: operating-system/delivery/repo-health-baseline.md
health_status:
  sentry: "-"
  testing: "partial"
  ci_cd: "Y"
  health_endpoint: "-"
  security_headers: "-"
  rate_limiting: "-"
  env_validation: "-"
  analytics: "DEFERRED"
  structured_logging: "-"
  dependabot: "Y"
  secret_scanning: "Y"
  db_backup: "-"
---

## Overview

AI Resume Tailor is a bilingual SaaS application that helps job seekers understand exactly why their resumes get rejected by Applicant Tracking Systems and what to do about it. Users paste their resume and a job description, and the system returns a structured analysis with a match score, missing keywords, and severity-coded suggestions.

The application runs a React 19 frontend deployed on Vercel with a Flask backend on Render. The AI engine uses OpenAI GPT-4 with structured JSON output and ATS-focused prompts to deliver deterministic, actionable feedback. Authentication is handled by Clerk (Google, LinkedIn, email/password), payments by Stripe with embedded checkout, and user data lives in Neon serverless Postgres.

The product is designed around zero friction — guests get 5 free analyses with no signup required. Privacy is enforced by architecture: no resume data is stored, and all processing happens in real time.

## The Challenge

- **ATS Black Box:** Job seekers submit resumes into systems they can't see. Most have no way to know whether their resume will pass keyword filters.
- **Generic Advice:** Existing resume tools provide surface-level feedback rather than job-specific, keyword-level analysis tied to the actual posting.
- **Friction Barriers:** Competing tools require account creation or payment before delivering any value.
- **Language Gap:** The Latin American job market is underserved by English-only tools.

## The Solution

**Structured ATS Analysis:** GPT-4 returns structured JSON with a match score, keyword gaps, and severity-coded suggestions — all parsed into type-safe TypeScript interfaces on the frontend.

**Zero-Friction Access:** Guest users get 5 free analyses with no account required. The product delivers value before asking for anything in return.

**Bilingual by Design:** Full i18n coverage across every UI element, error message, and analysis output. English and Spanish are first-class citizens.

**Privacy-First Architecture:** No resume data is persisted. Analysis happens in a single request/response cycle.

## Technical Highlights

- **Structured JSON Output:** GPT-4 with strict JSON mode and low temperature (0.1) for deterministic responses
- **Type-Safe API Contract:** TypeScript interfaces with union types and transformation functions for backward compatibility
- **Modular Analysis Engine:** Separate scoring, keyword extraction, and suggestion modules — each independently testable
- **Severity-Coded UI:** Red/amber/blue visual hierarchy maps directly to AI output severity levels
- **Embedded Stripe Checkout:** Guest-to-paid conversion with post-payment account creation
- **Clerk Webhook Pipeline:** Automatic profile provisioning in Neon Postgres across all auth methods
- **Skeleton Loading States:** Layout-perfect skeletons matching final render dimensions — zero layout shift

## Results

**For the End User:**
- Structured, actionable ATS feedback in under 10 seconds
- 5 free analyses with no signup, no email, no commitment
- Native Spanish support — not machine-translated afterthoughts
- Zero data retention — resume text never persisted

**Technical Demonstration:**
- Full-stack production SaaS with AI, auth, payments, and database
- Clean separation between AI engine, scoring logic, and presentation layer
- Internationalization architecture that scales to additional languages without refactoring
- Privacy-by-design approach that eliminates an entire category of data liability

This project demonstrates end-to-end product engineering: from AI prompt design through payment integration to bilingual UX — shipping a production SaaS that solves a real problem for a real audience.
