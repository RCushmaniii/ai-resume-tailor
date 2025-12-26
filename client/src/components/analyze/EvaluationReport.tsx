import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Search, 
  Target, 
  Star, 
  FileCheck,
  TrendingUp,
  Shield,
  Eye
} from 'lucide-react';

interface EvaluationData {
  hiring_readiness: 'HIGH' | 'MEDIUM' | 'LOW';
  hiring_readiness_summary: string;
  ats_compatibility: {
    status: 'STRONG' | 'PASS' | 'RISK';
    details: string[];
    summary: string;
  };
  search_visibility: {
    level: 'HIGH' | 'MEDIUM' | 'LOW';
    searchable_terms: string[];
    summary: string;
  };
  alignment: {
    score: number;
    strengths: string[];
    refinements: Array<{
      skill: string;
      current: string;
      suggested: string;
      impact: string;
      blocking: string;
    }>;
  };
  human_readability: {
    stars: number;
    notes: string[];
  };
  verdict: {
    ready_to_submit: boolean;
    message: string;
  };
}

interface EvaluationReportProps {
  evaluation: EvaluationData;
}

const StatusBadge = ({ 
  status, 
  type 
}: { 
  status: string; 
  type: 'readiness' | 'ats' | 'visibility' 
}) => {
  const getConfig = () => {
    if (type === 'readiness') {
      if (status === 'HIGH') return { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle };
      if (status === 'MEDIUM') return { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: AlertTriangle };
      return { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle };
    }
    if (type === 'ats') {
      if (status === 'STRONG') return { bg: 'bg-green-100', text: 'text-green-800', icon: Shield };
      if (status === 'PASS') return { bg: 'bg-blue-100', text: 'text-blue-800', icon: CheckCircle };
      return { bg: 'bg-red-100', text: 'text-red-800', icon: AlertTriangle };
    }
    // visibility
    if (status === 'HIGH') return { bg: 'bg-green-100', text: 'text-green-800', icon: Eye };
    if (status === 'MEDIUM') return { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Eye };
    return { bg: 'bg-red-100', text: 'text-red-800', icon: Eye };
  };

  const config = getConfig();
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold ${config.bg} ${config.text}`}>
      <Icon className="w-4 h-4" />
      {status}
    </span>
  );
};

const StarRating = ({ stars }: { stars: number }) => {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`w-5 h-5 ${i <= stars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
        />
      ))}
    </div>
  );
};

export function EvaluationReport({ evaluation }: EvaluationReportProps) {
  return (
    <div className="space-y-6">
      {/* Header with Hiring Readiness */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Target className="w-6 h-6 text-indigo-600" />
            Resume Evaluation Results
          </h2>
          <StatusBadge status={evaluation.hiring_readiness} type="readiness" />
        </div>
        <p className="text-gray-600 text-lg">{evaluation.hiring_readiness_summary}</p>
      </div>

      {/* Section 1: ATS Compatibility */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            ATS Compatibility
          </h3>
          <StatusBadge status={evaluation.ats_compatibility.status} type="ats" />
        </div>
        
        <ul className="space-y-2 mb-4">
          {evaluation.ats_compatibility.details.map((detail, i) => (
            <li key={i} className="flex items-center gap-2 text-gray-600">
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
              {detail}
            </li>
          ))}
        </ul>
        
        <p className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
          {evaluation.ats_compatibility.summary}
        </p>
      </div>

      {/* Section 2: Recruiter Search Visibility */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Search className="w-5 h-5 text-purple-600" />
            Recruiter Search Visibility
          </h3>
          <StatusBadge status={evaluation.search_visibility.level} type="visibility" />
        </div>
        
        <p className="text-gray-600 mb-4">You are discoverable when recruiters search for:</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {evaluation.search_visibility.searchable_terms.map((term, i) => (
            <span
              key={i}
              className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm font-medium"
            >
              {term}
            </span>
          ))}
        </div>
        
        <p className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
          {evaluation.search_visibility.summary}
        </p>
      </div>

      {/* Section 3: Resume-Job Alignment */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            Resume-Job Alignment
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-3xl font-bold text-indigo-600">{evaluation.alignment.score}</span>
            <span className="text-gray-400">/ 100</span>
          </div>
        </div>
        
        <p className="text-sm text-gray-500 mb-4">(Optimization metric — not a hiring decision)</p>
        
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
        
        {evaluation.alignment.refinements.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-medium text-yellow-800 mb-2">Optional refinements (non-blocking):</h4>
            <ul className="space-y-2">
              {evaluation.alignment.refinements.map((refinement, i) => (
                <li key={i} className="text-sm text-yellow-700">
                  <span className="font-medium">{refinement.skill}:</span> {refinement.suggested}
                  <span className="text-yellow-600 ml-2">• {refinement.impact}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Section 4: Human Readability */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-orange-600" />
            Human Readability
          </h3>
          <StarRating stars={evaluation.human_readability.stars} />
        </div>
        
        <div className="flex flex-wrap gap-2">
          {evaluation.human_readability.notes.map((note, i) => (
            <span
              key={i}
              className="px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-sm"
            >
              {note}
            </span>
          ))}
        </div>
      </div>

      {/* Section 5: Final Verdict */}
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
              ? '✅ This resume is ready to submit.' 
              : '⚠️ Consider improvements before submitting.'}
          </h3>
        </div>
        <p className={`text-lg ${
          evaluation.verdict.ready_to_submit ? 'text-green-700' : 'text-yellow-700'
        }`}>
          {evaluation.verdict.message}
        </p>
      </div>
    </div>
  );
}

export default EvaluationReport;
