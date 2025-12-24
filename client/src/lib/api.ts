import { useMutation } from '@tanstack/react-query';
import type { AnalysisResult } from './store';

interface AnalyzeResumeParams {
  resume: string;
  job_description?: string;
  job_url?: string;
}

/**
 * API client for resume analysis
 */
export const api = {
  /**
   * Analyze resume against job description
   */
  analyzeResume: async (params: AnalyzeResumeParams): Promise<AnalysisResult> => {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorCode = (errorData as { error_code?: string }).error_code;
      throw new Error(
        (errorCode ? `apiErrors.${errorCode}` : null) ||
          (errorData as { error?: string }).error ||
          `API error: ${response.status} ${response.statusText}`
      );
    }

    return response.json();
  },
};

/**
 * Hook for analyzing resume against job description
 */
export const useAnalyzeResume = () => {
  return useMutation({
    mutationFn: api.analyzeResume,
    onError: (error) => {
      console.error('Resume analysis error:', error);
    },
  });
};