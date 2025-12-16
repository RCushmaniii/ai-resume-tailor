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
  
  const resumeInputRef = useRef<HTMLTextAreaElement>(null);

  const handleAnalyze = async () => {
    if (!user) {
      const used = getGuestAnalysesUsed();
      if (used >= GUEST_CREDITS_TOTAL) {
        const message = `You’ve used your ${GUEST_CREDITS_TOTAL} free analyses. Please create a free account to continue. / Has usado tus ${GUEST_CREDITS_TOTAL} análisis gratis. Crea una cuenta gratis para continuar.`;
        toast.error('Free limit reached', {
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
      console.log('🔍 API URL:', API_URL); // Debug: verify environment variable
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
        throw new Error(errorData.error || `Server error: ${response.status}`);
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
        toast.message('Analysis complete', {
          description: `Free analyses remaining: ${remaining} / ${GUEST_CREDITS_TOTAL}. / Análisis gratis restantes: ${remaining} / ${GUEST_CREDITS_TOTAL}.`,
          duration: 5000,
        });
      } else if (typeof apiResult.credits_remaining === 'number' && typeof apiResult.credits_total === 'number') {
        toast.message('Analysis complete', {
          description: `Credits remaining: ${apiResult.credits_remaining} / ${apiResult.credits_total}. / Créditos restantes: ${apiResult.credits_remaining} / ${apiResult.credits_total}.`,
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
      
      let message = 'Analysis failed. Please try again.';
      
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          message = 'Request timed out. Please try again.';
        } else {
          message = err.message;
        }
      }
      
      // Show error toast
      toast.error('Analysis Failed', {
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
        title="Analyze Your Resume - AI Resume Tailor"
        description="Get instant AI-powered analysis of your resume against any job description. See your match score, missing keywords, and improvement suggestions in 60 seconds."
        keywords="resume analysis, ATS score, resume checker, job match, resume keywords, AI analysis"
        canonical="https://airesumatailor.com/analyze"
      />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">AI Resume Tailor</h1>
          <p className="text-muted-foreground text-lg">
            Analyze how well your resume matches the job description
          </p>
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
