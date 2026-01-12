import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database, Json } from "../types/database";

let cachedClient: SupabaseClient<Database> | null = null;

export function getSupabaseClient(): SupabaseClient<Database> | null {
  if (cachedClient) return cachedClient;

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

  if (!supabaseUrl || !supabaseKey) {
    return null;
  }

  cachedClient = createClient<Database>(supabaseUrl, supabaseKey);
  return cachedClient;
}

// ═══════════════════════════════════════════════════════════════════════════
// OAuth Sign-In Helpers
// ═══════════════════════════════════════════════════════════════════════════

export async function signInWithGoogle() {
  const supabase = getSupabaseClient();
  if (!supabase) throw new Error('Supabase not configured');

  return supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/analyze`,
    },
  });
}

export async function signInWithLinkedIn() {
  const supabase = getSupabaseClient();
  if (!supabase) throw new Error('Supabase not configured');

  return supabase.auth.signInWithOAuth({
    provider: 'linkedin_oidc',
    options: {
      redirectTo: `${window.location.origin}/analyze`,
    },
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// Analysis History Helpers
// ═══════════════════════════════════════════════════════════════════════════

export type AnalysisHistoryItem = {
  id: string;
  job_title: string | null;
  company_name: string | null;
  score: number | null;
  is_favorite: boolean | null;
  created_at: string;
};

export type SavedAnalysis = Database['public']['Tables']['analyses']['Row'];

/**
 * Save an analysis and decrement user credits atomically
 */
export async function saveAnalysisWithCredit(
  userId: string,
  resumeText: string,
  jobDescription: string,
  jobTitle: string | null,
  companyName: string | null,
  score: number,
  resultJson: Json
): Promise<{ success: boolean; analysis_id?: string; credits_remaining?: number; error?: string }> {
  const supabase = getSupabaseClient();
  if (!supabase) return { success: false, error: 'Supabase not configured' };

  const { data, error } = await supabase.rpc('save_analysis_with_credit', {
    p_user_id: userId,
    p_resume_text: resumeText,
    p_job_description: jobDescription,
    p_job_title: jobTitle ?? '',
    p_company_name: companyName ?? '',
    p_score: score,
    p_result_json: resultJson,
  });

  if (error) {
    console.error('Failed to save analysis:', error);
    return { success: false, error: error.message };
  }

  return data as { success: boolean; analysis_id?: string; credits_remaining?: number; error?: string };
}

/**
 * Get user's analysis history with pagination
 */
export async function getAnalysisHistory(
  userId: string,
  limit = 20,
  offset = 0
): Promise<AnalysisHistoryItem[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];

  const { data, error } = await supabase.rpc('get_analysis_history', {
    p_user_id: userId,
    p_limit: limit,
    p_offset: offset,
  });

  if (error) {
    console.error('Failed to fetch analysis history:', error);
    return [];
  }

  return (data ?? []) as AnalysisHistoryItem[];
}

/**
 * Get a single analysis by ID
 */
export async function getAnalysisById(analysisId: string): Promise<SavedAnalysis | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('analyses')
    .select('*')
    .eq('id', analysisId)
    .single();

  if (error) {
    console.error('Failed to fetch analysis:', error);
    return null;
  }

  return data;
}

/**
 * Toggle favorite status for an analysis
 */
export async function toggleAnalysisFavorite(
  userId: string,
  analysisId: string
): Promise<{ success: boolean; is_favorite?: boolean; error?: string }> {
  const supabase = getSupabaseClient();
  if (!supabase) return { success: false, error: 'Supabase not configured' };

  const { data, error } = await supabase.rpc('toggle_analysis_favorite', {
    p_user_id: userId,
    p_analysis_id: analysisId,
  });

  if (error) {
    console.error('Failed to toggle favorite:', error);
    return { success: false, error: error.message };
  }

  return data as { success: boolean; is_favorite?: boolean; error?: string };
}

/**
 * Delete an analysis
 */
export async function deleteAnalysis(analysisId: string): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (!supabase) return false;

  const { error } = await supabase
    .from('analyses')
    .delete()
    .eq('id', analysisId);

  if (error) {
    console.error('Failed to delete analysis:', error);
    return false;
  }

  return true;
}

/**
 * Get user's profile with credits info
 */
export async function getUserProfile(userId: string) {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Failed to fetch profile:', error);
    return null;
  }

  return data;
}
