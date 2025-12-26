import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { SAMPLE_ROLES } from '@/data/sampleData';
import { ValidatedTextArea } from './ValidatedTextArea';
import {
  validateResumeText,
  validateJobText,
  canSubmit,
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
  const { t } = useTranslation();
  const [resumeError, setResumeError] = useState<string | null>(null);
  const [jobError, setJobError] = useState<string | null>(null);
  const [touched, setTouched] = useState({ resume: false, job: false });

  const loadSample = (role: typeof SAMPLE_ROLES[0]) => {
    onResumeChange(role.resume);
    onJobChange(role.job);
    setTouched({ resume: true, job: true });
  };

  const handleClear = (target: 'resume' | 'job') => {
    if (target === 'resume') {
      onResumeChange('');
      setResumeError(null);
      setTouched((prev) => ({ ...prev, resume: false }));
    } else {
      onJobChange('');
      setJobError(null);
      setTouched((prev) => ({ ...prev, job: false }));
    }
  };

  useEffect(() => {
    if (touched.resume && resumeText) {
      setResumeError(validateResumeText(resumeText));
    } else if (!resumeText && !touched.resume) {
      setResumeError(null);
    }
  }, [resumeText, touched.resume]);

  useEffect(() => {
    if (touched.job && jobText) {
      setJobError(validateJobText(jobText));
    } else if (!jobText && !touched.job) {
      setJobError(null);
    }
  }, [jobText, touched.job]);

  const handleAnalyzeClick = () => {
    setTouched({ resume: true, job: true });
    
    const resumeValidation = validateResumeText(resumeText);
    const jobValidation = validateJobText(jobText);

    setResumeError(resumeValidation);
    setJobError(jobValidation);

    if (!resumeValidation && !jobValidation) {
      onAnalyze();
    }
  };

  const isValid = canSubmit(resumeText, jobText);

  return (
    <div className="space-y-8">
      <div className="text-center animate-in fade-in duration-500">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {t('analyze.selectRole')}
        </h2>
        
        <div className="flex flex-col items-center gap-3">
          <p className="text-gray-600 text-sm">
            {t('analyze.selectRole')}
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {SAMPLE_ROLES.map((role) => (
              <button
                key={role.id}
                onClick={() => loadSample(role)}
                disabled={isAnalyzing}
                className="px-4 py-1.5 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-100 hover:bg-blue-100 hover:border-blue-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {role.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ValidatedTextArea
          id="resume"
          label={t('analyze.resumeLabel')}
          value={resumeText}
          onChange={onResumeChange}
          placeholder={t('analyze.resumePlaceholder')}
          error={resumeError}
          showError={Boolean(touched.resume && !!resumeError)}
          onClear={() => handleClear('resume')}
          disabled={isAnalyzing}
          onBlur={() => setTouched((prev) => ({ ...prev, resume: true }))}
        />

        <ValidatedTextArea
          id="job-description"
          label={t('analyze.jobLabel')}
          value={jobText}
          onChange={onJobChange}
          placeholder={t('analyze.jobPlaceholder')}
          error={jobError}
          showError={Boolean(touched.job && !!jobError)}
          onClear={() => handleClear('job')}
          disabled={isAnalyzing}
          onBlur={() => setTouched((prev) => ({ ...prev, job: true }))}
        />
      </div>

      <div className="flex justify-center pt-4">
        <Button
          onClick={handleAnalyzeClick}
          disabled={!isValid || isAnalyzing}
          size="lg"
          className="px-12 py-6 text-lg rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
        >
          {isAnalyzing ? t('analyze.analyzing') : t('analyze.analyzeMatch')}
        </Button>
      </div>
    </div>
  );
}