import { useState, useRef } from 'react';
import { toast } from 'sonner';
import { SEO } from '@/components/SEO';
import { InputSection } from '@/components/analyze/InputSection';
import { LoadingState } from '@/components/analyze/LoadingState';
import { ResultsSection } from '@/components/analyze/ResultsSection';
import type { DisplayAnalysisResult } from '@/types/analysis';
import { transformAnalysisResult, type AnalysisResult } from '@/types/analysis';

export function Analyze() {
  const [resumeText, setResumeText] = useState('');
  const [jobText, setJobText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<DisplayAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const resumeInputRef = useRef<HTMLTextAreaElement>(null);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setError(null);
    
    // Set up timeout controller
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
    try {
      const API_URL = import.meta.env.VITE_API_URL || '/api';
      console.log('🔍 API URL:', API_URL); // Debug: verify environment variable
      const response = await fetch(`${API_URL}/analyze`, {
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

      const apiResult: AnalysisResult = await response.json();
      
      // Transform backend format to frontend display format
      const displayResult = transformAnalysisResult(apiResult);
      
      // Keep minimum 1s loading to prevent UI flash
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setResults(displayResult);
      
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
