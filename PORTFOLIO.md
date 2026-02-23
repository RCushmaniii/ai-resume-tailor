---
# === CONTROL FLAGS ===
portfolio_enabled: true
portfolio_priority: 1
portfolio_featured: true

# === CARD DISPLAY ===
title: "AI Resume Tailor"
tagline: "AI-powered ATS resume optimization with bilingual support and instant feedback"
slug: "ai-resume-tailor"
category: "AI SaaS"
tech_stack:
  - "React 19"
  - "Flask / Python"
  - "OpenAI GPT-4"
  - "Stripe"
  - "Neon PostgreSQL"
thumbnail: "/images/ai-resume-tailor-thumb.jpg"
status: "Production"

# === DETAIL PAGE ===
problem: "Over 75% of resumes are rejected by Applicant Tracking Systems before a human ever sees them. Most job seekers have no visibility into why they're filtered out, and existing tools either charge upfront, require accounts, or provide generic advice that isn't tied to the specific job posting."
solution: "A bilingual SaaS application that returns structured ATS analysis — match score, missing keywords with severity coding, and actionable suggestions — in under 10 seconds. Guests get 5 free analyses with no signup, and no resume data is ever stored."
key_features:
  - "Structured ATS analysis with 0-100 match score, keyword gaps, and severity-coded suggestions via GPT-4"
  - "Zero-friction guest access — 5 free analyses before any signup prompt, value delivered first"
  - "Full EN/ES bilingual support across all UI, error messages, and AI-generated analysis output"
  - "Privacy-first architecture — no resume data stored, processing happens in a single request/response cycle"
  - "Stripe embedded checkout with guest-to-paid conversion and Clerk auth (Google, LinkedIn, email)"

# === LINKS ===
demo_url: "https://ai-resume-tailor-client.vercel.app"
live_url: "https://ai-resume-tailor-client.vercel.app"

# === MEDIA: PORTFOLIO SLIDES ===
slides:
  - src: "/images/ai-resume-tailor-01.png"
    alt_en: "AI Resume Tailor — Bilingual ATS optimization that shows you exactly why resumes get rejected"
    alt_es: "AI Resume Tailor — Optimizacion ATS bilingue que te muestra exactamente por que rechazan tu CV"
  - src: "/images/ai-resume-tailor-02.png"
    alt_en: "The ATS Black Box — 75% of resumes rejected before a human sees them, zero visibility into why"
    alt_es: "La Caja Negra del ATS — 75% de CVs rechazados antes de que un humano los vea, sin visibilidad del por que"
  - src: "/images/ai-resume-tailor-03.png"
    alt_en: "Structured Analysis — 0-100 match score with keyword gaps and severity-coded suggestions"
    alt_es: "Analisis Estructurado — puntuacion de coincidencia 0-100 con brechas de palabras clave y sugerencias codificadas"
  - src: "/images/ai-resume-tailor-04.png"
    alt_en: "Missing Keywords Detected — severity-coded priority indicators showing exactly what to fix first"
    alt_es: "Palabras Clave Faltantes Detectadas — indicadores de prioridad codificados mostrando que corregir primero"
  - src: "/images/ai-resume-tailor-05.png"
    alt_en: "Zero Friction — 5 free analyses with no signup, no email, no commitment required"
    alt_es: "Cero Friccion — 5 analisis gratis sin registro, sin email, sin compromiso requerido"
  - src: "/images/ai-resume-tailor-06.png"
    alt_en: "Full Bilingual Support — native English and Spanish across UI, analysis, and AI-generated feedback"
    alt_es: "Soporte Bilingue Completo — ingles y espanol nativo en UI, analisis y retroalimentacion generada por IA"
  - src: "/images/ai-resume-tailor-07.png"
    alt_en: "Privacy by Architecture — no resume data stored, analysis happens in a single request/response cycle"
    alt_es: "Privacidad por Arquitectura — ningun dato de CV almacenado, analisis en un solo ciclo solicitud/respuesta"
  - src: "/images/ai-resume-tailor-08.png"
    alt_en: "Stripe Embedded Checkout — guest-to-paid conversion with no signup wall before purchase"
    alt_es: "Checkout Integrado de Stripe — conversion de invitado a pago sin muro de registro antes de la compra"
  - src: "/images/ai-resume-tailor-09.png"
    alt_en: "Clerk Authentication — Google, LinkedIn, and email/password with automatic Neon profile provisioning"
    alt_es: "Autenticacion Clerk — Google, LinkedIn y email/contrasena con aprovisionamiento automatico de perfil en Neon"
  - src: "/images/ai-resume-tailor-10.png"
    alt_en: "Full-Stack Architecture — React 19 on Vercel, Flask on Render, Neon Postgres, Stripe, Clerk"
    alt_es: "Arquitectura Full-Stack — React 19 en Vercel, Flask en Render, Neon Postgres, Stripe, Clerk"
  - src: "/images/ai-resume-tailor-11.png"
    alt_en: "Results — structured feedback in under 10 seconds, zero data retention, full bilingual coverage"
    alt_es: "Resultados — retroalimentacion estructurada en menos de 10 segundos, cero retencion de datos, cobertura bilingue"

# === MEDIA: VIDEO ===
video_url: "/video/ai-resume-tailor-brief.mp4"
video_poster: "/video/ai-resume-tailor-brief-poster.jpg"

# === OPTIONAL ===
metrics:
  - "Structured ATS feedback in under 10 seconds"
  - "5 free analyses before any signup prompt"
  - "Zero resume data stored — privacy by architecture"
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
date_completed: "2026-02"
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
