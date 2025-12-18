import { useState, useRef } from 'react';
import { toast } from 'sonner';
import { SEO } from '@/components/SEO';
import { InputSection } from '@/components/analyze/InputSection';
import { LoadingState } from '@/components/analyze/LoadingState';
import { ResultsSection } from '@/components/analyze/ResultsSection';
import type { DisplayAnalysisResult } from '@/types/analysis';
import { transformAnalysisResult, type AnalysisResult } from '@/types/analysis';
import { fetchWithAuth } from '@/lib/fetchWithAuth';
import { useAuth } from '@/lib/useAuth';
import { useTranslation } from 'react-i18next';

const GUEST_CREDITS_TOTAL = Number(import.meta.env.VITE_GUEST_CREDITS_TOTAL ?? 3);
const GUEST_CREDITS_STORAGE_KEY = 'guest_analyses_used';

function getGuestAnalysesUsed(): number {
  try {
    const raw = localStorage.getItem(GUEST_CREDITS_STORAGE_KEY);
    const parsed = Number(raw ?? 0);
    return Number.isFinite(parsed) ? parsed : 0;
  } catch {
    return 0;
  }
}

function incrementGuestAnalysesUsed(): number {
  const next = getGuestAnalysesUsed() + 1;
  try {
    localStorage.setItem(GUEST_CREDITS_STORAGE_KEY, String(next));
  } catch {
    // Ignore storage errors; gating is best-effort until server-side enforcement exists.
  }
  return next;
}

export function Analyze() {
  const [resumeText, setResumeText] = useState('');
  const [jobText, setJobText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<DisplayAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { t } = useTranslation();
  
  const resumeInputRef = useRef<HTMLTextAreaElement>(null);

  const getApiErrorMessage = (payload: unknown): string | null => {
    if (!payload || typeof payload !== 'object') return null;
    const data = payload as {
      error_code?: string;
      details?: Record<string, unknown>;
      error?: string;
      message?: string;
    };

    if (!data.error_code) return null;

    const key = `apiErrors.${data.error_code}`;
    const translated = t(key, {
      defaultValue: '',
      ...(data.details ?? {}),
    });

    if (translated) return translated;
    return data.error || data.message || null;
  };

  const handleAnalyze = async () => {
    if (!user) {
      const used = getGuestAnalysesUsed();
      if (used >= GUEST_CREDITS_TOTAL) {
        const message = t('analyze.messages.freeLimitReached', { total: GUEST_CREDITS_TOTAL });
        toast.error(t('analyze.toasts.freeLimitReachedTitle'), {
          description: message,
          duration: 8000,
        });
        setError(message);
        return;
      }
    }

    setIsAnalyzing(true);
    setError(null);
    
    // Set up timeout controller
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
    try {
      const API_URL = import.meta.env.VITE_API_URL || '/api';
      const response = await fetchWithAuth(`${API_URL}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resume: resumeText,
          job_description: jobText
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const localized = getApiErrorMessage(errorData);
        throw new Error(localized || (typeof (errorData as { error?: string }).error === 'string'
          ? (errorData as { error?: string }).error
          : `Server error: ${response.status}`));
      }

      const apiResult: AnalysisResult & {
        credits_remaining?: number;
        credits_total?: number;
        credits_used?: number;
      } = await response.json();
      
      // Transform backend format to frontend display format
      const displayResult = transformAnalysisResult(apiResult);
      
      // Keep minimum 1s loading to prevent UI flash
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setResults(displayResult);

      if (!user) {
        const nextUsed = incrementGuestAnalysesUsed();
        const remaining = Math.max(0, GUEST_CREDITS_TOTAL - nextUsed);
        toast.message(t('analyze.toasts.analysisCompleteTitle'), {
          description: t('analyze.messages.freeRemaining', { remaining, total: GUEST_CREDITS_TOTAL }),
          duration: 5000,
        });
      } else if (typeof apiResult.credits_remaining === 'number' && typeof apiResult.credits_total === 'number') {
        toast.message(t('analyze.toasts.analysisCompleteTitle'), {
          description: t('analyze.messages.creditsRemaining', {
            remaining: apiResult.credits_remaining,
            total: apiResult.credits_total,
          }),
          duration: 5000,
        });
      }
      
      // Smooth scroll to results
      setTimeout(() => {
        document.getElementById('results')?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);
      
    } catch (err) {
      clearTimeout(timeoutId);
      
      let message = t('analyze.messages.analysisFailedGeneric');
      
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          message = t('analyze.messages.requestTimedOut');
        } else {
          message = err.message;
        }
      }
      
      // Show error toast
      toast.error(t('analyze.toasts.analysisFailedTitle'), {
        description: message,
        duration: 5000,
      });
      
      setError(message);
      console.error('Analysis error:', err);
      
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAnalyzeAgain = () => {
    setResults(null);
    setError(null);
    
    // Focus on the first textarea
    setTimeout(() => {
      resumeInputRef.current?.focus();
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  return (
    <>
      <SEO
        title={t('seo.analyze.title')}
        description={t('seo.analyze.description')}
        keywords={t('seo.analyze.keywords')}
        canonical={t('seo.analyze.canonical')}
      />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">{t('analyze.heading')}</h1>
          <p className="text-muted-foreground text-lg">{t('analyze.subheading')}</p>
        </div>

      {/* Input Section - Always visible but grayed out when analyzing/showing results */}
      <div className={results ? 'opacity-50 pointer-events-none mb-8' : 'mb-8'}>
        <InputSection
          resumeText={resumeText}
          jobText={jobText}
          isAnalyzing={isAnalyzing}
          onResumeChange={setResumeText}
          onJobChange={setJobText}
          onAnalyze={handleAnalyze}
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Loading State */}
      {isAnalyzing && <LoadingState />}

      {/* Results Section */}
      {results && !isAnalyzing && (
        <ResultsSection 
          results={results} 
          onAnalyzeAgain={handleAnalyzeAgain}
        />
      )}
      </div>
    </>
  );
}
