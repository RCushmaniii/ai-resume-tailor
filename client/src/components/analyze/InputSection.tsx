import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { FileText, Upload, CheckCircle } from 'lucide-react';
import { SAMPLE_ROLES } from '@/data/sampleData';
import { ValidatedTextArea } from './ValidatedTextArea';
import { FileUpload } from './FileUpload';
import {
  validateResumeText,
  validateJobText,
  canSubmit,
} from '@/lib/validation';

type ResumeInputMode = 'paste' | 'upload';

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
  const [resumeInputMode, setResumeInputMode] = useState<ResumeInputMode>('paste');
  const [showExtractionSuccess, setShowExtractionSuccess] = useState(false);

  // Handle file upload text extraction - auto-switch to paste mode to show full text
  const handleFileTextExtracted = (text: string) => {
    onResumeChange(text);
    setTouched((prev) => ({ ...prev, resume: true }));
    // Show success message and switch to paste mode so user can see/edit the full text
    setShowExtractionSuccess(true);
    setResumeInputMode('paste');
    // Clear success message after 5 seconds
    setTimeout(() => setShowExtractionSuccess(false), 5000);
  };

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
      setShowExtractionSuccess(false);
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
        {/* Resume Input with Mode Toggle */}
        <div className="space-y-3">
          {/* Input Mode Toggle */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">
              {t('analyze.resumeLabel')}
            </label>
            <div className="flex rounded-lg border border-gray-200 p-0.5 bg-gray-50">
              <button
                type="button"
                onClick={() => setResumeInputMode('paste')}
                disabled={isAnalyzing}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  resumeInputMode === 'paste'
                    ? 'bg-white text-blue-700 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                {t('analyze.pasteText', 'Paste')}
              </button>
              <button
                type="button"
                onClick={() => setResumeInputMode('upload')}
                disabled={isAnalyzing}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  resumeInputMode === 'upload'
                    ? 'bg-white text-blue-700 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                {t('analyze.uploadFile', 'Upload')}
              </button>
            </div>
          </div>

          {/* Conditional Input: Text Area or File Upload */}
          {resumeInputMode === 'paste' ? (
            <div className="space-y-2">
              {/* Success banner after file extraction */}
              {showExtractionSuccess && resumeText && (
                <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg animate-in fade-in slide-in-from-top-2 duration-300">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-green-800">
                      {t('analyze.extractionSuccess', 'Resume text extracted successfully!')}
                    </p>
                    <p className="text-xs text-green-600">
                      {t('analyze.extractionHint', 'Review your text below and make any edits before analyzing.')}
                    </p>
                  </div>
                </div>
              )}
              <ValidatedTextArea
                id="resume"
                label=""
                hideLabel
                value={resumeText}
                onChange={onResumeChange}
                placeholder={t('analyze.resumePlaceholder')}
                error={resumeError}
                showError={Boolean(touched.resume && !!resumeError)}
                onClear={() => handleClear('resume')}
                disabled={isAnalyzing}
                onBlur={() => setTouched((prev) => ({ ...prev, resume: true }))}
              />
            </div>
          ) : (
            <div className="space-y-2">
              <FileUpload
                onTextExtracted={handleFileTextExtracted}
                disabled={isAnalyzing}
              />
              {/* Show extracted text preview if we have content */}
              {resumeText && (
                <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-gray-600">
                      {t('analyze.extractedText', 'Extracted text preview')}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleClear('resume')}
                      className="text-xs text-red-600 hover:text-red-700"
                    >
                      {t('common.clear', 'Clear')}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-3">
                    {resumeText.substring(0, 300)}
                    {resumeText.length > 300 && '...'}
                  </p>
                </div>
              )}
              {touched.resume && resumeError && (
                <p className="text-xs text-red-600">{resumeError}</p>
              )}
            </div>
          )}
        </div>

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