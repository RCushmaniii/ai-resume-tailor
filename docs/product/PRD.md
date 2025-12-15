# Product Requirements Document (PRD)

## 1. Overview

- **Product Name**: AI Resume Tailor
- **Author / Owner**: Robert Cushman
- **Date / Version**: 2025-11-12 / v1.0.1
- **Status**: Live (MVP)

### 1.1 Purpose

AI Resume Tailor helps job seekers understand how well their resume matches a specific job description by returning:

- A quantified match score (0-100)
- A score breakdown (keyword overlap, semantic match, structure)
- Missing keywords with priority
- Actionable improvement suggestions

### 1.2 Background

Many resumes are rejected by Applicant Tracking Systems (ATS) before reaching recruiters. Applicants often lack feedback on what to improve. This product provides fast, privacy-first analysis without requiring signup.

---

## 2. Goals & Objectives

- **Primary Goal**: Deliver clear, actionable resume-to-job fit feedback in under a minute.
- **Secondary Goals**:
  - Keep UX “zero friction” (no signup, no stored user data)
  - Provide robust validation and user-friendly errors
  - Support production deployment (frontend + backend) with environment-based configuration
- **Success Metrics / KPIs**:
  - Typical analysis latency: 2-5 seconds (excluding cold starts)
  - Client-visible errors are actionable (not generic “Failed to fetch”)
  - Low invalid-request rate due to validation (client + server)

---

## 3. Problem Statement

- **Who is affected?** Job seekers applying to roles where ATS filtering is used.
- **What’s inefficient today?** Applicants guess why they are not a match; feedback loops are slow and inconsistent.

---

## 4. Proposed Solution

### 4.1 High-Level Concept

A web app where the user pastes resume text and a job description, then receives an AI-generated structured report showing fit, gaps, and improvements.

### 4.2 Scope

- **In Scope**:
  - Text-only resume + job description input (paste)
  - Server-side OpenAI analysis via Flask API
  - Match score + breakdown + missing keywords + suggestions
  - Input validation and suspicious-pattern blocking (client and server)
  - Privacy-first operation (no persistence layer / no database)
- **Out of Scope**:
  - User accounts, saved history, or resume storage
  - Payments/subscriptions
  - PDF upload/parsing (future enhancement)
  - Guaranteed ATS “pass” or hiring outcomes

### 4.3 Key Features

- Resume vs Job Description analysis
- Missing keyword detection (priority-ranked)
- Improvement suggestions
- Health check endpoint for backend availability
- User-friendly error handling (timeouts, validation errors)

---

## 5. Users & Use Cases

### 5.1 Personas

- **Job Seeker**: Wants quick feedback to improve match and pass ATS screens.
- **Career Coach (Secondary)**: Wants a repeatable tool to guide resume improvements.

### 5.2 User Stories

- As a job seeker, I want a match score and missing keywords, so I know what to fix.
- As a job seeker, I want suggestions in plain language, so I can update my resume efficiently.
- As a user, I want my data not stored, so I can safely paste sensitive resume content.

### 5.3 Use Cases

- User opens `/analyze`
- User pastes resume text and job description
- Client validates content (length and suspicious patterns)
- Client POSTs to backend `/api/analyze`
- Backend validates and calls OpenAI once
- Client renders results and enables “Analyze Again”

---

## 6. User Experience (UX)

- **User Flows**:
  - Input → Validation → Loading → Results → Re-analyze
- **Wireframes / Mockups**:
  - Implemented directly in the UI (component-driven).
- **Accessibility Considerations**:
  - ARIA labels on inputs
  - Keyboard navigation
  - Color + text for status/priority indicators

---

## 7. Functional Requirements

- The system must reject requests when resume or job description is empty.
- The system must enforce input length constraints:
  - Resume: minimum 200 characters, maximum 10,000 characters
  - Job description: minimum 100 characters, maximum 10,000 characters
- The system must reject suspicious content (e.g., `<script>`, `javascript:`, event handlers) on both client and server.
- The backend must expose:
  - `GET /api/health`
  - `POST /api/analyze`
- The `/api/analyze` response must include at minimum:
  - `match_score` (0-100)
  - `score_breakdown.keyword_overlap`, `score_breakdown.semantic_match`, `score_breakdown.structure` (0-100)
  - `missing_keywords[]` with `priority` in `high|medium|low`
  - `improvement_suggestions[]`

---

## 8. Non-Functional Requirements

- **Performance**:
  - Typical response time target: <5 seconds (excluding cold start)
  - Client timeout: 30 seconds
- **Scalability**:
  - Single-request OpenAI call per analysis; costs scale with usage
- **Reliability**:
  - Health endpoint supports monitoring
- **Security & Privacy**:
  - No database; no storage of resume/job text
  - Env-var based secret management for OpenAI key
  - CORS restricted by `FRONTEND_URL` in production
- **Compliance**:
  - No formal compliance guarantees; user-provided text should not be stored

---

## 9. Constraints & Assumptions

- **Constraints**:
  - OpenAI usage has variable cost per request.
  - Free-tier hosting may introduce cold starts.
- **Assumptions**:
  - Users provide plain text (not PDFs) for MVP.
  - Internet access is required (OpenAI API call).

---

## 10. Risks & Mitigations

- Abuse / high request volume → Add rate limiting (future), consider CAPTCHA.
- Increased costs with growth → Add caching, quotas, or authentication (future).
- Cold starts on free hosting → UX messaging + loading states.
- Model output variability → Strict JSON schema + validation/clamping.

---

## 11. Release Plan

- **MVP Scope (current)**:
  - Live frontend (Vercel) + backend (Render)
  - Text input analysis and results UI
  - Validation + error handling
- **Future Enhancements (not committed)**:
  - PDF upload/parsing
  - Exportable reports
  - Caching + rate limiting
  - Side-by-side comparison of multiple resumes

---

## 12. Metrics & Analytics

- Health checks and uptime monitoring via hosting provider dashboards.
- API latency and error rate via backend logs.
- OpenAI usage and cost via OpenAI dashboard.

---

## 13. Open Questions

- Should the backend support `job_url` ingestion (fetch + clean) as an official feature?
- Should the app support bilingual UX (en/es) as a requirement for MVP or a later phase?
- Should results include additional breakdown dimensions beyond the current three?

---

## 14. Appendix

- Main project overview: `/README.md`
- Backend docs: `/docs/backend/*`
- Security testing guide: `/docs/development/TESTING_VALIDATION.md`
