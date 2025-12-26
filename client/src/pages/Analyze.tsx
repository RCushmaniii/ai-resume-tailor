import { useState } from 'react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { SEO } from '@/components/SEO';
import { InputSection } from '@/components/analyze/InputSection.tsx';
import { LoadingState } from '@/components/analyze/LoadingState.tsx';
import { ResultsSection } from '@/components/analyze/ResultsSection.tsx';
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
  const { t } = useTranslation();
  const [resumeText, setResumeText] = useState('');
  const [jobText, setJobText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<DisplayAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { user } = useAuth();

  const handleAnalyzeAgain = () => {
    // Clear everything - results, errors, AND input fields
    setResults(null);
    setError(null);
    setResumeText('');
    setJobText('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAnalyze = async () => {
    // Clear any cached results to ensure fresh data
    setResults(null);
    setError(null);
    
    if (!user && !isEditing) {
      const used = getGuestAnalysesUsed();
      if (used >= GUEST_CREDITS_TOTAL) {
        const message = t('analyze.messages.freeLimitReached', { total: GUEST_CREDITS_TOTAL });
        toast.error(t('analyze.toasts.freeLimitReachedTitle'), {
          description: message,
          duration: 10000,
          action: {
            label: 'Reset (Dev)',
            onClick: async () => {
              try {
                const API_URL = import.meta.env.VITE_API_URL || '/api';
                await fetch(`${API_URL}/dev/reset`, { method: 'POST' });
                localStorage.removeItem('guest_analyses_used');
                toast.success('Counter reset! Refreshing...');
                setTimeout(() => window.location.reload(), 500);
              } catch (e) {
                console.error('Reset failed:', e);
              }
            }
          }
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
      console.log('📤 Sending request to:', `${API_URL}/analyze`); // Debug: full URL
      console.log('📄 Resume length:', resumeText.length, 'Job length:', jobText.length); // Debug: data
      
      const response = await fetchWithAuth(`${API_URL}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resume: resumeText,
          job_description: jobText
        }),
        signal: controller.signal
      });
      
      console.log('📥 Response status:', response.status, response.statusText); // Debug: response

      clearTimeout(timeoutId);

      if (!response.ok) {
        console.log('🔍 Response status in !response.ok block:', response.status); // Debug
        const errorData = await response.json().catch(() => ({}));
        
        // Handle 429 (rate limit) error specially to show reset button
        if (response.status === 429) {
          console.log('🔍 Handling 429 error'); // Debug
          setError(t('analyze.messages.freeLimitReached', { total: GUEST_CREDITS_TOTAL }));
          setIsAnalyzing(false);
          return;
        }
        
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      const apiResult: AnalysisResult & {
        credits_remaining?: number;
        credits_total?: number;
      } = await response.json();
      
      console.log('🤖 Backend response:', apiResult); // Debug: full response
      console.log('📊 Score from backend:', apiResult.score); // Debug: score value
      
      // Transform backend format to frontend display format
      const displayResult = transformAnalysisResult(apiResult);
      
      console.log('✅ Transformed displayResult:', displayResult); // Debug transformed result
      console.log('✅ DisplayResult suggestions:', displayResult.suggestions); // Debug suggestions specifically
      
      // Keep minimum 1s loading to prevent UI flash
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setResults(displayResult);

      // Increment guest counter silently (no toast notification)
      if (!user) {
        incrementGuestAnalysesUsed();
      }
      
      // Smooth scroll to results with offset for header
      setTimeout(() => {
        const resultsElement = document.getElementById('results');
        if (resultsElement) {
          const headerOffset = 120; // Account for sticky header + breathing room
          const elementPosition = resultsElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 100);
      
    } catch (err) {
      clearTimeout(timeoutId);
      
      let message = 'Analysis failed. Please try again.';
      
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          message = 'Request timed out. Please try again.';
        } else if (err.message.includes('Free limit reached')) {
          // Handle the free limit error with reset button
          const limitMessage = t('analyze.messages.freeLimitReached', { total: GUEST_CREDITS_TOTAL });
          toast.error(t('analyze.toasts.freeLimitReachedTitle'), {
            description: limitMessage,
            duration: 10000,
            action: {
              label: 'Reset (Dev)',
              onClick: async () => {
                try {
                  const API_URL = import.meta.env.VITE_API_URL || '/api';
                  await fetch(`${API_URL}/dev/reset`, { method: 'POST' });
                  localStorage.removeItem('guest_analyses_used');
                  toast.success('Counter reset! Refreshing...');
                  setTimeout(() => window.location.reload(), 500);
                } catch (e) {
                  console.error('Reset failed:', e);
                }
              }
            }
          });
          setError(limitMessage);
          setIsAnalyzing(false);
          return;
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
      setIsEditing(false);
    }
  };

  const handleEditAndOptimize = () => {
    // Clear results to show input section again
    setResults(null);
    setError(null);
    setIsEditing(true);
    
    // Scroll to top of inputs
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
      <div id="analyze-input" className={results && !isEditing ? 'opacity-50 pointer-events-none mb-8' : 'mb-8'}>
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
          <p>{error}</p>
          {error.includes('free limit') && (
            <button
              onClick={async () => {
                try {
                  const API_URL = import.meta.env.VITE_API_URL || '/api';
                  await fetch(`${API_URL}/dev/reset`, { method: 'POST' });
                  localStorage.removeItem('guest_analyses_used');
                  window.location.reload();
                } catch (e) {
                  console.error('Reset failed:', e);
                }
              }}
              className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Reset Counter (Dev Only)
            </button>
          )}
        </div>
      )}

      {/* Loading State */}
      {isAnalyzing && <LoadingState />}

      {/* Results Section */}
      {results && (
        <ResultsSection
          results={results}
          onAnalyzeAgain={handleAnalyzeAgain}
          onEditAndOptimize={handleEditAndOptimize}
        />
      )}
      </div>
    </>
  );
}