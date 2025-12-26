import { useState } from 'react';
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
import { HelpModal, HelpButton } from './HelpModal';
import { StatusTooltip, getTooltipType } from './StatusTooltip';

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
  const [helpOpen, setHelpOpen] = useState(false);
  
  const isReady = evaluation.verdict.ready_to_submit;
  const atsFailed = evaluation.ats.status === 'FAIL';

  return (
    <div className="space-y-6">
      <HelpModal isOpen={helpOpen} onClose={() => setHelpOpen(false)} />
      
      {/* Help Link */}
      <div className="flex justify-end">
        <HelpButton onClick={() => setHelpOpen(true)} />
      </div>

      {/* Primary Status Banner */}
      <div className={`rounded-xl shadow-sm border-2 p-6 ${
        isReady ? 'bg-green-50 border-green-300' : 'bg-yellow-50 border-yellow-300'
      }`}>
        <div className="flex items-center justify-between mb-3">
          <StatusTooltip type={getTooltipType('hiring', evaluation.hiring.status)}>
            <div className="flex items-center gap-3">
              <Target className={`w-8 h-8 ${isReady ? 'text-green-600' : 'text-yellow-600'}`} />
              <h2 className={`text-xl font-bold ${isReady ? 'text-green-800' : 'text-yellow-800'}`}>
                STATUS: {isReady ? 'READY TO SUBMIT' : 'ACTION NEEDED'}
              </h2>
            </div>
          </StatusTooltip>
        </div>
        
        <p className={`text-lg ${isReady ? 'text-green-700' : 'text-yellow-700'}`}>
          {isReady 
            ? evaluation.hiring.summary
            : 'Your resume does not yet meet all screening requirements for this role.'}
        </p>
        <p className={`text-sm mt-2 ${isReady ? 'text-green-600' : 'text-yellow-600'}`}>
          {isReady 
            ? evaluation.hiring.reassurance
            : 'Fixing the items below is required to pass ATS screening and appear in recruiter searches.'}
        </p>
      </div>

      {/* ATS Compatibility - Binary Gate */}
      <div className={`rounded-xl shadow-sm border p-6 ${
        atsFailed ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <StatusTooltip type={getTooltipType('ats', evaluation.ats.status)}>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Shield className={`w-5 h-5 ${atsFailed ? 'text-red-600' : 'text-blue-600'}`} />
              ATS STATUS
            </h3>
          </StatusTooltip>
          <StatusBadge status={evaluation.ats.status} type="ats" />
        </div>
        
        <ul className="space-y-2 mb-4">
          {evaluation.ats.checks.map((check, i) => (
            <li key={i} className="flex items-center gap-2 text-gray-600">
              {evaluation.ats.status === 'PASS' ? (
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
              ) : (
                i === 0 ? (
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                )
              )}
              {check}
            </li>
          ))}
        </ul>
        
        <p className={`text-sm p-3 rounded-lg font-medium ${
          atsFailed ? 'bg-red-100 text-red-800' : 'bg-gray-50 text-gray-600'
        }`}>
          {evaluation.ats.summary}
        </p>
      </div>

      {/* Recruiter Search Visibility */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <StatusTooltip type={getTooltipType('search', evaluation.search.status)}>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Search className="w-5 h-5 text-slate-700" />
              SEARCH STATUS
            </h3>
          </StatusTooltip>
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
          <div>
            {!isReady && (
              <p className="text-sm text-gray-500 mb-2">Examples of required criteria not currently detected:</p>
            )}
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
          </div>
        )}
      </div>

      {/* Resume Optimization Alignment */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <StatusTooltip type="alignment">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              Resume Optimization Alignment
            </h3>
          </StatusTooltip>
          <div className="text-right">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-indigo-600">{Math.max(20, evaluation.alignment.score)}</span>
              <span className="text-gray-400">/ 100</span>
              <span className="text-indigo-500 font-medium ml-2">— {evaluation.alignment.label}</span>
            </div>
          </div>
        </div>
        
        <p className="text-sm text-gray-500 mb-4">
          {isReady 
            ? 'This score reflects wording alignment, not hiring eligibility. Scores above 80 are typically competitive.'
            : 'This score reflects wording alignment, not hiring eligibility.'}
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
        
        {!isReady && evaluation.alignment.score < 80 && (
          <p className="text-sm text-yellow-700 mb-4">
            Improving this score requires addressing the ATS and search gaps listed above. Wording changes alone will not resolve this.
          </p>
        )}
        
        {/* Conditional refinements section */}
        {evaluation.alignment.refinements.length > 0 && !evaluation.verdict.stop_optimizing && (
          <div className={`rounded-lg p-4 ${
            isReady ? 'bg-gray-50 border border-gray-200' : 'bg-yellow-50 border border-yellow-300'
          }`}>
            <h4 className={`font-medium mb-3 ${isReady ? 'text-gray-700' : 'text-yellow-800'}`}>
              {isReady ? 'Optional polish (not required)' : 'What needs attention (required)'}
            </h4>
            <ul className="space-y-2">
              {evaluation.alignment.refinements.map((refinement, i) => (
                <li key={i} className={`text-sm ${isReady ? 'text-gray-600' : 'text-yellow-800'}`}>
                  <span className="font-medium">{refinement.skill}:</span> {refinement.suggested}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Human Readability */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-orange-600" />
            Readability:
          </h3>
          <span className={`px-3 py-1 rounded-full text-sm font-bold ${
            evaluation.readability.label === 'Strong' || evaluation.readability.label === 'Clear'
              ? 'bg-green-100 text-green-800'
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

      {/* Role Misalignment Notice - Only shows when detected */}
      {evaluation.roleMisalignment?.detected && (
        <div className="rounded-xl shadow-sm border-2 border-orange-300 bg-orange-50 p-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-8 h-8 text-orange-600" />
            <div>
              <h3 className="text-lg font-bold text-orange-800">
                ⚠️ Role Alignment Notice
              </h3>
              <p className="text-sm text-orange-600">
                Possible role mismatch detected
              </p>
            </div>
          </div>
          
          <p className="text-orange-800 mb-4">
            Based on your resume and this job's requirements, there appears to be a gap in scope or seniority for this position. 
            <span className="block mt-2 font-medium">This does not reflect your potential — only alignment with this specific role.</span>
          </p>

          {evaluation.roleMisalignment.reasons.length > 0 && (
            <div className="mb-4">
              <h4 className="font-semibold text-orange-900 mb-2">Why this matters:</h4>
              <ul className="space-y-1">
                {evaluation.roleMisalignment.reasons.map((reason, i) => (
                  <li key={i} className="flex items-start gap-2 text-orange-800 text-sm">
                    <span className="text-orange-500 mt-0.5">•</span>
                    {reason}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            {evaluation.roleMisalignment.rewritingCanHelp.length > 0 && (
              <div className="bg-white/60 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Rewriting can help with:
                </h4>
                <ul className="space-y-1">
                  {evaluation.roleMisalignment.rewritingCanHelp.map((item, i) => (
                    <li key={i} className="text-green-700 text-sm">✓ {item}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {evaluation.roleMisalignment.rewritingCannotFix.length > 0 && (
              <div className="bg-white/60 rounded-lg p-4">
                <h4 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
                  <XCircle className="w-4 h-4" />
                  Rewriting cannot replace:
                </h4>
                <ul className="space-y-1">
                  {evaluation.roleMisalignment.rewritingCannotFix.map((item, i) => (
                    <li key={i} className="text-red-700 text-sm">✗ {item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {evaluation.roleMisalignment.alternativeRoles.length > 0 && (
            <div className="bg-orange-100 rounded-lg p-4 border border-orange-200">
              <h4 className="font-semibold text-orange-900 mb-2">Recommended next steps:</h4>
              <ul className="space-y-1">
                {evaluation.roleMisalignment.alternativeRoles.map((suggestion, i) => (
                  <li key={i} className="text-orange-800 text-sm flex items-start gap-2">
                    <span className="text-orange-500">→</span>
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Final Verdict */}
      <div className={`rounded-xl shadow-sm border-2 p-6 ${
        isReady ? 'bg-green-50 border-green-300' : 'bg-yellow-50 border-yellow-300'
      }`}>
        <div className="flex items-center gap-3 mb-3">
          {isReady ? (
            <CheckCircle className="w-8 h-8 text-green-600" />
          ) : (
            <AlertTriangle className="w-8 h-8 text-yellow-600" />
          )}
          <h3 className={`text-xl font-bold ${isReady ? 'text-green-800' : 'text-yellow-800'}`}>
            {isReady ? '✅ Ready to apply' : '⚠️ Review before submitting'}
          </h3>
        </div>
        
        <p className={`text-lg ${isReady ? 'text-green-700' : 'text-yellow-700'}`}>
          {isReady 
            ? evaluation.verdict.message
            : 'Some required items are missing. Address the ATS and search gaps above to improve eligibility.'}
        </p>
        
        {isReady && (
          <p className="text-sm text-green-600 mt-3 font-medium border-t border-green-200 pt-3">
            You've cleared ATS screening. Further optimization is optional and may not change outcomes.
          </p>
        )}
      </div>
    </div>
  );
}

export default EvaluationReport;
