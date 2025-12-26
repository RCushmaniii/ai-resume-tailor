import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Search, 
  Target, 
  TrendingUp,
  Shield,
  FileText
} from 'lucide-react';
import type { EvaluationData } from '@/types/analysis';

interface EvaluationReportProps {
  evaluation: EvaluationData;
}

const StatusBadge = ({ 
  status, 
  type 
}: { 
  status: string; 
  type: 'hiring' | 'ats' | 'search' 
}) => {
  const getConfig = () => {
    if (type === 'hiring') {
      if (status === 'READY') return { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle, label: 'READY TO SUBMIT' };
      return { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: AlertTriangle, label: 'NEEDS ATTENTION' };
    }
    if (type === 'ats') {
      if (status === 'PASS') return { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle, label: 'PASS' };
      return { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle, label: 'FAIL' };
    }
    // search
    if (status === 'DISCOVERABLE') return { bg: 'bg-green-100', text: 'text-green-800', icon: Search, label: 'DISCOVERABLE' };
    if (status === 'LIMITED') return { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Search, label: 'LIMITED' };
    return { bg: 'bg-red-100', text: 'text-red-800', icon: Search, label: 'LOW VISIBILITY' };
  };

  const config = getConfig();
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold ${config.bg} ${config.text}`}>
      <Icon className="w-4 h-4" />
      {config.label}
    </span>
  );
};

export function EvaluationReport({ evaluation }: EvaluationReportProps) {
  return (
    <div className="space-y-6">
      {/* Primary Status Banner */}
      <div className={`rounded-xl shadow-sm border-2 p-6 ${
        evaluation.hiring.status === 'READY' 
          ? 'bg-green-50 border-green-300' 
          : 'bg-yellow-50 border-yellow-300'
      }`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <Target className={`w-8 h-8 ${
              evaluation.hiring.status === 'READY' ? 'text-green-600' : 'text-yellow-600'
            }`} />
            <div>
              <h2 className={`text-xl font-bold ${
                evaluation.hiring.status === 'READY' ? 'text-green-800' : 'text-yellow-800'
              }`}>
                STATUS: {evaluation.hiring.status === 'READY' ? 'READY TO SUBMIT' : 'NEEDS ATTENTION'}
              </h2>
            </div>
          </div>
        </div>
        <p className={`text-lg ${
          evaluation.hiring.status === 'READY' ? 'text-green-700' : 'text-yellow-700'
        }`}>
          {evaluation.hiring.summary}
        </p>
        <p className={`text-sm mt-2 ${
          evaluation.hiring.status === 'READY' ? 'text-green-600' : 'text-yellow-600'
        }`}>
          {evaluation.hiring.reassurance}
        </p>
      </div>

      {/* ATS Compatibility - Binary Gate */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            ATS STATUS
          </h3>
          <StatusBadge status={evaluation.ats.status} type="ats" />
        </div>
        
        <ul className="space-y-2 mb-4">
          {evaluation.ats.checks.map((check, i) => (
            <li key={i} className="flex items-center gap-2 text-gray-600">
              {evaluation.ats.status === 'PASS' ? (
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
              ) : (
                <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
              )}
              {check}
            </li>
          ))}
        </ul>
        
        <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg font-medium">
          {evaluation.ats.summary}
        </p>
      </div>

      {/* Recruiter Search Visibility - Gate with Count */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Search className="w-5 h-5 text-slate-700" />
            SEARCH STATUS
          </h3>
          <StatusBadge status={evaluation.search.status} type="search" />
        </div>
        
        <p className="text-gray-600 mb-3">{evaluation.search.summary}</p>
        
        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm text-gray-500">Search criteria matched:</span>
          <span className="font-bold text-slate-800">
            {evaluation.search.matched} / {evaluation.search.total}
          </span>
        </div>
        
        {evaluation.search.terms.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {evaluation.search.terms.map((term, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium"
              >
                {term}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Resume Optimization Alignment - ONLY numeric score */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            Resume Optimization Alignment
          </h3>
          <div className="text-right">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-indigo-600">{evaluation.alignment.score}</span>
              <span className="text-gray-400">/ 100</span>
              <span className="text-indigo-500 font-medium ml-2">— {evaluation.alignment.label}</span>
            </div>
          </div>
        </div>
        
        <p className="text-sm text-gray-500 mb-4">
          This score reflects wording alignment, not hiring eligibility. Scores above 80 are typically competitive.
        </p>
        
        {evaluation.alignment.strengths.length > 0 && (
          <div className="mb-4">
            <h4 className="font-medium text-gray-900 mb-2">What's working well:</h4>
            <ul className="space-y-1">
              {evaluation.alignment.strengths.map((strength, i) => (
                <li key={i} className="flex items-center gap-2 text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  {strength}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {evaluation.alignment.refinements.length > 0 && !evaluation.verdict.stop_optimizing && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-700 mb-2">Optional polish (not required)</h4>
            <p className="text-sm text-gray-500 mb-3">
              These suggestions may slightly improve alignment, but your resume already meets hiring requirements.
            </p>
            <ul className="space-y-2">
              {evaluation.alignment.refinements.map((refinement, i) => (
                <li key={i} className="text-sm text-gray-600">
                  <span className="font-medium">{refinement.skill}:</span> {refinement.suggested}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Human Readability - Qualitative Only */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-orange-600" />
            Readability
          </h3>
          <span className={`px-3 py-1 rounded-full text-sm font-bold ${
            evaluation.readability.label === 'Strong' 
              ? 'bg-green-100 text-green-800'
              : evaluation.readability.label === 'Good'
              ? 'bg-blue-100 text-blue-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {evaluation.readability.label}
          </span>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {evaluation.readability.notes.map((note, i) => (
            <span
              key={i}
              className="px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-sm"
            >
              {note}
            </span>
          ))}
        </div>
      </div>

      {/* Final Verdict - Hard Stop */}
      <div className={`rounded-xl shadow-sm border-2 p-6 ${
        evaluation.verdict.ready_to_submit 
          ? 'bg-green-50 border-green-300' 
          : 'bg-yellow-50 border-yellow-300'
      }`}>
        <div className="flex items-center gap-3 mb-3">
          {evaluation.verdict.ready_to_submit ? (
            <CheckCircle className="w-8 h-8 text-green-600" />
          ) : (
            <AlertTriangle className="w-8 h-8 text-yellow-600" />
          )}
          <h3 className={`text-xl font-bold ${
            evaluation.verdict.ready_to_submit ? 'text-green-800' : 'text-yellow-800'
          }`}>
            {evaluation.verdict.ready_to_submit 
              ? '✅ Ready to submit' 
              : '⚠️ Review before submitting'}
          </h3>
        </div>
        <p className={`text-lg ${
          evaluation.verdict.ready_to_submit ? 'text-green-700' : 'text-yellow-700'
        }`}>
          {evaluation.verdict.message}
        </p>
        
        {evaluation.verdict.stop_optimizing && (
          <p className="text-sm text-green-600 mt-3 font-medium">
            Improving this score further is optional and may not affect hiring outcomes.
          </p>
        )}
      </div>
    </div>
  );
}

export default EvaluationReport;
