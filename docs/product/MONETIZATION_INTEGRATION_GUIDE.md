# AI Resume Tailor - Monetization Integration Guide

## Overview

This guide walks you through integrating the subscription/monetization system into your AI Resume Tailor application.

## Files Created

### Backend (Flask)

```
server/
├── stripe_integration.py    # Stripe API integration
```

### Frontend (React)

```
client/src/
├── contexts/
│   └── SubscriptionContext.jsx    # Subscription state management
├── components/
│   ├── subscription/
│   │   ├── index.js               # Export all subscription components
│   │   ├── LockedFeature.jsx      # Lock overlay for premium content
│   │   ├── UpgradeCard.jsx        # Feature promotion cards
│   │   ├── UpgradeBanner.jsx      # Upgrade banners (credit exhausted, etc)
│   │   ├── FeatureGate.jsx        # Conditional rendering gates
│   │   └── PremiumBadge.jsx       # Status badges and indicators
│   └── checkout/
│       ├── index.js               # Export checkout components
│       └── StripeCheckout.jsx     # Embedded checkout flow
├── pages/
│   └── PricingPage.jsx            # Pricing comparison page
└── routes-example.jsx             # Example router configuration
```

---

## Installation Steps

### Step 1: Install Dependencies

**Frontend:**

```powershell
cd client
npm install @stripe/stripe-js @stripe/react-stripe-js @heroicons/react
```

**Backend:**

```powershell
cd server
pip install stripe --break-system-packages
```

### Step 2: Stripe Dashboard Setup

1. Go to https://dashboard.stripe.com
2. Create a new product called "AI Resume Tailor Pro"
3. Add two prices:
   - Monthly: $12.00/month recurring
   - Annual: $79.00/year recurring
4. Copy the price IDs (they look like `price_xxx`)
5. Get your API keys from Developers → API Keys

### Step 3: Environment Variables

**Backend (.env):**

```env
# Stripe
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
STRIPE_PRICE_MONTHLY=price_xxx
STRIPE_PRICE_ANNUAL=price_xxx

# Frontend URL (for redirects)
FRONTEND_URL=http://localhost:3000
```

**Frontend (.env):**

```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
```

### Step 4: Register Stripe Routes

In your `app.py`, add:

```python
from stripe_integration import register_stripe_routes

# After app = Flask(__name__)
register_stripe_routes(app)
```

### Step 5: Database Schema (Supabase)

Run this SQL in Supabase:

```sql
-- Add subscription fields to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_tier TEXT DEFAULT 'free';
ALTER TABLE users ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'none';
ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_period_end TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN IF NOT EXISTS analyses_used_this_period INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS analyses_reset_date TIMESTAMPTZ;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_stripe_customer ON users(stripe_customer_id);
```

### Step 6: Frontend Integration

**Wrap your app with SubscriptionProvider:**

```jsx
// In App.jsx or main.jsx
import { SubscriptionProvider } from './contexts/SubscriptionContext';

function App() {
  return <SubscriptionProvider>{/* Your existing app */}</SubscriptionProvider>;
}
```

**Add routes:**

```jsx
import PricingPage from './pages/PricingPage';
import { CheckoutPage, CheckoutSuccessPage } from './components/checkout';

<Routes>
  {/* Existing routes */}
  <Route path="/pricing" element={<PricingPage />} />
  <Route path="/checkout" element={<CheckoutPage />} />
  <Route path="/checkout/success" element={<CheckoutSuccessPage />} />
</Routes>;
```

### Step 7: Stripe Webhook Setup

1. In Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://yourdomain.com/api/stripe/webhook`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. Copy the webhook signing secret to `STRIPE_WEBHOOK_SECRET`

**For local testing, use Stripe CLI:**

```powershell
stripe listen --forward-to localhost:5000/api/stripe/webhook
```

---

## Using Subscription Components

### Lock Premium Content

```jsx
import { LockedFeature } from './components/subscription';

<LockedFeature
  feature="resumeRewriter"
  title="AI Resume Rewriter"
  description="Automatically add missing keywords to your resume"
>
  <ResumeRewriterContent />
</LockedFeature>;
```

### Show Upgrade Cards

```jsx
import { UpgradeCard } from './components/subscription';

// Predefined cards
<UpgradeCard feature="resumeRewriter" />
<UpgradeCard feature="interviewPrep" />
<UpgradeCard feature="coverLetter" />
```

### Preview Gate for Lists

```jsx
import { PreviewGate, LockedCount } from './components/subscription';

<PreviewGate
  items={optimizationSuggestions}
  previewCount={2}
  feature="fullOptimizationPlan"
  renderItem={(item, i) => <SuggestionItem key={i} {...item} />}
  renderLocked={count => (
    <LockedCount
      count={count}
      singular="suggestion"
      plural="suggestions"
      feature="fullOptimizationPlan"
    />
  )}
/>;
```

### Auto Upgrade Banner

```jsx
import { AutoUpgradeBanner } from './components/subscription';

// Automatically shows appropriate banner based on state
<AutoUpgradeBanner score={result.score} />;
```

### Check Feature Access

```jsx
import { useFeatureAccess } from './contexts/SubscriptionContext';

function MyComponent() {
  const { hasAccess, isPaid } = useFeatureAccess('resumeRewriter');

  if (hasAccess) {
    return <PremiumContent />;
  }

  return <UpgradePrompt />;
}
```

### Usage Indicator

```jsx
import { UsageIndicator, UsageBadge } from './components/subscription';

// In header/nav
<UsageBadge />

// In sidebar
<UsageIndicator showWhenFull />
```

---

## Feature Names Reference

| Feature Name           | Description                   |
| ---------------------- | ----------------------------- |
| `basicAnalysis`        | Basic ATS analysis (everyone) |
| `fullOptimizationPlan` | All optimization suggestions  |
| `resumeQualityFull`    | Full quality breakdown        |
| `interviewPrepFull`    | All interview questions       |
| `coverLetterGenerator` | Cover letter generation       |
| `resumeRewriter`       | AI resume rewriting           |
| `pdfExport`            | PDF export feature            |
| `teamDashboard`        | Team features (Commercial)    |

---

## Testing Checklist

- [ ] Free user sees locked states and preview limits
- [ ] Upgrade CTAs navigate to pricing page
- [ ] Pricing page displays correctly
- [ ] Monthly/Annual toggle works
- [ ] Checkout creates Stripe session
- [ ] Embedded checkout loads
- [ ] Payment completes successfully
- [ ] Webhook updates user tier
- [ ] Pro user sees all features unlocked
- [ ] Usage counter increments
- [ ] Customer portal accessible

---

## Stripe Test Cards

| Card Number         | Result             |
| ------------------- | ------------------ |
| 4242 4242 4242 4242 | Success            |
| 4000 0000 0000 0002 | Decline            |
| 4000 0000 0000 9995 | Insufficient funds |

Use any future date for expiry, any 3 digits for CVC, any ZIP code.

---

## Production Checklist

- [ ] Switch to Stripe live keys
- [ ] Update webhook endpoint to production URL
- [ ] Test full payment flow with real card
- [ ] Enable fraud protection in Stripe
- [ ] Set up email notifications for failed payments
- [ ] Implement proper error logging
- [ ] Add analytics/conversion tracking

---

## Support

For questions about this integration, check:

- Stripe Docs: https://stripe.com/docs
- Stripe React: https://stripe.com/docs/stripe-js/react
