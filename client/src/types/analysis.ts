// Backend API response format (new enterprise ATS format)
export interface AnalysisResult {
  score: number;
  score_interpretation: string;
  hard_caps_applied: string[];
  keyword_analysis: {
    tier1_critical: Array<{
      keyword: string;
      match_type: 'EXACT' | 'VARIANT' | 'CONTEXTUAL' | 'NONE';
      resume_evidence: string | null;
      points_earned: number;
      points_possible: number;
    }>;
    tier2_important: Array<{
      keyword: string;
      match_type: 'EXACT' | 'VARIANT' | 'CONTEXTUAL' | 'NONE';
      resume_evidence: string | null;
      points_earned: number;
      points_possible: number;
    }>;
    tier3_bonus: Array<{
      keyword: string;
      match_type: 'EXACT' | 'VARIANT' | 'CONTEXTUAL' | 'NONE';
      resume_evidence: string | null;
      points_earned: number;
      points_possible: number;
    }>;
  };
  experience_analysis: {
    required_years: number;
    calculated_years: number;
    seniority_signals_found: string[];
    seniority_signals_missing: string[];
    experience_adjustment: number;
  };
  points_summary: {
    tier1_earned: number;
    tier1_possible: number;
    tier2_earned: number;
    tier2_possible: number;
    tier3_earned: number;
    tier3_possible: number;
    total_earned: number;
    total_possible: number;
  };
  critical_gaps: Array<{
    missing_skill: string;
    impact: 'HIGH' | 'MEDIUM';
    recommendation: string;
  }>;
  quick_wins: Array<{
    current_text: string;
    suggested_text: string;
    rationale: string;
  }>;
  summary: string;
}

// Legacy format for backward compatibility
export interface LegacyAnalysisResult {
  score: number;
  score_breakdown: {
    keywords: number;
    semantic: number;
    tone: number;
  };
  keywords: {
    missing: string[];
    present: string[];
  };
  suggestions: {
    type: 'critical' | 'warning' | 'tip';
    title: string;
    description: string;
  }[];
  summary: string;
}

// Gate-based evaluation data type
export interface EvaluationData {
  hiring: {
    status: 'READY' | 'NEEDS_ATTENTION';
    summary: string;
    reassurance: string;
  };
  ats: {
    status: 'PASS' | 'FAIL';
    checks: string[];
    summary: string;
  };
  search: {
    status: 'DISCOVERABLE' | 'LIMITED' | 'LOW_VISIBILITY';
    matched: number;
    total: number;
    terms: string[];
    summary: string;
  };
  alignment: {
    score: number;
    label: string;  // "Excellent", "Competitive", "Improving", "Needs Work"
    strengths: string[];
    refinements: Array<{
      skill: string;
      suggested: string;
      impact: string;
    }>;
  };
  readability: {
    label: string;  // "Strong", "Good", "Needs Work"
    notes: string[];
  };
  verdict: {
    ready_to_submit: boolean;
    message: string;
    stop_optimizing: boolean;
  };
}

// Frontend display format (for components)
export interface DisplayAnalysisResult {
  score: number;
  breakdown: {
    keywords: number;
    semantic: number;
    tone: number;
  };
  keywords: {
    missing: string[];
    present: string[];
  };
  suggestions: {
    type: 'critical' | 'warning' | 'tip';
    title: string;
    description: string;
  }[];
  summary: string;
  evaluation?: EvaluationData;
}

// Transform backend response to frontend format
export function transformAnalysisResult(apiResult: AnalysisResult | LegacyAnalysisResult | HybridV2Result): DisplayAnalysisResult {
  console.log('🔍 Raw API Result:', apiResult); // Debug log
  
  // Check if it's the old format or new format
  if ('score_breakdown' in apiResult && 'keywords' in apiResult) {
    // Old format - return as-is
    console.log('📊 Using old format');
    const legacyResult = apiResult as LegacyAnalysisResult;
    return {
      score: legacyResult.score,
      breakdown: {
        keywords: legacyResult.score_breakdown.keywords,
        semantic: legacyResult.score_breakdown.semantic,
        tone: legacyResult.score_breakdown.tone,
      },
      keywords: legacyResult.keywords,
      suggestions: legacyResult.suggestions,
      summary: legacyResult.summary,
    };
  }
  
  // Check for hybrid_v2 format (new scoring engine)
  if ('scoring_method' in apiResult || 'breakdown' in apiResult) {
    console.log('📊 Using hybrid_v2 scoring engine format');
    const v2Result = apiResult as HybridV2Result;
    
    // Extract keywords from the new format
    const missing: string[] = [];
    const present: string[] = [];
    
    if (v2Result.keyword_analysis) {
      // New format uses {present: [...], missing: [...]}
      if (Array.isArray(v2Result.keyword_analysis.missing)) {
        v2Result.keyword_analysis.missing.forEach((item) => {
          missing.push(typeof item === 'string' ? item : item.keyword);
        });
      }
      if (Array.isArray(v2Result.keyword_analysis.present)) {
        v2Result.keyword_analysis.present.forEach((item) => {
          present.push(typeof item === 'string' ? item : item.keyword);
        });
      }
    }
    
    // Also check results for backwards compat
    if (v2Result.results) {
      if (Array.isArray(v2Result.results.missingKeywords)) {
        v2Result.results.missingKeywords.forEach(k => {
          if (!missing.includes(k)) missing.push(k);
        });
      }
      if (Array.isArray(v2Result.results.presentKeywords)) {
        v2Result.results.presentKeywords.forEach(k => {
          if (!present.includes(k)) present.push(k);
        });
      }
    }
    
    // Build suggestions from quick_wins (the optimization plan)
    const suggestions: DisplayAnalysisResult['suggestions'] = [];
    
    if (Array.isArray(v2Result.quick_wins)) {
      v2Result.quick_wins.forEach((item) => {
        const suggestionType = item.type === 'critical' ? 'critical' 
          : item.type === 'high' ? 'warning' 
          : 'tip';
        suggestions.push({
          type: suggestionType as 'critical' | 'warning' | 'tip',
          title: item.title || 'Improvement',
          description: item.description || item.rewrite_suggestion || '',
        });
      });
    }
    
    // Also add critical_gaps as critical suggestions
    if (Array.isArray(v2Result.critical_gaps)) {
      v2Result.critical_gaps.forEach((gap) => {
        // Avoid duplicates
        const title = gap.skill || gap.missing_skill || 'Missing Skill';
        if (!suggestions.some(s => s.title.includes(title))) {
          suggestions.push({
            type: 'critical',
            title: `Add: ${title}`,
            description: gap.suggestion || gap.recommendation || `Add ${title} to your resume`,
          });
        }
      });
    }
    
    // Use new dimensions from backend if available
    const dimensions = v2Result.dimensions || {};
    const keywordPresence = dimensions.keyword_presence?.score || 50;
    const resumeQuality = dimensions.resume_quality?.score || 50;
    const jobAlignment = dimensions.job_alignment?.score || 50;
    
    console.log('📊 New dimensions:', { keywordPresence, resumeQuality, jobAlignment });
    console.log('📊 Suggestions built:', suggestions.length);
    
    return {
      score: v2Result.score || 0,
      breakdown: {
        keywords: keywordPresence,
        semantic: jobAlignment,
        tone: resumeQuality,
      },
      keywords: {
        missing: missing.slice(0, 10),
        present: present.slice(0, 10),
      },
      suggestions,
      summary: v2Result.summary || 'Analysis completed.',
      evaluation: v2Result.evaluation,
    };
  }
  
  // New enterprise ATS format (original)
  console.log('📊 Using new enterprise ATS format');
  const newResult = apiResult as AnalysisResult;
  
  // Extract missing and present keywords from the new structure
  const missing: string[] = [];
  const present: string[] = [];
  
  // Safely access nested properties
  if (newResult.keyword_analysis && newResult.keyword_analysis.tier1_critical) {
    // Process Tier 1 critical keywords
    newResult.keyword_analysis.tier1_critical.forEach((item) => {
      if (item.match_type === 'NONE') {
        missing.push(item.keyword);
      } else {
        present.push(item.keyword);
      }
    });
    
    // Process Tier 2 important keywords
    if (newResult.keyword_analysis.tier2_important) {
      newResult.keyword_analysis.tier2_important.forEach((item) => {
        if (item.match_type === 'NONE') {
          missing.push(item.keyword);
        } else {
          present.push(item.keyword);
        }
      });
    }
  }
  
  // Convert critical gaps to suggestions format
  console.log('🔍 Critical gaps:', newResult.critical_gaps); // Debug log
  const suggestions = newResult.critical_gaps ? newResult.critical_gaps.map((gap) => {
    console.log('🔍 Processing gap:', gap); // Debug each gap
    return {
      type: (gap.impact === 'HIGH' ? 'critical' : 'warning') as 'critical' | 'warning' | 'tip',
      title: gap.missing_skill,
      description: gap.recommendation
    };
  }) : [];
  
  // Calculate keyword score percentage
  const keywordScore = newResult.points_summary && newResult.points_summary.total_possible > 0 
    ? Math.round((newResult.points_summary.total_earned / newResult.points_summary.total_possible) * 100)
    : 0;
  
  return {
    score: newResult.score || 0,
    breakdown: {
      keywords: keywordScore,
      semantic: 75, // Default value since new format doesn't break this down
      tone: 80 // Default value since new format doesn't break this down
    },
    keywords: {
      missing: missing.slice(0, 10), // Limit to 10 as per original format
      present: present.slice(0, 10)
    },
    suggestions,
    summary: newResult.summary || 'Analysis completed.'
  };
}

// Hybrid V2 result format from new scoring engine
interface HybridV2Result {
  score: number;
  interpretation: string;
  summary: string;
  scoring_method?: string;
  breakdown?: {
    hardSkills: number;
    semanticMatch: number;
    toneAnalysis: number;
  };
  dimensions?: {
    keyword_presence?: { score: number; label: string; description: string; weight: number };
    resume_quality?: { score: number; label: string; description: string; weight: number };
    job_alignment?: { score: number; label: string; description: string; weight: number };
  };
  keyword_analysis?: {
    present: Array<{ keyword: string; tier: number; match_type: string; evidence?: string }>;
    missing: Array<{ keyword: string; tier: number; match_type: string }>;
  };
  results?: {
    presentKeywords: string[];
    missingKeywords: string[];
  };
  quick_wins?: Array<{
    type: string;
    category?: string;
    title: string;
    description: string;
    rewrite_suggestion?: string;
    potential_impact?: string;
    ats_impact?: string;
  }>;
  critical_gaps?: Array<{
    skill?: string;
    missing_skill?: string;
    tier?: number;
    suggestion?: string;
    recommendation?: string;
  }>;
  points_summary?: {
    tier1_earned: number;
    tier1_possible: number;
    tier2_earned: number;
    tier2_possible: number;
    tier3_earned: number;
    tier3_possible: number;
    total_earned: number;
    total_possible: number;
  };
  evaluation?: EvaluationData;
}
