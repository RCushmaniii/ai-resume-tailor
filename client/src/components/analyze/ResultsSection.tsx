import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { ArrowUpCircle } from 'lucide-react';
import AnalysisReport from './AnalysisReport';
import { EvaluationReport } from './EvaluationReport';
import type { DisplayAnalysisResult } from '@/types/analysis';

interface ResultsSectionProps {
  results: DisplayAnalysisResult;
  onAnalyzeAgain: () => void;
  onEditAndOptimize: () => void;
}

export function ResultsSection({ results, onAnalyzeAgain, onEditAndOptimize }: ResultsSectionProps) {
  const { t } = useTranslation();
  
  return (
    <div id="results" className="space-y-8 pb-12">
      {/* New Truthful Evaluation Report */}
      {results.evaluation && (
        <EvaluationReport evaluation={results.evaluation} />
      )}
      
      {/* Legacy Analysis Report (fallback if no evaluation) */}
      {!results.evaluation && <AnalysisReport data={results} />}

      {/* Primary Action Bar */}
      <div className="flex flex-col items-center justify-center gap-4 pt-8 border-t border-gray-100">
        <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">
                {t('analyze.results.nextStepTitle', 'Ready to improve your score?')}
            </h3>
            <p className="text-sm text-gray-500 max-w-md">
                {t('analyze.results.nextStepDesc', 'Edit your resume based on these suggestions and analyze again.')}
            </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={onEditAndOptimize}
            size="lg"
            className="px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all bg-blue-600 hover:bg-blue-700"
          >
            <ArrowUpCircle className="w-5 h-5 mr-2" />
            {t('analyze.results.editButton', 'Edit & Optimize')}
          </Button>
          
          <Button
            onClick={onAnalyzeAgain}
            variant="outline"
            size="lg"
            className="px-8 py-6 text-lg rounded-full"
          >
            {t('analyze.results.analyzeAgain', 'Analyze Again')}
          </Button>
        </div>
      </div>
    </div>
  );
}
