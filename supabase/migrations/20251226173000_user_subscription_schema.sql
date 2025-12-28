-- ═══════════════════════════════════════════════════════════════════════════
-- User Subscription & Usage Tracking Schema
-- 
-- Supports the 3-tier conversion funnel:
-- Guest (3 analyses) → Free (5 more) → Pro (50/month)
-- ═══════════════════════════════════════════════════════════════════════════

-- Create profiles table if it doesn't exist (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  
  -- Subscription fields
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'commercial')),
  stripe_customer_id TEXT UNIQUE,
  subscription_status TEXT DEFAULT 'none' CHECK (subscription_status IN ('none', 'active', 'past_due', 'canceled', 'trialing')),
  subscription_period_end TIMESTAMPTZ,
  
  -- Usage tracking
  analyses_used_this_period INTEGER DEFAULT 0,
  analyses_limit INTEGER DEFAULT 5,
  analyses_reset_date TIMESTAMPTZ,
  
  -- Guest usage transferred on registration
  guest_analyses_transferred INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for Stripe customer lookups
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer ON public.profiles(stripe_customer_id);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

-- Function to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to increment usage
CREATE OR REPLACE FUNCTION public.increment_analysis_usage(user_id UUID)
RETURNS JSON AS $$
DECLARE
  profile_record RECORD;
  new_count INTEGER;
BEGIN
  -- Get current profile
  SELECT * INTO profile_record FROM public.profiles WHERE id = user_id;
  
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'User not found');
  END IF;
  
  -- Check if we need to reset (for Pro users with monthly limits)
  IF profile_record.analyses_reset_date IS NOT NULL 
     AND profile_record.analyses_reset_date < NOW() THEN
    -- Reset counter for new period
    UPDATE public.profiles 
    SET analyses_used_this_period = 1,
        analyses_reset_date = NOW() + INTERVAL '1 month',
        updated_at = NOW()
    WHERE id = user_id;
    
    RETURN json_build_object(
      'success', true, 
      'analyses_used', 1,
      'analyses_limit', profile_record.analyses_limit,
      'reset', true
    );
  END IF;
  
  -- Increment counter
  new_count := profile_record.analyses_used_this_period + 1;
  
  UPDATE public.profiles 
  SET analyses_used_this_period = new_count,
      updated_at = NOW()
  WHERE id = user_id;
  
  RETURN json_build_object(
    'success', true,
    'analyses_used', new_count,
    'analyses_limit', profile_record.analyses_limit,
    'reset', false
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to transfer guest usage on registration
CREATE OR REPLACE FUNCTION public.transfer_guest_usage(user_id UUID, guest_count INTEGER)
RETURNS JSON AS $$
BEGIN
  UPDATE public.profiles 
  SET analyses_used_this_period = guest_count,
      guest_analyses_transferred = guest_count,
      analyses_limit = 8, -- 3 guest + 5 free = 8 total for free tier
      updated_at = NOW()
  WHERE id = user_id;
  
  RETURN json_build_object(
    'success', true,
    'transferred', guest_count,
    'new_limit', 8
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to upgrade user to Pro
CREATE OR REPLACE FUNCTION public.upgrade_to_pro(
  user_id UUID, 
  customer_id TEXT,
  period_end TIMESTAMPTZ
)
RETURNS JSON AS $$
BEGIN
  UPDATE public.profiles 
  SET subscription_tier = 'pro',
      stripe_customer_id = customer_id,
      subscription_status = 'active',
      subscription_period_end = period_end,
      analyses_limit = 50,
      analyses_used_this_period = 0,
      analyses_reset_date = period_end,
      updated_at = NOW()
  WHERE id = user_id;
  
  RETURN json_build_object('success', true, 'tier', 'pro');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
