// Backend API response format
export interface AnalysisResult {
  match_score: number;
  score_breakdown: {
    keyword_overlap: number;
    semantic_match: number;
    structure: number;
  };
  missing_keywords: Array<{
    keyword?: string;  // AI returns "keyword"
    word?: string;     // Fallback
    priority: 'high' | 'medium' | 'low';
  }>;
  improvement_suggestions: string[];
}

// Frontend display format (for components)
export interface DisplayAnalysisResult {
  match_score: number;
  breakdown: {
    keywords: number;
    semantic: number;
    tone: number;
  };
  missing_keywords: Array<{
    word: string;
    priority: 'high' | 'medium' | 'low';
  }>;
  suggestions: string[];
}

// Transform backend response to frontend format
export function transformAnalysisResult(apiResult: AnalysisResult): DisplayAnalysisResult {
  return {
    match_score: apiResult.match_score,
    breakdown: {
      keywords: apiResult.score_breakdown.keyword_overlap,
      semantic: apiResult.score_breakdown.semantic_match,
      tone: apiResult.score_breakdown.structure,
    },
    missing_keywords: apiResult.missing_keywords.map(kw => ({
      word: kw.keyword || kw.word || '',  // Map "keyword" to "word"
      priority: kw.priority
    })),
    suggestions: apiResult.improvement_suggestions,
  };
}
