import { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { AlertCircle, X, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SAMPLE_ROLES } from '@/data/sampleData';
import {
  validateResumeText,
  validateJobText,
  canSubmit,
  VALIDATION_RULES,
} from '@/lib/validation';

interface InputSectionProps {
  resumeText: string;
  jobText: string;
  isAnalyzing: boolean;
  onResumeChange: (value: string) => void;
  onJobChange: (value: string) => void;
  onAnalyze: () => void;
}

export function InputSection({
  resumeText,
  jobText,
  isAnalyzing,
  onResumeChange,
  onJobChange,
  onAnalyze,
}: InputSectionProps) {
  const [resumeError, setResumeError] = useState<string | null>(null);
  const [jobError, setJobError] = useState<string | null>(null);
  const [touched, setTouched] = useState({ resume: false, job: false });
  const { t } = useTranslation();

  // Sample data for testing
  const fillSampleData = (roleId: string) => {
    const role = SAMPLE_ROLES.find(r => r.id === roleId);
    if (role) {
      onResumeChange(role.resume);
      onJobChange(role.job);
    }
  };

  const handleClear = (setter: (value: string) => void) => {
    setter('');
  };

  // Validate on blur or when user stops typing
  useEffect(() => {
    if (touched.resume && resumeText) {
      setResumeError(validateResumeText(resumeText));
    }
  }, [resumeText, touched.resume]);

  useEffect(() => {
    if (touched.job && jobText) {
      setJobError(validateJobText(jobText));
    }
  }, [jobText, touched.job]);

  const handleAnalyzeClick = () => {
    // Mark both as touched
    setTouched({ resume: true, job: true });

    // Validate both fields
    const resumeValidation = validateResumeText(resumeText);
    const jobValidation = validateJobText(jobText);

    setResumeError(resumeValidation);
    setJobError(jobValidation);

    // Only proceed if both are valid
    if (!resumeValidation && !jobValidation) {
      onAnalyze();
    }
  };

  const isValid = canSubmit(resumeText, jobText);
  const showResumeError = touched.resume && resumeError;
  const showJobError = touched.job && jobError;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Sample Role Chips */}
      <div className="text-center mb-8">
        <div className="flex flex-col items-center gap-3">
          <p className="text-sm text-gray-600">
            {t('analyze.selectRole')}
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {SAMPLE_ROLES.map((role) => (
              <button
                key={role.id}
                onClick={() => fillSampleData(role.id)}
                disabled={isAnalyzing}
                className="px-4 py-1.5 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-100 hover:bg-blue-100 hover:border-blue-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {role.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Resume Input */}
        <div className="flex flex-col">
          <Label className="flex items-center justify-between font-semibold text-gray-700 mb-2">
            <span>{t('analyze.resumeLabel')}</span>
            <span className="text-xs font-normal text-gray-400">
              {resumeText.length.toLocaleString()} / {VALIDATION_RULES.MAX_LENGTH.toLocaleString()} {t('analyze.characters')}
            </span>
          </Label>
          <div className="relative group">
            <Textarea
              placeholder={t('analyze.resumePlaceholder')}
              value={resumeText}
              onChange={(e) => onResumeChange(e.target.value)}
              onBlur={() => setTouched((prev) => ({ ...prev, resume: true }))}
              disabled={isAnalyzing}
              className={`min-h-[300px] resize-none pr-10 ${
                showResumeError ? 'border-red-500 focus-visible:ring-red-500' : ''
              }`}
              aria-label={t('analyze.resumeLabel')}
              aria-invalid={!!showResumeError}
              aria-describedby={showResumeError ? 'resume-error' : undefined}
            />
            {resumeText && !isAnalyzing && (
              <button
                onClick={() => handleClear(onResumeChange)}
                className="absolute top-3 right-3 p-1 bg-white text-gray-400 hover:text-red-500 rounded-full shadow-md transition-colors"
                title={t('analyze.clear')}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          {showResumeError && (
            <div id="resume-error" className="flex items-start gap-2 text-red-600 text-sm mt-2" role="alert">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>{resumeError}</span>
            </div>
          )}
        </div>

        {/* Job Description Input */}
        <div className="flex flex-col">
          <Label className="flex items-center justify-between font-semibold text-gray-700 mb-2">
            <span>{t('analyze.jobLabel')}</span>
            <span className="text-xs font-normal text-gray-400">
              {jobText.length.toLocaleString()} / {VALIDATION_RULES.MAX_LENGTH.toLocaleString()} {t('analyze.characters')}
            </span>
          </Label>
          <div className="relative group">
            <Textarea
              placeholder={t('analyze.jobPlaceholder')}
              value={jobText}
              onChange={(e) => onJobChange(e.target.value)}
              onBlur={() => setTouched((prev) => ({ ...prev, job: true }))}
              disabled={isAnalyzing}
              className={`min-h-[300px] resize-none pr-10 ${
                showJobError ? 'border-red-500 focus-visible:ring-red-500' : ''
              }`}
              aria-label={t('analyze.jobLabel')}
              aria-invalid={!!showJobError}
              aria-describedby={showJobError ? 'job-error' : undefined}
            />
            {jobText && !isAnalyzing && (
              <button
                onClick={() => handleClear(onJobChange)}
                className="absolute top-3 right-3 p-1 bg-white text-gray-400 hover:text-red-500 rounded-full shadow-md transition-colors"
                title={t('analyze.clear')}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          {showJobError && (
            <div id="job-error" className="flex items-start gap-2 text-red-600 text-sm mt-2" role="alert">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>{jobError}</span>
            </div>
          )}
        </div>
      </div>

      {/* Action Button */}
      <div className="mt-10 text-center">
        <Button
          onClick={handleAnalyzeClick}
          disabled={!isValid || isAnalyzing}
          size="lg"
          className={`px-10 py-4 rounded-full text-lg font-bold shadow-lg transform transition-all duration-200 ${
            !isValid || isAnalyzing
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-900 text-white hover:bg-blue-800 hover:scale-105 hover:shadow-xl'
          }`}
        >
          {isAnalyzing ? (
            <>
              <Sparkles className="w-5 h-5 mr-2 animate-pulse" />
              {t('analyze.analyzing')}
            </>
          ) : !isValid ? (
            t('analyze.pasteBothToStart')
          ) : (
            t('analyze.analyzeMatch')
          )}
        </Button>
      </div>
    </div>
  );
}
