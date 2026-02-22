---
# =============================================================================
# PORTFOLIO.MD — AI Resume Tailor
# =============================================================================
portfolio_enabled: true
portfolio_priority: 2
portfolio_featured: true
portfolio_last_reviewed: "2026-02-22"

title: "AI Resume Tailor"
tagline: "AI-powered ATS resume optimization with bilingual support and instant structured feedback"
slug: "ai-resume-tailor"

category: "AI Automation"
target_audience: "Job seekers who want to optimize their resumes for Applicant Tracking Systems"
tags:
  - "ai"
  - "saas"
  - "resume"
  - "ats"
  - "job-search"
  - "automation"
  - "bilingual"
  - "career-tools"
  - "openai"
  - "stripe"

thumbnail: "/images/ai-resume-tailor-thumb.jpg"
hero_images:
  - "/images/ai-resume-tailor-01.png"
  - "/images/ai-resume-tailor-02.png"
  - "/images/ai-resume-tailor-03.png"
  - "/images/ai-resume-tailor-04.png"
  - "/images/ai-resume-tailor-05.png"
  - "/images/ai-resume-tailor-06.png"
  - "/images/ai-resume-tailor-07.png"
  - "/images/ai-resume-tailor-08.png"
  - "/images/ai-resume-tailor-09.png"
  - "/images/ai-resume-tailor-10.png"
  - "/images/ai-resume-tailor-11.png"
demo_video_url: "/video/ai-resume-tailor-brief.mp4"
demo_video_poster: "/video/ai-resume-tailor-brief-poster.jpg"

live_url: "https://ai-resume-tailor-client.vercel.app"
demo_url: "https://ai-resume-tailor-client.vercel.app"
case_study_url: ""

problem_solved: |
  Over 75% of resumes are rejected by Applicant Tracking Systems before a human
  ever sees them. Most job seekers have no visibility into why they're being
  filtered out or what keywords they're missing. Existing tools are either
  expensive, require account creation upfront, or provide vague generic advice
  instead of actionable, job-specific feedback.

key_outcomes:
  - "Structured ATS analysis with 0-100 match score and granular breakdown"
  - "Missing keyword detection with severity-coded priority indicators"
  - "Bilingual support (English/Spanish) with full i18n coverage"
  - "Privacy-first design — no resume data stored, real-time processing only"
  - "Zero-friction guest access with 5 free analyses before signup"
  - "Stripe-powered subscription management for premium features"

tech_stack:
  - "React 19"
  - "TypeScript"
  - "Vite"
  - "Tailwind CSS"
  - "shadcn/ui"
  - "Flask 3.0"
  - "Python 3.11"
  - "OpenAI GPT-4"
  - "Clerk"
  - "Stripe"
  - "Neon Postgres"
  - "Vercel + Render"

complexity: "Production"
---

## Overview

AI Resume Tailor is a bilingual SaaS application that helps job seekers understand exactly why their resumes get rejected by Applicant Tracking Systems and what to do about it. Users paste their resume and a job description, and the system returns a structured analysis with a match score, missing keywords, and severity-coded suggestions.

The application runs a React 19 frontend deployed on Vercel with a Flask backend on Render. The AI engine uses OpenAI GPT-4 with structured JSON output and ATS-focused prompts to deliver deterministic, actionable feedback. Authentication is handled by Clerk (Google, LinkedIn, email/password), payments by Stripe with embedded checkout, and user data lives in Neon serverless Postgres.

The product is designed around zero friction — guests get 5 free analyses with no signup required. Privacy is enforced by architecture: no resume data is stored, and all processing happens in real time.

## The Challenge

- **ATS Black Box:** Job seekers submit resumes into systems they can't see. Most have no way to know whether their resume will pass keyword filters, let alone why it might fail.
- **Generic Advice:** Existing resume tools provide surface-level feedback ("use action verbs") rather than job-specific, keyword-level analysis tied to the actual posting.
- **Friction Barriers:** Competing tools require account creation, payment, or multi-step onboarding before delivering any value. Users abandon before they see results.
- **Language Gap:** The Latin American job market is underserved by English-only tools. Spanish-speaking job seekers need native-language feedback, not machine-translated afterthoughts.

## The Solution

**Structured ATS Analysis:**
The backend mimics the behavior of enterprise ATS platforms (Taleo, Greenhouse) through carefully engineered prompts. GPT-4 returns structured JSON with a match score, keyword gaps, and severity-coded suggestions — all parsed into type-safe TypeScript interfaces on the frontend.

**Zero-Friction Access:**
Guest users get 5 free analyses with no account required. Credit tracking uses local storage with server-side validation for authenticated users. The product delivers value before asking for anything in return.

**Bilingual by Design:**
Full i18n coverage across every UI element, error message, and analysis output. English and Spanish are first-class citizens, not afterthoughts. Industry-specific terminology is localized for both markets.

**Privacy-First Architecture:**
No resume data is persisted. The analysis happens in a single request/response cycle. Users trust the tool because there's nothing to trust — their data doesn't exist after the response.

## Technical Highlights

- **Structured JSON Output:** OpenAI GPT-4 with strict JSON mode and low temperature (0.1) for deterministic, parseable responses
- **Type-Safe API Contract:** TypeScript interfaces with union types and transformation functions for backward compatibility across API versions
- **Modular Analysis Engine:** Separate scoring, keyword extraction, and suggestion generation — each testable in isolation
- **Severity-Coded UI:** Red (critical), amber (warning), blue (tip) visual hierarchy that maps directly to the AI output structure
- **Embedded Stripe Checkout:** Guest-to-paid conversion with post-payment account creation — no signup required before purchase
- **Clerk Webhook Pipeline:** Automatic profile creation in Neon Postgres when users sign up via any auth method
- **Skeleton Loading States:** Layout-perfect skeleton components that match final render dimensions — zero layout shift

## Results

**For the End User:**
- Instant, actionable feedback on resume-to-job alignment in under 10 seconds
- Clear keyword gap analysis with priority indicators — users know exactly what to fix first
- Bilingual support that respects the user's language rather than defaulting to English
- Zero commitment to start — 5 free analyses with no email, no signup, no friction

**Technical Demonstration:**
- Full-stack production SaaS with AI integration, auth, payments, and database
- Clean separation between AI engine, scoring logic, and presentation layer
- Internationalization architecture that scales to additional languages without refactoring
- Privacy-by-design approach that eliminates an entire category of data liability
