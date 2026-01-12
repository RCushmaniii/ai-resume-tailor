-- ═══════════════════════════════════════════════════════════════════════════
-- Stripe Sync Engine Integration Views
--
-- IMPORTANT: This is NOT an automatic migration!
-- Run this SQL manually in Supabase SQL Editor AFTER enabling Stripe Sync.
--
-- Prerequisites:
-- 1. Enable Stripe Sync Engine in Supabase Dashboard (Integrations → Stripe)
-- 2. Wait for initial sync to complete
-- 3. Then run this script in the SQL Editor
--
-- After sync, you'll have access to:
-- - stripe.customers
-- - stripe.subscriptions
-- - stripe.prices
-- - stripe.products
-- - stripe.invoices
--
-- To run: Copy this entire file into Supabase SQL Editor and execute
-- ═══════════════════════════════════════════════════════════════════════════

-- View: User subscription status (joins profiles with Stripe data)
-- This view provides a unified view of user subscription info
CREATE OR REPLACE VIEW public.user_subscription_status AS
SELECT
    p.id as user_id,
    p.email,
    p.full_name,
    p.analyses_used_this_period,
    p.analyses_limit,
    p.analyses_limit - p.analyses_used_this_period as credits_remaining,
    p.subscription_tier,
    -- Stripe data (will be NULL if Stripe Sync not enabled or no subscription)
    c.id as stripe_customer_id,
    s.id as stripe_subscription_id,
    s.status as stripe_subscription_status,
    s.current_period_end as subscription_ends_at,
    s.cancel_at_period_end,
    pr.unit_amount / 100.0 as price_amount,
    pr.currency as price_currency,
    prod.name as product_name,
    -- Computed fields
    CASE
        WHEN s.status = 'active' THEN true
        WHEN s.status = 'trialing' THEN true
        ELSE false
    END as is_subscribed,
    CASE
        WHEN s.status = 'active' AND s.cancel_at_period_end = true THEN true
        ELSE false
    END as is_canceling
FROM public.profiles p
LEFT JOIN stripe.customers c ON c.email = p.email
LEFT JOIN stripe.subscriptions s ON s.customer = c.id AND s.status IN ('active', 'trialing', 'past_due')
LEFT JOIN stripe.prices pr ON pr.id = (s.plan::json->>'id')::text
LEFT JOIN stripe.products prod ON prod.id = pr.product;

-- Grant access to authenticated users
GRANT SELECT ON public.user_subscription_status TO authenticated;

-- Function: Get current user's subscription status
CREATE OR REPLACE FUNCTION public.get_my_subscription_status()
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'user_id', user_id,
        'email', email,
        'credits_remaining', credits_remaining,
        'analyses_limit', analyses_limit,
        'subscription_tier', subscription_tier,
        'is_subscribed', COALESCE(is_subscribed, false),
        'is_canceling', COALESCE(is_canceling, false),
        'product_name', product_name,
        'subscription_ends_at', subscription_ends_at
    ) INTO result
    FROM public.user_subscription_status
    WHERE user_id = auth.uid();

    RETURN COALESCE(result, json_build_object(
        'user_id', auth.uid(),
        'credits_remaining', 0,
        'is_subscribed', false,
        'error', 'Profile not found'
    ));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.get_my_subscription_status TO authenticated;

-- Function: Check if user can perform analysis (has credits or active subscription)
CREATE OR REPLACE FUNCTION public.can_perform_analysis()
RETURNS JSON AS $$
DECLARE
    user_status RECORD;
BEGIN
    SELECT * INTO user_status
    FROM public.user_subscription_status
    WHERE user_id = auth.uid();

    IF NOT FOUND THEN
        RETURN json_build_object('allowed', false, 'reason', 'User not found');
    END IF;

    -- Pro users with active subscription have unlimited analyses
    IF user_status.is_subscribed AND user_status.subscription_tier = 'pro' THEN
        RETURN json_build_object(
            'allowed', true,
            'reason', 'Active Pro subscription',
            'credits_remaining', NULL,
            'is_unlimited', true
        );
    END IF;

    -- Free users check credits
    IF user_status.credits_remaining > 0 THEN
        RETURN json_build_object(
            'allowed', true,
            'reason', 'Credits available',
            'credits_remaining', user_status.credits_remaining,
            'is_unlimited', false
        );
    END IF;

    RETURN json_build_object(
        'allowed', false,
        'reason', 'No credits remaining',
        'credits_remaining', 0,
        'upgrade_required', true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.can_perform_analysis TO authenticated;

-- ═══════════════════════════════════════════════════════════════════════════
-- Revenue Analytics Views (for admin dashboard)
-- ═══════════════════════════════════════════════════════════════════════════

-- View: Monthly Recurring Revenue (MRR) by product
CREATE OR REPLACE VIEW public.mrr_by_product AS
SELECT
    prod.name as product_name,
    COUNT(*) as subscriber_count,
    SUM(pr.unit_amount) / 100.0 as mrr
FROM stripe.subscriptions s
JOIN stripe.prices pr ON pr.id = (s.plan::json->>'id')::text
JOIN stripe.products prod ON prod.id = pr.product
WHERE s.status = 'active'
GROUP BY prod.name
ORDER BY mrr DESC;

-- View: Users who signed up but never subscribed (conversion funnel)
CREATE OR REPLACE VIEW public.users_not_converted AS
SELECT
    p.id as user_id,
    p.email,
    p.created_at as signed_up_at,
    NOW() - p.created_at as days_since_signup,
    p.analyses_used_this_period as analyses_used
FROM public.profiles p
LEFT JOIN stripe.customers c ON c.email = p.email
LEFT JOIN stripe.subscriptions s ON s.customer = c.id
WHERE s.id IS NULL
    AND p.created_at < NOW() - INTERVAL '3 days'
ORDER BY p.created_at DESC;

-- Note: These admin views should only be accessed by service role
-- In production, create a separate admin schema with proper RLS
