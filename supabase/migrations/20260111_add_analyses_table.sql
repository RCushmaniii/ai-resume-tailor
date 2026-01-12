-- ═══════════════════════════════════════════════════════════════════════════
-- Analysis History Schema
--
-- Stores user analysis history for dashboard and history features
-- ═══════════════════════════════════════════════════════════════════════════

-- Analyses table - stores saved resume analysis results
CREATE TABLE IF NOT EXISTS public.analyses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,

    -- Input data
    resume_text TEXT NOT NULL,
    job_description TEXT NOT NULL,

    -- Extracted metadata (for display in history list)
    job_title TEXT,
    company_name TEXT,

    -- Results
    score INTEGER CHECK (score >= 0 AND score <= 100),
    result_json JSONB NOT NULL,

    -- User preferences
    is_favorite BOOLEAN DEFAULT FALSE,
    notes TEXT,

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_analyses_user_id ON public.analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_analyses_created_at ON public.analyses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analyses_user_created ON public.analyses(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analyses_favorites ON public.analyses(user_id, is_favorite) WHERE is_favorite = TRUE;

-- Enable RLS
ALTER TABLE public.analyses ENABLE ROW LEVEL SECURITY;

-- RLS Policies - users can only access their own analyses
CREATE POLICY "Users can view own analyses"
    ON public.analyses FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own analyses"
    ON public.analyses FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own analyses"
    ON public.analyses FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own analyses"
    ON public.analyses FOR DELETE
    USING (auth.uid() = user_id);

-- Function to save an analysis and decrement credits atomically
CREATE OR REPLACE FUNCTION public.save_analysis_with_credit(
    p_user_id UUID,
    p_resume_text TEXT,
    p_job_description TEXT,
    p_job_title TEXT,
    p_company_name TEXT,
    p_score INTEGER,
    p_result_json JSONB
)
RETURNS JSON AS $$
DECLARE
    v_profile RECORD;
    v_analysis_id UUID;
    v_new_usage INTEGER;
BEGIN
    -- Get current profile with lock
    SELECT * INTO v_profile
    FROM public.profiles
    WHERE id = p_user_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN json_build_object('success', false, 'error', 'User not found');
    END IF;

    -- Check if user has credits remaining
    IF v_profile.analyses_used_this_period >= v_profile.analyses_limit THEN
        RETURN json_build_object(
            'success', false,
            'error', 'No credits remaining',
            'analyses_used', v_profile.analyses_used_this_period,
            'analyses_limit', v_profile.analyses_limit
        );
    END IF;

    -- Insert the analysis
    INSERT INTO public.analyses (
        user_id,
        resume_text,
        job_description,
        job_title,
        company_name,
        score,
        result_json
    )
    VALUES (
        p_user_id,
        p_resume_text,
        p_job_description,
        p_job_title,
        p_company_name,
        p_score,
        p_result_json
    )
    RETURNING id INTO v_analysis_id;

    -- Increment usage counter
    v_new_usage := v_profile.analyses_used_this_period + 1;

    UPDATE public.profiles
    SET analyses_used_this_period = v_new_usage,
        updated_at = NOW()
    WHERE id = p_user_id;

    RETURN json_build_object(
        'success', true,
        'analysis_id', v_analysis_id,
        'analyses_used', v_new_usage,
        'analyses_limit', v_profile.analyses_limit,
        'credits_remaining', v_profile.analyses_limit - v_new_usage
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's analysis history with pagination
CREATE OR REPLACE FUNCTION public.get_analysis_history(
    p_user_id UUID,
    p_limit INTEGER DEFAULT 20,
    p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
    id UUID,
    job_title TEXT,
    company_name TEXT,
    score INTEGER,
    is_favorite BOOLEAN,
    created_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        a.id,
        a.job_title,
        a.company_name,
        a.score,
        a.is_favorite,
        a.created_at
    FROM public.analyses a
    WHERE a.user_id = p_user_id
    ORDER BY a.created_at DESC
    LIMIT p_limit
    OFFSET p_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to toggle favorite status
CREATE OR REPLACE FUNCTION public.toggle_analysis_favorite(
    p_user_id UUID,
    p_analysis_id UUID
)
RETURNS JSON AS $$
DECLARE
    v_new_status BOOLEAN;
BEGIN
    UPDATE public.analyses
    SET is_favorite = NOT is_favorite,
        updated_at = NOW()
    WHERE id = p_analysis_id AND user_id = p_user_id
    RETURNING is_favorite INTO v_new_status;

    IF NOT FOUND THEN
        RETURN json_build_object('success', false, 'error', 'Analysis not found');
    END IF;

    RETURN json_build_object('success', true, 'is_favorite', v_new_status);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION public.save_analysis_with_credit TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_analysis_history TO authenticated;
GRANT EXECUTE ON FUNCTION public.toggle_analysis_favorite TO authenticated;
