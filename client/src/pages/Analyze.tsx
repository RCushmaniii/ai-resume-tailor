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
import { useAnalysisLimit } from '@/hooks/useAnalysisLimit';
import { UpgradeRequiredModal } from '@/components/subscription/UpgradeRequiredModal';
import { LowCreditsBanner } from '@/components/subscription/UpgradeBanner';
import { SignIn } from '@clerk/clerk-react';

export function Analyze() {
  const { t } = useTranslation();
  const { user, loading: authLoading } = useAuth();
  const [resumeText, setResumeText] = useState('');
  const [jobText, setJobText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<DisplayAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const { checkCanAnalyze, incrementUsage } = useAnalysisLimit();

  // Auth gate: require sign-in to use the analyzer
  if (!authLoading && !user) {
    return (
      <>
        <SEO
          title="Analyze Your Resume - AI Resume Tailor"
          description="Get instant AI-powered analysis of your resume against any job description. See your match score, missing keywords, and improvement suggestions in 60 seconds."
          keywords="resume analysis, ATS score, resume checker, job match, resume keywords, AI analysis"
          path="/analyze"
        />
        <div className="container mx-auto px-4 py-12 max-w-lg">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-3">
              {t('analyze.authGate.title', 'Sign in to analyze your resume')}
            </h1>
            <p className="text-muted-foreground text-lg">
              {t('analyze.authGate.subtitle', 'Create a free account to get 3 AI-powered resume analyses — no credit card required.')}
            </p>
          </div>
          <SignIn
            routing="hash"
            forceRedirectUrl="/analyze"
            appearance={{
              elements: {
                rootBox: 'mx-auto w-full',
                card: 'shadow-none border border-gray-200 rounded-xl',
              },
            }}
          />
        </div>
      </>
    );
  }

  const handleAnalyzeAgain = () => {
    setResults(null);
    setError(null);
    setResumeText('');
    setJobText('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAnalyze = async () => {
    setResults(null);
    setError(null);

    // Check analysis limits
    const limitCheck = checkCanAnalyze();

    if (!limitCheck.allowed) {
      if (limitCheck.reason === 'free_limit') {
        setShowUpgradeModal(true);
        return;
      }
    }

    setIsAnalyzing(true);
    setError(null);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 120000);

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

        if (response.status === 429) {
          setShowUpgradeModal(true);
          setIsAnalyzing(false);
          return;
        }

        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      const apiResult: AnalysisResult = await response.json();

      const displayResult = transformAnalysisResult(apiResult);

      await new Promise(resolve => setTimeout(resolve, 1000));

      setResults(displayResult);

      incrementUsage();

      setTimeout(() => {
        const resultsElement = document.getElementById('results');
        if (resultsElement) {
          const headerOffset = 120;
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
        } else {
          message = err.message;
        }
      }

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
    setResults(null);
    setError(null);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <SEO
        title="Analyze Your Resume - AI Resume Tailor"
        description="Get instant AI-powered analysis of your resume against any job description. See your match score, missing keywords, and improvement suggestions in 60 seconds."
        keywords="resume analysis, ATS score, resume checker, job match, resume keywords, AI analysis"
        path="/analyze"
      />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">AI Resume Tailor</h1>
          <p className="text-muted-foreground text-lg">
            Analyze how well your resume matches the job description
          </p>
        </div>

      {/* Input Section */}
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
        </div>
      )}

      {/* Loading State */}
      {isAnalyzing && <LoadingState />}

      {/* Low Credits Warning */}
      {(() => {
        const { remaining } = checkCanAnalyze();
        if (remaining <= 2 && remaining > 0 && !results) {
          return <LowCreditsBanner remaining={remaining} />;
        }
        return null;
      })()}

      {/* Results Section */}
      {results && (
        <ResultsSection
          results={results}
          onAnalyzeAgain={handleAnalyzeAgain}
          onEditAndOptimize={handleEditAndOptimize}
        />
      )}
      </div>

      {/* Upgrade Required Modal (Free -> Pro) */}
      <UpgradeRequiredModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        analysesUsed={checkCanAnalyze().used}
      />
    </>
  );
}
