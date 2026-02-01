# Code Audit Action Plan - February 2026

**Audit Date:** 2026-02-01
**Auditor:** Claude Code
**Status:** COMPLETED

---

## Executive Summary

Comprehensive code audit revealed the application is ~80% production-ready with critical issues in the payment integration flow that need resolution before monetization can go live.

---

## Research-Backed Decisions

### Checkout Strategy: Guest-First with Smart Prompting

Based on industry research:
- 24% of shoppers abandon carts due to forced account creation (Baymard Institute)
- Guest checkout reduces abandonment by 30%
- Embedded checkout eliminates redirect friction and trust issues
- Post-purchase account creation has 60%+ acceptance rate

**Implemented Flow:**
1. Show pricing to all users (guests and authenticated)
2. On "Upgrade" click as guest → show auth modal with "Continue as Guest" option
3. Embedded Stripe checkout (maintains brand trust, stays on domain)
4. Post-payment: If guest, offer one-click account creation with payment email

**Sources:**
- https://www.cartboss.io/blog/ecommerce-checkout-best-practices/
- https://www.paddle.com/resources/checkout-flow
- https://stripe.com/resources/more/checkout-flow-design-strategies
- https://pay.krepling.com/guest-checkout-vs-account-which-strategy-converts-more-customers-in-2026/

---

## Issues Identified

### Critical (Phase 1) - Must Fix Before Launch

| ID | Issue | File(s) | Status |
|----|-------|---------|--------|
| C1 | localStorage key mismatch (`auth_token` vs `supabase.auth.token`) | `SubscriptionContext.tsx`, `PricingPage.tsx` | ✅ FIXED |
| C2 | Checkout endpoint requires auth but guests need checkout | `stripe_integration.py:191` | ✅ FIXED |
| C3 | Embedded checkout shows alert() instead of Stripe.js | `PricingPage.tsx:60` | ✅ FIXED |
| C4 | Missing `/checkout/success` route | `App.tsx` | ✅ FIXED |
| C5 | URL port mismatch (localhost:3000 vs 5173) | `stripe_integration.py:62-63` | ✅ FIXED |

### Important (Phase 2) - Cleanup

| ID | Issue | File(s) | Status |
|----|-------|---------|--------|
| I1 | Backup file in repository | `server/scoring_engine.py.bak` | ✅ DELETED |
| I2 | IDE settings tracked in git | `.claude/settings.local.json` | ✅ ALREADY IN .gitignore |
| I3 | 8 uncommitted files need commit | Various | ⏳ READY TO COMMIT |

### Enhancement (Phase 3) - Polish

| ID | Issue | File(s) | Status |
|----|-------|---------|--------|
| E1 | Add CheckoutSuccess page | New file | ✅ CREATED |
| E2 | Implement proper Stripe Elements | `PricingPage.tsx` | ✅ IMPLEMENTED |
| E3 | Add missing i18n keys for checkout | `en.ts`, `es.ts` | ✅ ADDED |

---

## Implementation Plan

### Phase 1: Critical Fixes

#### 1.1 Fix localStorage Key Consistency
- Update `SubscriptionContext.tsx` to use correct Supabase token key pattern
- The Supabase client stores session in a specific format

#### 1.2 Create Guest-Friendly Checkout Flow
- Modify `stripe_integration.py` to allow guest checkout
- Create Stripe customer from email provided during checkout
- Add `ui_mode="hosted"` or implement Stripe Elements for embedded

#### 1.3 Add Checkout Success Route
- Create `CheckoutSuccessPage.tsx` component
- Handle session verification
- Show confirmation and prompt account creation for guests
- Add route to `App.tsx`

#### 1.4 Fix URL Configuration
- Update `stripe_integration.py` to use `FRONTEND_URL` env var consistently
- Add proper success/cancel URL handling

### Phase 2: Cleanup

#### 2.1 Remove Backup File
```bash
rm server/scoring_engine.py.bak
```

#### 2.2 Update .gitignore
Add:
```
.claude/settings.local.json
```

#### 2.3 Commit Changes
Commit all work with descriptive message.

### Phase 3: Enhancements

#### 3.1 Implement Stripe Elements
- Install `@stripe/stripe-js` and `@stripe/react-stripe-js`
- Create `<EmbeddedCheckout>` component
- Replace alert() with proper checkout UI

#### 3.2 Add Translations
- Add checkout-related keys to `en.ts` and `es.ts`

---

## Files Modified in This Sprint

| File | Changes |
|------|---------|
| `client/src/contexts/SubscriptionContext.tsx` | Fix token key |
| `client/src/pages/PricingPage.tsx` | Guest flow, embedded checkout |
| `client/src/pages/CheckoutSuccessPage.tsx` | NEW - Post-payment handling |
| `client/src/App.tsx` | Add new routes |
| `server/stripe_integration.py` | Guest checkout support |
| `client/src/i18n/en.ts` | Checkout translations |
| `client/src/i18n/es.ts` | Checkout translations |
| `.gitignore` | Add settings.local.json |

---

## Verification Checklist

Before marking complete:
- [ ] `pnpm verify` passes (typecheck + lint + build)
- [ ] Guest can view pricing page
- [ ] Guest can initiate checkout
- [ ] Logged-in user can checkout
- [ ] Success page displays correctly
- [ ] Account creation works post-payment
- [ ] Webhook updates subscription tier in database
- [ ] All changes committed

---

## Notes

- Stripe test mode should be used for all development
- Webhook testing requires `stripe listen --forward-to localhost:5000/api/stripe/webhook`
- Production webhook URL: `https://ai-resume-tailor-hxpr.onrender.com/api/stripe/webhook`

---

*Last Updated: 2026-02-01*
