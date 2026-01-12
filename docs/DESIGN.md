---
title: Design System & UI Spec
description: Visual system and UI guidelines for AI Resume Tailor.
category: Design
order: 2
---

# AI Resume Tailor — Design & Technical Specification

A comprehensive design document covering visual system, component patterns, internationalization, and UI implementation.

---

## 1. Brand Identity

### Brand Name

**AI Resume Tailor**

### Brand Positioning

AI-powered resume optimization tool for job seekers. Positioned as helpful, privacy-focused, and results-driven — professional guidance without complexity.

### Brand Voice

- Clear and actionable
- Supportive and encouraging
- Privacy-conscious and trustworthy
- Bilingual (English/Spanish) by design

---

## 2. Color Palette

### Primary Colors

| Name          | Hex       | RGB          | Usage                       |
| ------------- | --------- | ------------ | --------------------------- |
| Primary Blue  | `#3B82F6` | 59, 130, 246 | Primary actions, links      |
| Success Green | `#10B981` | 16, 185, 129 | Success states, high scores |
| Warning Amber | `#F59E0B` | 245, 158, 11 | Warnings, medium priority   |
| Error Red     | `#EF4444` | 239, 68, 68  | Errors, critical issues     |

### Severity Coding (Analysis Results)

| Severity | Color | Usage                         |
| -------- | ----- | ----------------------------- |
| Critical | Red   | Missing critical keywords     |
| Warning  | Amber | Important improvements needed |
| Tip      | Blue  | Optional enhancements         |

### Secondary / UI Colors

| Name       | Usage                      |
| ---------- | -------------------------- |
| Background | Main page background       |
| Card       | Card/panel backgrounds     |
| Border     | Borders, dividers          |
| Muted      | Disabled/inactive elements |
| Foreground | Primary text               |
| Secondary  | Secondary text             |

### Component-Specific Colors

| Component        | Color Usage                                |
| ---------------- | ------------------------------------------ |
| Score Circle     | Gradient based on score (red→yellow→green) |
| Keyword Badges   | Green (present), Red (missing)             |
| Suggestion Cards | Severity-coded borders and icons           |

---

## 3. Typography

### Font Stack

| Role     | Font Family | Weights            | Source     |
| -------- | ----------- | ------------------ | ---------- |
| All Text | Inter       | 400, 500, 600, 700 | System/CDN |

### Type Scale (Fluid)

All sizes use `clamp()` for smooth scaling between mobile (320px) and desktop (1440px+):

| Token     | Mobile   | Desktop  | CSS Variable  |
| --------- | -------- | -------- | ------------- |
| text-xs   | 0.75rem  | 0.875rem | `--text-xs`   |
| text-sm   | 0.875rem | 1rem     | `--text-sm`   |
| text-base | 1rem     | 1.125rem | `--text-base` |
| text-lg   | 1.125rem | 1.375rem | `--text-lg`   |
| text-xl   | 1.25rem  | 1.625rem | `--text-xl`   |
| text-2xl  | 1.5rem   | 2.25rem  | `--text-2xl`  |
| text-3xl  | 2rem     | 3.5rem   | `--text-3xl`  |
| text-4xl  | 2.5rem   | 5rem     | `--text-4xl`  |
| text-5xl  | 3rem     | 7rem     | `--text-5xl`  |

### Typography Settings

| Element        | Font  | Weight | Line Height |
| -------------- | ----- | ------ | ----------- |
| Page Titles    | Inter | 700    | 1.2         |
| Section Titles | Inter | 600    | 1.3         |
| Card Titles    | Inter | 600    | 1.4         |
| Body Text      | Inter | 400    | 1.6         |
| Labels         | Inter | 500    | 1.5         |

---

## 4. Layout System

### Container

| Property      | Value        |
| ------------- | ------------ |
| Max Width     | 1280px       |
| Content Width | 90% (mobile) |
| Padding       | 1rem - 2rem  |

### Spacing Scale (Tailwind)

| Token | Value  | Usage                 |
| ----- | ------ | --------------------- |
| 2     | 0.5rem | Tight spacing         |
| 4     | 1rem   | Standard spacing      |
| 6     | 1.5rem | Section spacing       |
| 8     | 2rem   | Large section spacing |
| 12    | 3rem   | Major section breaks  |

### Key Layouts

**Analysis Form:**

- Two-column on desktop (resume | job description)
- Single column on mobile
- Responsive breakpoint: 768px

**Results Display:**

- Hero section (score + summary)
- Grid layout for score breakdown
- List layout for suggestions

---

## 5. Current App Implementation Notes

### Language (EN/ES)

- UI strings use `react-i18next` for internationalization
- Translation files: `src/i18n/en.ts` and `src/i18n/es.ts`
- Components use `useTranslation()` hook
- Language switcher in header/footer
- Browser language detection on first visit

### Theme (Light/Dark)

- Tailwind CSS with shadcn/ui theming
- CSS variables defined in `src/index.css`
- Theme toggle component in navigation
- System preference detection

---

## 6. React / Interaction Notes

- This project uses React 19 + Vite
- Client-side routing with React Router DOM
- API calls to Flask backend for AI analysis

### Component Architecture

- Reusable UI components in `src/components/ui/`
- Feature-specific components in `src/components/analyze/`
- Page components in `src/pages/`
- Keep business logic in utility functions and hooks

---

## 7. Animation Specifications

### Loading States

| Component        | Animation     | Duration | Purpose                 |
| ---------------- | ------------- | -------- | ----------------------- |
| AnalysisSkeleton | Pulse         | 2s       | Loading placeholder     |
| Score Circle     | Circular wipe | 1s       | Score reveal            |
| Suggestion Cards | Fade in       | 300ms    | Staggered card entrance |

### Transitions

| Element          | Property   | Duration | Easing      |
| ---------------- | ---------- | -------- | ----------- |
| Button hover     | background | 200ms    | ease-in-out |
| Card hover       | shadow     | 200ms    | ease-in-out |
| Modal open/close | opacity    | 300ms    | ease-out    |

### Micro-interactions

| Interaction     | Effect                  |
| --------------- | ----------------------- |
| Clear button    | Scale on hover          |
| Language toggle | Smooth slide transition |
| Toast messages  | Slide in from top       |

---

## 8. Responsive Breakpoints

| Breakpoint | Width   | Changes                           |
| ---------- | ------- | --------------------------------- |
| Mobile     | < 640px | Single column, stacked inputs     |
| Tablet     | < 768px | Two-column form, adjusted spacing |
| Desktop    | 768px+  | Full layout, side-by-side inputs  |
| Large      | 1024px+ | Wider containers, more whitespace |

---

## 9. Accessibility Compliance

### WCAG 2.1 AA Checklist

| Criterion                | Status | Implementation                                |
| ------------------------ | ------ | --------------------------------------------- |
| 1.1.1 Non-text Content   | ✅     | Alt text on images, aria-hidden on decorative |
| 1.4.3 Contrast (Minimum) | ✅     | 7:1+ for body text on dark background         |
| 1.4.10 Reflow            | ✅     | Responsive down to 320px                      |
| 2.1.1 Keyboard           | ✅     | All interactive elements focusable            |
| 2.3.1 Three Flashes      | ✅     | No flashing content                           |
| 2.4.1 Bypass Blocks      | ✅     | Semantic sections                             |
| 2.5.5 Target Size        | ✅     | Buttons meet 44×44px minimum                  |
| 3.1.1 Language of Page   | ✅     | `<html lang>` attribute                       |

### Reduced Motion Support

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 10. Technical SEO Implementation

### Metadata Strategy

- React Helmet or similar for dynamic meta tags
- Page titles follow pattern: "[Page Name] | AI Resume Tailor"
- Meta descriptions for key pages (home, analyze, about)
- Open Graph tags for social sharing

### Semantic HTML

- Proper heading hierarchy (h1 → h2 → h3)
- Semantic elements (nav, main, section, article)
- ARIA labels for accessibility
- Alt text for all images

---

## 11. Documentation Files

- `README.md` — Project overview and quick start
- `docs/product/PRD.md` — Product requirements
- `docs/DESIGN.md` — Design system (this file)
- `docs/backend/AI_ENGINE.md` — AI analysis engine
- `docs/development/DEPLOYMENT.md` — Deployment guide
- `docs/product/ROADMAP.md` — Feature roadmap

---

## 12. Version History

| Version | Date    | Changes                                           |
| ------- | ------- | ------------------------------------------------- |
| 1.0.0   | 2024-12 | Initial MVP release                               |
| 1.0.1   | 2024-12 | Input validation and security improvements        |
| 1.0.2   | 2024-12 | Bilingual support (EN/ES)                         |
| 2.0.0   | 2025-12 | Structured JSON output, world-class UI components |

---

_AI Resume Tailor — Portfolio Project by Robert Cushman_
