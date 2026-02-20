---
# === CONTROL FLAGS ===
portfolio_enabled: true
portfolio_priority: 2
portfolio_featured: false

# === CARD DISPLAY ===
title: "AI Resume Tailor"
tagline: "AI-powered ATS resume analysis with instant, actionable feedback"
slug: "ai-resume-tailor"
category: "AI SaaS"
tech_stack:
  - "React 19"
  - "TypeScript"
  - "Tailwind CSS"
  - "shadcn/ui"
  - "Flask"
  - "Python 3.11"
  - "OpenAI GPT-4"
  - "Clerk"
  - "Neon Postgres"
  - "Stripe"
  - "Vercel"
  - "Render"

# === DETAIL PAGE ===

# === LINKS ===
demo_url: ""
live_url: "https://ai-resume-tailor-client.vercel.app"

# === OPTIONAL ===
tags:
  - "ai"
  - "saas"
  - "job-search"
  - "automation"
  - "resume"
  - "career-tools"
---

## Overview

AI Resume Tailor is a bilingual SaaS application that helps job seekers optimize their resumes for Applicant Tracking Systems (ATS). Using OpenAI GPT-4, it analyzes resumes against job descriptions and delivers structured, actionable feedback — match scores, missing keywords, and severity-coded optimization suggestions.

The app is privacy-first (no data storage), supports English and Spanish, and includes Clerk authentication, Stripe payments, and a Neon Postgres backend.

## The Challenge

Modern job applications are filtered by ATS software before any human sees them:

- **75% of resumes are rejected** by automated screening
- **Job seekers don't understand** what ATS algorithms scan for
- **Manual optimization is slow** and often guesswork
- **Applying to multiple jobs** becomes unsustainable without tooling
- **Quality suffers** as fatigue sets in

## The Solution

AI Resume Tailor provides:

**For Job Seekers:**
- Paste your resume and a job description
- Get an instant ATS compatibility score (0-100)
- See exactly which keywords are missing and their priority
- Receive actionable suggestions coded by severity (Critical/Warning/Tip)
- Work in English or Spanish

**How It Works:**
1. Analyzes job description for key requirements using GPT-4
2. Scores resume against ATS-style keyword and semantic matching
3. Returns structured JSON with score breakdown, missing keywords, and suggestions
4. Displays results with visual severity coding and clear next steps

**Key Features:**
- Privacy-first (no data stored, processed in real-time)
- Bilingual (EN/ES) with full internationalization
- Clerk auth (Google, LinkedIn, email/password)
- Stripe-powered premium subscriptions
- Neon Postgres for user profiles and usage tracking

## Technical Highlights

- **Structured AI Output:** GPT-4 with JSON mode for type-safe, deterministic responses
- **Semantic Matching:** Beyond keyword counting — understands context and intent
- **Full-stack Type Safety:** TypeScript frontend with Python backend contracts
- **Production Infrastructure:** Auto-deploy via Vercel + Render, health checks, CORS config
- **SaaS Monetization:** Stripe embedded checkout with guest-to-paid conversion flow

## Results

Live at [ai-resume-tailor-client.vercel.app](https://ai-resume-tailor-client.vercel.app). This is a production SaaS product demonstrating full-stack AI integration, modern authentication, payment processing, and bilingual UX — built end-to-end as the flagship product of CushLabs AI Services.
