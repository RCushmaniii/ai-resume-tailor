# Stripe Sync Engine Setup

This guide explains how to enable and use the Stripe Sync Engine for AI Resume Tailor.

## Overview

The Stripe Sync Engine automatically syncs your Stripe data (customers, subscriptions, invoices, etc.) directly into your Supabase database. This eliminates the need for custom webhook handling and allows you to query billing data using standard SQL.

## Benefits

| Before (Manual) | After (Sync Engine) |
|-----------------|---------------------|
| Build webhook endpoints | Automatic sync |
| Handle event ordering | Supabase Queues manage it |
| Manual data transformation | Standard Postgres tables |
| API rate limit handling | Local queries, no limits |
| Complex join logic | Simple SQL JOINs |

## Setup Instructions

### Step 1: Create Stripe Restricted API Key

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
2. Click **Create restricted key**
3. Set permissions:
   - **Webhook Endpoints**: Write
   - **All other resources**: Read
4. Copy the key (starts with `rk_live_` or `rk_test_`)

### Step 2: Enable Stripe Sync Engine in Supabase

1. Open your [Supabase Dashboard](https://supabase.com/dashboard)
2. Navigate to **Integrations**
3. Find **Stripe Sync Engine** and click **Install**
4. Paste your Stripe API key
5. Click **Enable**

### Step 3: Wait for Initial Sync

The initial backfill syncs all historical data:
- Small accounts: 5-10 minutes
- Large accounts: Up to a few hours

Real-time webhooks start immediately, so new events are captured right away.

### Step 4: Apply Database Migration

Run the migration to create helper views:

```bash
cd ai-resume-tailor
npx supabase db push
```

This creates:
- `user_subscription_status` view - Joins profiles with Stripe data
- `get_my_subscription_status()` function - Get current user's status
- `can_perform_analysis()` function - Check if user can analyze
- `mrr_by_product` view - Revenue analytics
- `users_not_converted` view - Conversion funnel

## Available Stripe Tables

After sync, you'll have access to these tables in the `stripe` schema:

| Table | Description |
|-------|-------------|
| `stripe.customers` | Customer records |
| `stripe.subscriptions` | Active/past subscriptions |
| `stripe.prices` | Pricing information |
| `stripe.products` | Product catalog |
| `stripe.invoices` | Invoice history |
| `stripe.payment_intents` | Payment records |
| `stripe.charges` | Charge records |

## Usage Examples

### Check User Subscription Status

```sql
-- Get current user's subscription info
SELECT * FROM public.user_subscription_status
WHERE user_id = auth.uid();
```

```typescript
// In frontend
const { data } = await supabase.rpc('get_my_subscription_status');
console.log(data.is_subscribed, data.credits_remaining);
```

### Check If User Can Perform Analysis

```typescript
const { data } = await supabase.rpc('can_perform_analysis');
if (data.allowed) {
  // Proceed with analysis
} else {
  // Show upgrade modal
  console.log(data.reason);
}
```

### Calculate MRR

```sql
SELECT product_name, subscriber_count, mrr
FROM public.mrr_by_product;
```

### Find Users Who Haven't Converted

```sql
SELECT email, days_since_signup, analyses_used
FROM public.users_not_converted
WHERE analyses_used > 0  -- Used the product but didn't pay
ORDER BY analyses_used DESC;
```

### Join User Data with Stripe

```sql
-- Find at-risk subscribers (active but inactive in app)
SELECT
    c.email,
    s.current_period_end as renewal_date,
    p.analyses_used_this_period
FROM stripe.subscriptions s
JOIN stripe.customers c ON c.id = s.customer
JOIN public.profiles p ON p.email = c.email
WHERE s.status = 'active'
  AND p.analyses_used_this_period = 0
ORDER BY s.current_period_end;
```

## Architecture

```
┌─────────────┐     Webhooks      ┌──────────────────┐
│   Stripe    │ ─────────────────▶│  Supabase        │
│             │                   │                  │
│ • Customers │     Scheduled     │ • stripe schema  │
│ • Subs      │ ◀────Backfill────│ • Real-time sync │
│ • Invoices  │                   │ • Postgres tables│
└─────────────┘                   └──────────────────┘
                                          │
                                          ▼
                                  ┌──────────────────┐
                                  │  Your App        │
                                  │                  │
                                  │ • SQL queries    │
                                  │ • JOINs          │
                                  │ • Analytics      │
                                  └──────────────────┘
```

## Comparison: Sync Engine vs Webhooks

| Aspect | Webhooks (Manual) | Sync Engine |
|--------|-------------------|-------------|
| Setup time | Days/weeks | Minutes |
| Maintenance | Ongoing | Zero |
| Event ordering | Must handle | Automatic |
| Historical data | Must backfill | Automatic |
| Querying | API calls | SQL |
| Rate limits | Must handle | N/A |
| Real-time | Yes | Yes |
| Cost | Dev time + hosting | Included |

## Troubleshooting

### Sync Not Working

1. Check Supabase Dashboard > Integrations > Stripe Sync Engine
2. Verify API key has correct permissions
3. Check for errors in the sync log

### Data Not Appearing

1. Initial sync may take time for large accounts
2. Check if the webhook endpoint is reachable
3. Verify the Stripe account has the expected data

### View Returns NULL for Stripe Data

This is normal if:
- Stripe Sync Engine not enabled yet
- No matching Stripe customer for the user's email
- No active subscription for the customer

The views are designed to gracefully handle missing Stripe data.

## Security Notes

1. **Row Level Security**: The `user_subscription_status` view respects RLS
2. **Service Role**: Admin views require service role access
3. **API Keys**: Use restricted keys, never expose secret keys
4. **Audit Trail**: Stripe maintains its own audit log

## Next Steps

1. Set up Stripe products and prices in Stripe Dashboard
2. Create checkout flow using Stripe Checkout
3. Add upgrade buttons that redirect to Stripe Checkout
4. Use `can_perform_analysis()` to gate premium features

---

_Last Updated: January 2026_
