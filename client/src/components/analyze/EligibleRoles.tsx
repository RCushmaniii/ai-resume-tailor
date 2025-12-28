/**
 * Eligible Roles Component (Pro Feature)
 * 
 * Full display of roles the candidate is qualified for.
 * Only shown to Pro users - the ethical upsell from role mismatch detection.
 * 
 * Features:
 * - Complete list of matching roles
 * - Skills matched per role
 * - Growth path to target role
 * - Recommended job search terms
 * - Career level assessment
 * 
 * File: client/src/components/analyze/EligibleRoles.tsx
 */

import type { ReactElement } from 'react';
import { useState, Fragment } from 'react';
import {
  Briefcase,
  TrendingUp,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Search,
  Clipboard,
  Sparkles,
  GraduationCap,
  Check,
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

interface EligibleRole {
  title: string;
  match_reason: string;
  experience_level: string;
  skills_matched: string[];
  growth_path: string | null;
}

interface CareerLevelAssessment {
  current_level: string;
  target_level: string;
  gap: number;
  recommendation: string;
}

interface EligibleRolesData {
  eligible_roles: EligibleRole[];
  recommended_search_terms: string[];
  career_level_assessment: CareerLevelAssessment;
}

interface EligibleRolesProps {
  data: EligibleRolesData;
  targetJobTitle: string;
  className?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// LEVEL VISUALIZATION
// ═══════════════════════════════════════════════════════════════════════════

const LEVEL_ORDER = ['entry', 'mid', 'senior', 'director', 'executive'];

const LEVEL_LABELS: Record<string, string> = {
  entry: 'Entry Level',
  mid: 'Mid Level',
  senior: 'Senior Level',
  director: 'Director Level',
  executive: 'Executive Level',
};

const LEVEL_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  entry: { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-300' },
  mid: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300' },
  senior: { bg: 'bg-indigo-100', text: 'text-indigo-700', border: 'border-indigo-300' },
  director: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-300' },
  executive: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-300' },
};

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export function EligibleRoles({ data, targetJobTitle, className = '' }: EligibleRolesProps): ReactElement {
  const [expandedRole, setExpandedRole] = useState<number | null>(0);
  const [copiedTerms, setCopiedTerms] = useState(false);

  const { eligible_roles, recommended_search_terms, career_level_assessment } = data;

  const copySearchTerms = async () => {
    await navigator.clipboard.writeText(recommended_search_terms.join('\n'));
    setCopiedTerms(true);
    setTimeout(() => setCopiedTerms(false), 2000);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg text-white">
          <Briefcase className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Roles You're Qualified For</h2>
          <p className="text-sm text-gray-600">
            Based on your current experience and skills
          </p>
        </div>
        <span className="ml-auto px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          Pro Feature
        </span>
      </div>

      {/* Career Level Assessment */}
      <CareerLevelVisual assessment={career_level_assessment} targetRole={targetJobTitle} />

      {/* Roles List */}
      <div className="space-y-3">
        {eligible_roles.map((role, index) => (
          <RoleCard
            key={index}
            role={role}
            isExpanded={expandedRole === index}
            onToggle={() => setExpandedRole(expandedRole === index ? null : index)}
            index={index}
          />
        ))}
      </div>

      {/* Recommended Search Terms */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-slate-600" />
            <h3 className="font-semibold text-gray-900">Recommended Job Search Terms</h3>
          </div>
          <button
            onClick={copySearchTerms}
            className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700"
          >
            <Clipboard className="w-4 h-4" />
            {copiedTerms ? 'Copied!' : 'Copy All'}
          </button>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {recommended_search_terms.map((term, index) => (
            <span
              key={index}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm text-gray-700 hover:border-indigo-300 cursor-pointer transition-colors"
              onClick={() => navigator.clipboard.writeText(term)}
            >
              {term}
            </span>
          ))}
        </div>
        
        <p className="text-xs text-gray-500 mt-3">
          Use these terms on LinkedIn, Indeed, and other job boards to find matching opportunities.
        </p>
      </div>

      {/* Growth Path */}
      <GrowthPathCard 
        currentLevel={career_level_assessment.current_level}
        targetRole={targetJobTitle}
        roles={eligible_roles}
      />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// CAREER LEVEL VISUALIZATION
// ═══════════════════════════════════════════════════════════════════════════

interface CareerLevelVisualProps {
  assessment: CareerLevelAssessment;
  targetRole: string;
}

function CareerLevelVisual({ assessment }: CareerLevelVisualProps): ReactElement {
  const currentIdx = LEVEL_ORDER.indexOf(assessment.current_level);
  const targetIdx = LEVEL_ORDER.indexOf(assessment.target_level);

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <GraduationCap className="w-5 h-5 text-indigo-600" />
        Career Level Assessment
      </h3>
      
      {/* Level Visualization */}
      <div className="flex items-center justify-between mb-6">
        {LEVEL_ORDER.map((level, index) => {
          const isCurrent = level === assessment.current_level;
          const isTarget = level === assessment.target_level;
          const isPast = index < currentIdx;
          const isBetween = index > currentIdx && index < targetIdx;
          
          return (
            <Fragment key={level}>
              {/* Level Dot */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                    isCurrent
                      ? 'bg-indigo-600 border-indigo-600 text-white'
                      : isTarget
                      ? 'bg-amber-500 border-amber-500 text-white'
                      : isPast
                      ? 'bg-gray-200 border-gray-300 text-gray-500'
                      : 'bg-white border-gray-200 text-gray-400'
                  }`}
                >
                  {isCurrent ? (
                    <Check className="w-5 h-5" />
                  ) : isTarget ? (
                    <TrendingUp className="w-5 h-5" />
                  ) : (
                    <span className="text-xs font-medium">{index + 1}</span>
                  )}
                </div>
                <span className={`text-xs mt-1 ${
                  isCurrent || isTarget ? 'font-medium text-gray-900' : 'text-gray-500'
                }`}>
                  {LEVEL_LABELS[level]?.split(' ')[0]}
                </span>
                {isCurrent && (
                  <span className="text-xs text-indigo-600 font-medium">You</span>
                )}
                {isTarget && (
                  <span className="text-xs text-amber-600 font-medium">Target</span>
                )}
              </div>
              
              {/* Connector Line */}
              {index < LEVEL_ORDER.length - 1 && (
                <div className={`flex-1 h-1 mx-1 rounded ${
                  index < currentIdx
                    ? 'bg-gray-300'
                    : isBetween
                    ? 'bg-gradient-to-r from-indigo-400 to-amber-400'
                    : 'bg-gray-200'
                }`} />
              )}
            </Fragment>
          );
        })}
      </div>
      
      {/* Recommendation */}
      <div className="p-4 bg-indigo-50 rounded-lg">
        <p className="text-sm text-indigo-800">
          <strong>Recommendation:</strong> {assessment.recommendation}
        </p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ROLE CARD
// ═══════════════════════════════════════════════════════════════════════════

interface RoleCardProps {
  role: EligibleRole;
  isExpanded: boolean;
  onToggle: () => void;
  index: number;
}

function RoleCard({ role, isExpanded, onToggle, index }: RoleCardProps): ReactElement {
  const levelColor = LEVEL_COLORS[role.experience_level] || LEVEL_COLORS.mid;

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-indigo-300 transition-colors">
      {/* Header - Always Visible */}
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-700 font-semibold text-sm">
            {index + 1}
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900">{role.title}</h4>
            <p className="text-sm text-gray-600">{role.match_reason}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <span className={`px-2 py-1 ${levelColor.bg} ${levelColor.text} text-xs font-medium rounded-full capitalize`}>
            {role.experience_level}
          </span>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </button>
      
      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-gray-100">
          <div className="pt-4 space-y-4">
            {/* Skills Matched */}
            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-2">Skills You Already Have:</h5>
              <div className="flex flex-wrap gap-2">
                {role.skills_matched.map((skill, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full"
                  >
                    <Check className="w-3 h-3" />
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Growth Path */}
            {role.growth_path && (
              <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-lg">
                <TrendingUp className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-sm font-medium text-amber-900">Growth Path</h5>
                  <p className="text-sm text-amber-700">{role.growth_path}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// GROWTH PATH CARD
// ═══════════════════════════════════════════════════════════════════════════

interface GrowthPathCardProps {
  currentLevel: string;
  targetRole: string;
  roles: EligibleRole[];
}

function GrowthPathCard({ currentLevel, targetRole, roles }: GrowthPathCardProps): ReactElement {
  // Find roles at next level
  const currentIdx = LEVEL_ORDER.indexOf(currentLevel);
  const nextLevel = LEVEL_ORDER[currentIdx + 1];
  const steppingStones = roles.filter(r => r.experience_level === nextLevel);

  if (steppingStones.length === 0) return <></>;

  return (
    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-5">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-amber-100 rounded-lg">
          <TrendingUp className="w-5 h-5 text-amber-600" />
        </div>
        
        <div>
          <h3 className="font-semibold text-gray-900">Your Path to {targetRole}</h3>
          <p className="text-sm text-gray-600 mt-1 mb-4">
            Consider these stepping-stone roles to build toward your target:
          </p>
          
          <div className="space-y-2">
            {steppingStones.slice(0, 3).map((role, index) => (
              <div
                key={index}
                className="flex items-center gap-2 p-2 bg-white rounded-lg border border-amber-100"
              >
                <CheckCircle className="w-5 h-5 text-amber-500" />
                <span className="text-sm font-medium text-gray-900">{role.title}</span>
                <span className="text-xs text-gray-500 ml-auto">
                  → {targetRole}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export default EligibleRoles;