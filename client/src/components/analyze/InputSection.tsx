import { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';
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
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Resume Input */}
        <div className="space-y-2">
          <Label htmlFor="resume" className="text-lg font-semibold">
            Paste Your Resume
          </Label>
          <Textarea
            id="resume"
            placeholder="Paste your resume here..."
            value={resumeText}
            onChange={(e) => onResumeChange(e.target.value)}
            onBlur={() => setTouched((prev) => ({ ...prev, resume: true }))}
            disabled={isAnalyzing}
            className={`min-h-[300px] resize-none ${
              showResumeError ? 'border-red-500 focus-visible:ring-red-500' : ''
            }`}
            aria-label="Resume text input"
            aria-invalid={!!showResumeError}
            aria-describedby={showResumeError ? 'resume-error' : undefined}
          />
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm text-muted-foreground">
              {resumeText.length.toLocaleString()} / {VALIDATION_RULES.MAX_LENGTH.toLocaleString()} characters
            </p>
          </div>
          {showResumeError && (
            <div id="resume-error" className="flex items-start gap-2 text-red-600 text-sm" role="alert">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>{resumeError}</span>
            </div>
          )}
        </div>

        {/* Job Description Input */}
        <div className="space-y-2">
          <Label htmlFor="job-description" className="text-lg font-semibold">
            Paste Job Description
          </Label>
          <Textarea
            id="job-description"
            placeholder="Paste the job description here..."
            value={jobText}
            onChange={(e) => onJobChange(e.target.value)}
            onBlur={() => setTouched((prev) => ({ ...prev, job: true }))}
            disabled={isAnalyzing}
            className={`min-h-[300px] resize-none ${
              showJobError ? 'border-red-500 focus-visible:ring-red-500' : ''
            }`}
            aria-label="Job description text input"
            aria-invalid={!!showJobError}
            aria-describedby={showJobError ? 'job-error' : undefined}
          />
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm text-muted-foreground">
              {jobText.length.toLocaleString()} / {VALIDATION_RULES.MAX_LENGTH.toLocaleString()} characters
            </p>
          </div>
          {showJobError && (
            <div id="job-error" className="flex items-start gap-2 text-red-600 text-sm" role="alert">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>{jobError}</span>
            </div>
          )}
        </div>
      </div>

      {/* Analyze Button */}
      <div className="flex justify-center">
        <Button
          onClick={handleAnalyzeClick}
          disabled={!isValid || isAnalyzing}
          size="lg"
          className="px-12"
        >
          {isAnalyzing ? 'Analyzing...' : 'Analyze Match'}
        </Button>
      </div>
    </div>
  );
}
