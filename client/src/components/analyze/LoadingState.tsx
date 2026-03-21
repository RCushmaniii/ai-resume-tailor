import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

const STEP_KEYS = [
  'reading',
  'extracting',
  'matching',
  'scoring',
  'recommendations',
  'finalizing',
] as const;

// How long each step displays before advancing (ms)
const STEP_DURATIONS = [3000, 5000, 7000, 6000, 5000, Infinity];
// Show the "still working" hint after this many seconds
const HANG_HINT_THRESHOLD = 20;

export function LoadingState() {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);
  const [elapsed, setElapsed] = useState(0);

  // Elapsed timer — ticks every second
  useEffect(() => {
    const id = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);

  // Step progression — advances through stages on a timer
  useEffect(() => {
    const duration = STEP_DURATIONS[currentStep];
    if (duration === Infinity) return; // stay on last step
    const id = setTimeout(
      () => setCurrentStep((s) => Math.min(s + 1, STEP_KEYS.length - 1)),
      duration,
    );
    return () => clearTimeout(id);
  }, [currentStep]);

  const stepKey = STEP_KEYS[currentStep];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">

      {/* Progress indicator */}
      <Card className="p-6 border-blue-100 bg-blue-50/50 shadow-sm">
        <div className="flex flex-col items-center gap-4">
          {/* Animated spinner */}
          <div className="relative h-12 w-12">
            <div className="absolute inset-0 rounded-full border-4 border-blue-200" />
            <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
          </div>

          {/* Current step label */}
          <p className="text-lg font-medium text-blue-900 transition-opacity duration-300">
            {t(`analyze.loadingSteps.${stepKey}`)}
          </p>

          {/* Step dots */}
          <div className="flex gap-2">
            {STEP_KEYS.map((_, i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all duration-500 ${
                  i < currentStep
                    ? 'w-6 bg-blue-600'
                    : i === currentStep
                      ? 'w-6 bg-blue-400 animate-pulse'
                      : 'w-2 bg-blue-200'
                }`}
              />
            ))}
          </div>

          {/* Elapsed time + hint */}
          <div className="text-sm text-blue-600/70 text-center space-y-1">
            <p>{t('analyze.loadingElapsed', { seconds: elapsed })}</p>
            {elapsed >= HANG_HINT_THRESHOLD && (
              <p className="animate-in fade-in duration-500">
                {t('analyze.loadingHang')}
              </p>
            )}
          </div>
        </div>
      </Card>

      {/* 1. HERO SECTION SKELETON (Matches AnalysisReport Header) */}
      <Card className="p-8 border-gray-100 shadow-sm">
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Circle Placeholder (Matches the Score Circle) */}
          <Skeleton className="h-40 w-40 rounded-full flex-shrink-0" />

          {/* Summary Text Placeholders */}
          <div className="flex-1 space-y-4 w-full text-center md:text-left">
            <Skeleton className="h-8 w-1/3 mb-2 mx-auto md:mx-0" /> {/* Title */}
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3 mx-auto md:mx-0" />

            {/* Metadata badge placeholder */}
            <div className="pt-2 flex justify-center md:justify-start">
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        </div>
      </Card>

      {/* 2. GRID SECTION (Matches Keywords & Scoring Columns) */}
      <div className="grid md:grid-cols-2 gap-8">

        {/* Left Col: Keywords Skeleton */}
        <Card className="p-6 border-gray-100 shadow-sm space-y-6">
          <Skeleton className="h-6 w-1/2" /> {/* Section Title */}

          {/* Missing Keywords (Critical) */}
          <div className="space-y-3">
             <Skeleton className="h-4 w-1/3 mb-2" />
             <div className="flex flex-wrap gap-2">
               {[1, 2, 3].map((i) => (
                 <Skeleton key={i} className="h-8 w-24 rounded-full" />
               ))}
             </div>
          </div>

          {/* Present Keywords */}
          <div className="space-y-3">
             <Skeleton className="h-4 w-1/3 mb-2" />
             <div className="flex flex-wrap gap-2">
               {[1, 2, 3, 4].map((i) => (
                 <Skeleton key={i} className="h-8 w-24 rounded-full" />
               ))}
             </div>
          </div>
        </Card>

        {/* Right Col: Score Breakdown Skeleton */}
        <Card className="p-6 border-gray-100 shadow-sm space-y-6">
          <Skeleton className="h-6 w-1/2" /> {/* Section Title */}
          {/* 3 Progress Bars */}
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-8" />
              </div>
              <Skeleton className="h-2 w-full rounded-full" />
            </div>
          ))}
        </Card>
      </div>

      {/* 3. SUGGESTIONS SKELETON (Matches Optimization Plan Cards) */}
      <Card className="p-8 border-gray-100 shadow-sm space-y-6">
        <Skeleton className="h-7 w-48" /> {/* Title */}
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 border rounded-lg flex gap-4">
               {/* Icon Placeholder */}
               <Skeleton className="h-5 w-5 rounded-full flex-shrink-0" />
               {/* Text Placeholder */}
               <div className="space-y-2 w-full">
                 <Skeleton className="h-5 w-1/4" />
                 <Skeleton className="h-4 w-3/4" />
               </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
