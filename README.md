# AI Resume Tailor

**Live Demo:** [https://ai-resume-tailor-client.vercel.app](https://ai-resume-tailor-client.vercel.app)  
**Repository:** [github.com/RCushmaniii/ai-resume-tailor](https://github.com/RCushmaniii/ai-resume-tailor)

**Release:** v2.0.0 - World-Class Analysis System  
**Documentation:** See sections below for complete documentation index

Over 75% of resumes are rejected by Applicant Tracking Systems (ATS) before reaching human recruiters. AI Resume Tailor provides instant, AI-powered analysis that translates complex ATS requirements into clear, actionable feedback.

**🌟 World-Class Features:**

- **Structured AI Analysis** with JSON output for type-safe data handling
- **Bilingual Support** (English/Spanish) with full internationalization
- **Visual Severity Coding** for priority-based improvement guidance
- **Professional UI Components** with skeleton loaders and smooth animations
- **Real-time Validation** with character counting and smart error handling
- **💰 Pro Monetization** with Stripe integration for premium features
- **🔄 Developer Tools** including health check and reset utilities

---

## 🚀 Quick Start

### Health Check (Recommended)

```bash
cd client && npm run health-check
```

Run this first to verify your development environment is properly configured.

### Development Setup

```bash
# Option 1: Use the batch file (Windows)
START_DEV.bat

# Option 2: Manual startup
# Backend (port 5000)
cd server && venv\Scripts\activate && python app.py

# Frontend (port 3000)
cd client && npm run dev
```

### Contributing

📖 **See [CONTRIBUTING.md](./CONTRIBUTING.md)** for detailed development guidelines, code style, and contribution process.

## What It Does

AI Resume Tailor identifies exactly what recruiters want to see:

- **📊 Quantified Compatibility** via 0-100 match score with granular breakdown
- **🔍 Missing Keywords** with visual priority indicators (Critical/Warning/Tip)
- **📋 Actionable Suggestions** categorized by severity with color-coded cards
- **🌍 Bilingual Experience** supporting English and Spanish users
- **⚡ Real-time Feedback** with character limits and validation warnings

**Key Design Principles:**

- **Privacy-first** (no data storage, real-time processing only)
- **Zero-friction UX** (no signup required, instant access)
- **World-class Accessibility** (screen reader support, semantic HTML)
- **Production-ready Infrastructure** with auto-deployment

---

## Architecture

```
┌──────────────────┐         ┌───────────────────┐         ┌──────────────┐
│  React + Vite    │  HTTPS  │   Flask API       │   API   │   OpenAI     │
│  (Vercel)        │────────▶│   (Render)        │────────▶│   GPT-4      │
│                  │         │                   │         │              │
│ • World-class UI │         │ • Structured JSON │         │ • ATS-focused │
│ • i18n Support   │         │ • Type-safe       │         │   prompts    │
│ • Skeleton Loaders│         │ • Error handling  │         │ • Suggestions │
│ • Validation     │         │ • CORS config     │         │              │
└──────────────────┘         └───────────────────┘         └──────────────┘
        ↓                              ↓
   TypeScript types            Python 3.11 runtime
   Tailwind + shadcn/ui        Gunicorn WSGI server
   Internationalization        Environment-based config
```

---

## 🌟 World-Class Features

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
VITE_GUEST_CREDITS_TOTAL=5
```

**Render (Backend):**

```bash
OPENAI_API_KEY=sk-proj-xxxxx
OPENAI_MODEL=gpt-4o
FRONTEND_URL=https://ai-resume-tailor-client.vercel.app
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

## 🌟 Key Enhancements (v2.0.0)

### Analysis System Overhaul

- ✅ **Structured JSON Output** from OpenAI API
- ✅ **Type-Safe Interfaces** with backward compatibility
- ✅ **ATS-Focused Prompts** for better keyword matching
- ✅ **Low Temperature** responses for determinism

### World-Class UI Components

- ✅ **AnalysisReport** with hero section and visual hierarchy
- ✅ **AnalysisSkeleton** with layout-perfect loading states
- ✅ **ValidatedTextArea** with character counting and clear buttons
- ✅ **SuggestionsList** with severity-coded cards
- ✅ **MatchScoreCard** with compact donut chart design

### Internationalization & UX

- ✅ **Complete i18n Support** for English/Spanish
- ✅ **Visual Severity Coding** (red/amber/blue)
- ✅ **Success State Handling** for perfect matches
- ✅ **Smooth Animations** and micro-interactions
- ✅ **Accessibility Features** with semantic HTML

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
│   │   ├── components/      # World-class UI components
│   │   │   ├── analyze/     # Analysis-specific components
│   │   │   │   ├── AnalysisReport.tsx
│   │   │   │   ├── AnalysisSkeleton.tsx
│   │   │   │   ├── ValidatedTextArea.tsx
│   │   │   │   └── SuggestionsList.tsx
│   │   │   └── ui/          # Base UI components
│   │   ├── i18n/            # Internationalization
│   │   │   ├── en.ts        # English translations
│   │   │   └── es.ts        # Spanish translations
│   │   ├── lib/             # Utilities and helpers
│   │   └── types/           # TypeScript type definitions
│   └── public/              # Static assets
├── server/                  # Backend (Flask API)
│   ├── app.py               # Main Flask application
│   ├── ai_engine.py         # World-class AI analysis engine
│   └── requirements.txt     # Python dependencies
└── docs/                    # Documentation
    ├── setup/               # Setup and installation guides
    ├── development/         # Development workflows
    └── backend/             # API documentation
```

---

## 📚 Documentation Index

### 🧭 Start Here

- **[Quick Start](./docs/setup/SETUP.md)** - Run the app locally
- **[Setup Guide](./docs/setup/SETUP.md)** - Complete setup instructions

### 📦 Product

- **[PRD](./docs/product/PRD.md)** - Product requirements
- **[Roadmap](./docs/product/ROADMAP.md)** - Planned enhancements
- **[Monetization & Abuse Controls](./docs/product/MONETIZATION_AND_ABUSE_CONTROLS.md)** - Quotas, feature gating, and anti-abuse strategy

### 💻 Development

- **[Security](./docs/development/SECURITY.md)** - Security measures and validation
- **[Testing](./docs/development/TESTING.md)** - Consolidated testing guide
- **[Deployment Guide](./docs/development/DEPLOYMENT.md)** - Backend deployment instructions
- **[Supabase & Postgres Best Practices](./docs/development/SUPABASE_POSTGRES_BEST_PRACTICES.md)**
- **[Coding Principles](./docs/development/CODING_PRINCIPLES.md)**
- **[Changelog](./docs/development/CHANGELOG.md)**

### 🚀 Operations

- **[Deployment](./docs/operations/DEPLOYMENT.md)** - Brief deployment overview

### 🔧 Backend Documentation

- **[Backend API Reference](./docs/backend/API_REFERENCE.md)** - Backend API documentation
- **[AI Engine](./docs/backend/AI_ENGINE.md)** - World-class AI analysis engine documentation

---

## 📊 Project Status

✅ **Phase 0 Complete** - Project scaffold with FE/BE round-trip  
✅ **Phase 1 Complete** - Core analysis engine implementation  
✅ **Phase 2 Complete** - Form validation and security  
🌟 **v2.0.0 Complete** - World-class analysis system with i18n  
🚀 **Ready for Production Deployment**

---

## About This Project

Portfolio project demonstrating:

- **Full-stack Development** (React + TypeScript, Flask + Python)
- **AI/ML Integration** (OpenAI GPT-4 API with structured output)
- **World-Class UX** (Internationalization, accessibility, animations)
- **Production Deployment** with CI/CD (Vercel + Render)
- **Modern Architecture** (Type safety, component composition, i18n)
- **Security Configuration** (CORS, input validation, environment management)

---

## Contact

**Robert Cushman**  
Business Solution Architect & Full-Stack Developer  
Guadalajara, Mexico

📧 info@rankitbetter.com  
🔗 [GitHub](https://github.com/RCushmaniii) • [LinkedIn](https://linkedin.com/in/robertcushman) • [Portfolio](https://rankitbetter.com)

---

## License

MIT License - Free to use for personal or commercial projects.

---

_Updated: December 23, 2025 - v2.0.0 World-Class Analysis System_
