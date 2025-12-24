# AI Resume Tailor - Cascade Startup Guide

## 🚀 Quick Context

**Project**: AI Resume Tailor - Full-stack resume analysis application  
**Live Demo**: https://ai-resume-tailor-client.vercel.app  
**Repository**: https://github.com/RCushmaniii/ai-resume-tailor  
**DeepWiki**: https://deepwiki.com/RCushmaniii/ai-resume-tailor

## 📋 Project Overview

A production-ready web application that analyzes resumes against job descriptions using OpenAI GPT-4. Built with React + TypeScript (frontend) and Flask + Python (backend), deployed on Vercel (frontend) and Render (backend).

### Key Features

- Real-time resume analysis with AI-powered match scoring
- Missing keyword detection and prioritization
- Actionable improvement suggestions with severity coding
- **Pro monetization**: Stripe payment integration for premium features
- **Resume rewriting**: AI-powered resume optimization (Pro feature)
- **Free tier limitations**: 5 free analyses for guest users
- **Developer tools**: Built-in reset functionality for testing
- Bilingual support (EN/ES) with persisted language toggle
- Privacy-first (no data storage)
- Production deployment with CI/CD

## 🏗️ Architecture

```
Frontend (Vercel): React 19 + TypeScript + Vite + Tailwind + shadcn/ui + Stripe
Backend (Render):  Flask 3 + Python 3.11 + Gunicorn + OpenAI API + Stripe
```

### Key Directories

- `client/` - React frontend with i18n support
- `server/` - Flask API with OpenAI integration
- `docs/` - Consolidated documentation (no README.md here)
- `.windsurf/` - Cascade configuration and rules

## 🎯 Current State

### Completed Phases

- ✅ **Phase 0**: Project scaffold and FE/BE connectivity
- ✅ **Phase 1**: Core analysis engine with structured JSON output
- ✅ **Phase 2**: Form validation and security features
- ✅ **Phase 3**: World-class UI components and visualizations
- ✅ **Phase 4**: Monetization system with Stripe integration
- ✅ **Bilingual UX**: EN/ES support with error code localization
- ✅ **Documentation**: Consolidated and organized

### Recent Work

- **Stripe Payment Integration**: Complete checkout flow with session creation and verification
- **Pro Features**: Resume rewriting and cover letter generation for paid users
- **Free Tier Management**: 5-analysis limit with session-based tracking
- **Developer Tools**: Built-in reset endpoint for testing (`/api/dev/reset`)
- **World-Class UI**: Enhanced AnalysisReport, MatchScoreCard, and ResultsSection components
- **CORS Enhancement**: Multi-port support for flexible development
- **Session Management**: Flask signed cookies for usage tracking

## 📚 Essential References

### Primary Documentation

1. **[Main README.md](../README.md)** - Complete project overview + docs index
2. **[DeepWiki](https://deepwiki.com/RCushmaniii/ai-resume-tailor)** - AI-powered interactive documentation
3. **[Global Rules](./global_rules.md)** - Core coding principles (SRP, DRY, SoC, SOLID)

### Key Setup Files

- `docs/setup/SETUP.md` - Local development setup
- `docs/development/DEPLOYMENT.md` - Production deployment guide
- `server/requirements.txt` - Python dependencies
- `client/package.json` - Node.js dependencies

### Phase Documentation

- `docs/phases/PHASE_0.md` - Project scaffold
- `docs/phases/PHASE_1.md` - Core analysis engine (planned)
- `docs/phases/PHASE_2.md` - User experience and validation

## 🔧 Development Workflow

### Local Development

```bash
# Option 1: Use the batch file (recommended)
START_DEV.bat

# Option 2: Manual startup
# Backend (port 5000)
cd server && venv\Scripts\activate && python app.py

# Frontend (port 3000/3001/3002 - auto-detects available port)
cd client && npm run dev
```

### Development URLs

- **Frontend**: http://localhost:3000 (or 3001/3002 if 3000 is busy)
- **Backend**: http://localhost:5000
- **Developer Reset**: http://localhost:5000/api/dev/reset (resets free analysis limit)

### Key Environment Variables

- `server/.env`: `OPENAI_API_KEY`, `FRONTEND_URL`, `STRIPE_SECRET_KEY`, `FLASK_SECRET_KEY`
- `client/.env`: `VITE_API_URL`, `VITE_STRIPE_PUBLISHABLE_KEY`

### Verification Commands

```bash
pnpm -C client verify    # Typecheck + lint + build
python -m py_compile server/app.py  # Server syntax check
```

## 🌍 Internationalization

### Implementation

- **Libraries**: `react-i18next` + `i18next`
- **Locales**: `en.ts` and `es.ts` in `client/src/i18n/`
- **Persistence**: Language preference saved in localStorage
- **Error Handling**: Backend `error_code` mapped to client translations

### Key Files

- `client/src/lib/i18n.ts` - i18n configuration
- `client/src/components/layout/LanguageToggle.tsx` - Language switcher
- `client/src/i18n/en.ts` & `es.ts` - Translation keys

## � Monetization & Pro Features

### Stripe Integration

- **Payment Flow**: Complete Stripe Checkout integration with hosted payment pages
- **Pro Features**: Resume rewriting and cover letter generation ($4.99 one-time)
- **Backend APIs**:
  - `/api/create-checkout-session` - Creates Stripe checkout session
  - `/api/verify-payment` - Verifies payment completion
- **Frontend Integration**: PricingModal with loading states and redirect handling

### Free Tier Management

- **Usage Limit**: 5 free analyses per guest user
- **Tracking**: Flask signed sessions with `usage_count`
- **Developer Reset**: `/api/dev/reset` endpoint for testing
- **Upsell Flow**: Smart upsell prompts for scores < 85%

### Environment Variables for Payments

```bash
# Server .env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Client .env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

## � Security & Validation

### Frontend Validation

- Malicious pattern detection (XSS prevention)
- Input length limits (200-10,000 characters)
- Real-time validation feedback

### Backend Security

- Content sanitization before OpenAI API calls
- CORS configuration for multi-port development support
- Environment-based configuration
- Session-based usage tracking with signed cookies
- Stripe webhook verification for payment security

## 🚀 Deployment

### Production URLs

- Frontend: https://ai-resume-tailor-client.vercel.app
- Backend: https://ai-resume-tailor-hxpr.onrender.com

### CI/CD Pipeline

- Auto-deploy on push to `main` branch
- Separate deployments for frontend and backend
- Environment variable management via platform dashboards

## 🎛️ Cascade-Specific Guidelines

### When Working on This Project

1. **Always reference DeepWiki** for architecture understanding
2. **Follow global coding principles** (SRP, DRY, SoC, SOLID)
3. **Maintain bilingual support** - all new UI text must have i18n keys
4. **Preserve privacy-first approach** - no user data storage
5. **Test both locales** when making UI changes

### Common Tasks

- **Adding new features**: Update both `en.ts` and `es.ts` translation files
- **Backend changes**: Add corresponding `error_code` translations if needed
- **UI components**: Follow existing shadcn/ui patterns and accessibility standards
- **Documentation updates**: Keep main README.md as single source of truth

### File Organization Rules

- **Only one README.md** - in project root
- **Descriptive filenames** - no generic README.md in subdirectories
- **Consolidated docs** - use purpose-specific names (e.g., `API_REFERENCE.md`)

## 🔍 Quick Troubleshooting

### Common Issues

- **CORS errors**: Check `FRONTEND_URL` environment variable and port configuration
- **Build failures**: Run `pnpm -C client verify`
- **API errors**: Verify OpenAI API key and backend health
- **i18n issues**: Check translation keys in both language files
- **Stripe errors**: Verify Stripe keys in both server and client .env files
- **Free limit issues**: Use `/api/dev/reset` to reset usage for testing
- **Virtual environment**: Ensure Stripe is installed in `server/venv`

### Debug Commands

```bash
# Test backend health
curl http://localhost:5000/api/health

# Verify frontend build
pnpm -C client build

# Check Python dependencies
pip install -r server/requirements.txt

# Install missing Stripe in virtual environment
cd server && venv\Scripts\activate && pip install stripe

# Test developer reset
curl http://localhost:5000/api/dev/reset
```

---

## 📞 Project Context

**Developer**: Robert Cushman  
**Location**: Guadalajara, Mexico  
**Purpose**: Portfolio project demonstrating full-stack development, AI integration, and production deployment  
**Tech Stack**: Modern web development with emphasis on type safety, accessibility, and internationalization

---

_Last Updated: Always reference the main README.md and DeepWiki for the most current information_
