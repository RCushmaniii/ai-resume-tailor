import { create } from 'zustand';

export interface MissingKeyword {
  keyword: string;
  priority: 'high' | 'medium' | 'low';
}

export interface ScoreBreakdown {
  keyword_overlap: number;
  semantic_match: number;
  structure: number;
}

export interface AnalysisResult {
  match_score: number;
  score_breakdown: ScoreBreakdown;
  missing_keywords: MissingKeyword[];
  processing_time_seconds?: number;
  error?: string;
}

interface ResumeAnalysisState {
  // Inputs
  resumeText: string;
  jobDescriptionText: string;
  jobDescriptionUrl: string;
  
  // Results
  analysisResult: AnalysisResult | null;
  isAnalyzing: boolean;
  error: string | null;
  
  // Actions
  setResumeText: (text: string) => void;
  setJobDescriptionText: (text: string) => void;
  setJobDescriptionUrl: (url: string) => void;
  setAnalysisResult: (result: AnalysisResult | null) => void;
  setIsAnalyzing: (isAnalyzing: boolean) => void;
  setError: (error: string | null) => void;
  resetAnalysis: () => void;
}

export const useResumeAnalysisStore = create<ResumeAnalysisState>((set) => ({
  // Initial state
  resumeText: '',
  jobDescriptionText: '',
  jobDescriptionUrl: '',
  analysisResult: null,
  isAnalyzing: false,
  error: null,
  
  // Actions
  setResumeText: (text) => set({ resumeText: text }),
  setJobDescriptionText: (text) => set({ jobDescriptionText: text }),
  setJobDescriptionUrl: (url) => set({ jobDescriptionUrl: url }),
  setAnalysisResult: (result) => set({ analysisResult: result }),
  setIsAnalyzing: (isAnalyzing) => set({ isAnalyzing }),
  setError: (error) => set({ error }),
  resetAnalysis: () => set({ 
    analysisResult: null, 
    error: null,
    isAnalyzing: false
  }),
}));
