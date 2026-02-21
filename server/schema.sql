-- Neon Postgres Schema for AI Resume Tailor
-- Run this against your Neon database to create the required tables.
--
-- Usage:
--   psql $DATABASE_URL -f schema.sql
-- Or paste into the Neon SQL Editor in the dashboard.

-- profiles table (Clerk user ID as primary key)
CREATE TABLE IF NOT EXISTS profiles (
  id TEXT PRIMARY KEY,  -- Clerk user ID (e.g., user_2abc123)
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  subscription_tier TEXT DEFAULT 'free',
  stripe_customer_id TEXT UNIQUE,
  subscription_status TEXT DEFAULT 'none',
  subscription_period_end TIMESTAMPTZ,
  analyses_used_this_period INTEGER DEFAULT 0,
  analyses_limit INTEGER DEFAULT 5,
  analyses_reset_date TIMESTAMPTZ,
  guest_analyses_transferred BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- analyses table
CREATE TABLE IF NOT EXISTS analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT REFERENCES profiles(id) ON DELETE CASCADE,
  resume_text TEXT NOT NULL,
  job_description TEXT NOT NULL,
  job_title TEXT,
  company_name TEXT,
  score INTEGER,
  result_json JSONB,
  is_favorite BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_analyses_user_id ON analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer ON profiles(stripe_customer_id);
