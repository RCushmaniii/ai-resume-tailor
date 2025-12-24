import React from 'react';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Info, 
  Clock 
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { DisplayAnalysisResult } from '@/types/analysis';

interface AnalysisReportProps {
  data: DisplayAnalysisResult;
}

const AnalysisReport: React.FC<AnalysisReportProps> = ({ data }) => {
  const { t } = useTranslation();
  // Helper to determine badge color for suggestions
  const getSuggestionStyle = (type: 'critical' | 'warning' | 'tip') => {
    switch (type) {
      case 'critical': return 'border-l-4 border-red-500 bg-red-50';
      case 'warning': return 'border-l-4 border-yellow-500 bg-yellow-50';
      default: return 'border-l-4 border-blue-500 bg-blue-50';
    }
  };

  const getSuggestionIcon = (type: 'critical' | 'warning' | 'tip') => {
    switch (type) {
      case 'critical': return <XCircle className="w-5 h-5 text-red-600" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      default: return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-fade-in">
      
      {/* 1. HERO SECTION: Score & Summary */}
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 flex flex-col md:flex-row items-center gap-8">
        {/* Score Circle */}
        <div className="relative w-40 h-40 flex-shrink-0">
          <svg className="w-full h-full" viewBox="0 0 36 36">
            <path
              className="text-gray-200"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            />
            <path
              className={`${data.score >= 80 ? 'text-green-500' : data.score >= 60 ? 'text-yellow-500' : 'text-red-500'} transition-all duration-1000 ease-out`}
              strokeDasharray={`${data.score}, 100`}
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
            <span className="text-4xl font-bold text-gray-800">{data.score}</span>
            <span className="block text-xs text-gray-400 uppercase tracking-wide">Match</span>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('analyze.results.reportTitle')}</h2>
          <p className="text-gray-600 leading-relaxed">{data.summary}</p>
          
          {/* Metadata Badge */}
          <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
            <Clock className="w-3 h-3" />
            <span>{t('analyze.results.analyzedIn', { seconds: data.processing_time_seconds?.toFixed(2) })}</span>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        
        {/* 2. KEYWORDS ANALYSIS (The "Hard Skills" Check) */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            {t('analyze.results.atsScan')}
          </h3>
          
          {/* Missing - The Priority */}
          <div className="mb-6">
            <span className="text-sm font-semibold text-red-600 uppercase tracking-wider mb-2 block">
              {t('analyze.results.missingKeywords')}
            </span>
            <div className="flex flex-wrap gap-2">
              {data.keywords.missing.length > 0 ? (
                data.keywords.missing.map((kw, idx) => (
                  <span key={idx} className="px-3 py-1 bg-red-50 text-red-700 border border-red-100 rounded-full text-sm font-medium flex items-center gap-1">
                    <XCircle className="w-3 h-3" /> {kw}
                  </span>
                ))
              ) : (
                <span className="text-sm text-gray-500 italic">{t('analyze.results.noMissing')}</span>
              )}
            </div>
          </div>

          {/* Present - The Validation */}
          <div>
            <span className="text-sm font-semibold text-green-600 uppercase tracking-wider mb-2 block">
              {t('analyze.results.foundKeywords')}
            </span>
            <div className="flex flex-wrap gap-2">
              {data.keywords.present.map((kw, idx) => (
                <span key={idx} className="px-3 py-1 bg-green-50 text-green-700 border border-green-100 rounded-full text-sm font-medium flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> {kw}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 3. SCORE BREAKDOWN (The Metrics) */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-6">{t('analyze.results.detailedScoring')}</h3>
          <div className="space-y-6">
            {[
              { label: t('analyze.results.metrics.hardSkills'), val: data.score_breakdown.keywords },
              { label: t('analyze.results.metrics.semantic'), val: data.score_breakdown.semantic },
              { label: t('analyze.results.metrics.tone'), val: data.score_breakdown.tone }
            ].map((metric, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-sm mb-1 font-medium text-gray-700">
                  <span>{metric.label}</span>
                  <span>{metric.val}/100</span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 rounded-full transition-all duration-1000"
                    style={{ width: `${metric.val}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. ACTIONABLE SUGGESTIONS (The "Coach") */}
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-6">{t('analyze.results.optimizationPlan')}</h3>
        <div className="space-y-4">
          {data.suggestions.map((suggestion, idx) => (
            <div 
              key={idx} 
              className={`p-4 rounded-lg border flex gap-4 ${getSuggestionStyle(suggestion.type)}`}
            >
              <div className="flex-shrink-0 mt-1">
                {getSuggestionIcon(suggestion.type)}
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm md:text-base">
                  {suggestion.title}
                </h4>
                <p className="text-sm text-gray-700 mt-1 leading-relaxed">
                  {suggestion.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default AnalysisReport;
