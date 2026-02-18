# AI Resume Tailor - Portfolio Project

Here's the thing: 75% of resumes never reach human eyes. They're filtered out by automated systems that speak a language job seekers don't understand.

I built AI Resume Tailor to translate that language into clear, actionable feedback.

---

## The Power Move

Stop guessing what recruiters want. Get instant AI analysis that shows exactly how your resume matches any job description — with a match score, missing keywords, and severity-coded suggestions to fix the gaps.

Sign up with Google or LinkedIn, or try it as a guest. Upgrade via Stripe for premium features.

---

## How It Crushes

**Instant Match Scoring**
0-100 compatibility score with granular breakdown (keywords, semantic, tone). Know exactly where you stand before you apply.

**Missing Keywords Revealed**
Priority-ranked keywords (Critical/Warning/Tip) that ATS systems scan for. Stop getting filtered out for missing terms.

**GPT-4 Powered Suggestions**
Actionable improvements based on semantic understanding. Not just keyword stuffing — real, meaningful enhancements.

**Bilingual Support**
Full English and Spanish interface with culturally adapted terminology.

**Privacy-First Design**
Your resume is processed once and discarded. No data storage, no tracking, no selling your information.

---

## The Tech Stack

Built like a production SaaS, not a weekend hack:

- **Frontend:** React 19 + TypeScript + Tailwind CSS + shadcn/ui (Vercel)
- **Backend:** Flask API with Python 3.11 (Render)
- **AI Engine:** OpenAI GPT-4 with structured JSON output
- **Auth:** Clerk (Google OAuth, LinkedIn OAuth, email/password)
- **Database:** Neon Serverless Postgres
- **Payments:** Stripe (embedded checkout, subscriptions, webhooks)
- **Security:** Multi-layer validation, CORS configuration, input sanitization
- **CI/CD:** Auto-deployment from GitHub with health checks

---

## Real Production Challenges

These lessons came from actual deployment headaches:

**CORS Hell:** Vercel's preview URLs (\*.vercel.app) break standard CORS configs. Solved with wildcard patterns that handle infinite preview environments.

**Cold Start Reality:** Render's free tier spins down after inactivity. Implemented 30-50 second loading states with user education ("Waking up server...").

**Environment Variable Nightmares:** Vite bakes variables at build time, not runtime. Learned cache-busting strategies the hard way.

**Security by Design:** Prevented XSS attacks with multi-layer validation — client-side regex patterns, server-side sanitization, length limits.

---

## What Makes This Different

**Not Another Template**
This is a live SaaS product with auth, payments, and a real database — not a static portfolio piece.

**Production-Ready Architecture**
Real-world concerns: rate limiting, health checks, environment management, security layers, monitoring hooks.

**Cross-Border Perspective**
Built from Guadalajara, Mexico with bilingual support (EN/ES) and cultural awareness for global markets.

**Enterprise Discipline, Solopreneur Speed**
Fortune 500 execution standards without the bureaucracy. Clean code, thorough documentation, rapid iteration.

---

## The Results

- **Live App:** https://ai-resume-tailor-client.vercel.app
- **Source Code:** https://github.com/RCushmaniii/ai-resume-tailor
- **Tech Stack:** React, Flask, GPT-4, Clerk, Neon, Stripe
- **Documentation:** Complete setup guides, API docs, deployment instructions
- **Legal:** Privacy Policy, Terms of Service, Cookie Policy

---

## Who This Is For

**Technical Recruiters:** See full-stack SaaS capability — auth, payments, AI, database, deployment.

**Hiring Managers:** Understand problem-solving approach through real production challenges.

**Potential Clients:** Demonstrate ability to deliver production AI applications with proper security and deployment.

**Fellow Developers:** Reference implementation for React + Flask + OpenAI + Clerk + Stripe integration.

---

## The Bigger Picture

This isn't just a resume analyzer — it's a demonstration of:

- **AI Integration:** How to properly integrate GPT-4 into web applications
- **SaaS Development:** Auth, payments, database, feature gating
- **Full-Stack Development:** Frontend, backend, deployment, security
- **Product Thinking:** User experience, privacy concerns, scalability
- **Professional Execution:** Documentation, legal compliance, testing

---

## About the Builder

**Robert Cushman**
Founder, CushLabs AI Services
Guadalajara, Mexico

17 years of enterprise execution discipline. 8 years building cross-border bridges between US and Mexican markets. I translate complex technical challenges into practical business solutions.

info@rankitbetter.com
[GitHub](https://github.com/RCushmaniii) | [LinkedIn](https://linkedin.com/in/robertcushman) | [Portfolio](https://rankitbetter.com)

---

**MIT License - Free to use for personal or commercial projects**

_Updated: February 2026_
