/**
 * Role Fit Assessment Component
 * 
 * Displays honest assessment when structural gaps are detected.
 * Shows eligible roles as the ethical upsell when optimization won't help.
 * 
 * Key principles:
 * - Brutally honest, but not cruel
 * - Preserves dignity ("role requires more senior profile" not "you're underqualified")
 * - Pivots to actionable guidance (roles they ARE qualified for)
 * - Natural upsell to Pro for full eligible roles list
 * 
 * File: client/src/components/analyze/RoleFitAssessment.tsx
 */

import type { ReactElement } from 'react';
import { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  TrendingUp,
  Briefcase,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Lock,
  ArrowRight,
  Lightbulb,
  ShieldAlert,
} from 'lucide-react';
import { useFeatureAccess } from '../../contexts/SubscriptionContext';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

type Verdict = 'strong_fit' | 'moderate_fit' | 'stretch_role' | 'role_mismatch';
type Severity = 'critical' | 'significant' | 'moderate';
type GapCategory = 'years_experience' | 'leadership' | 'budget_ownership' | 'scope_level' | 'domain_expertise' | 'technical_depth' | 'credential';

interface StructuralGap {
  category: GapCategory;
  requirement: string;
  current_state: string;
  severity: Severity;
  explanation: string;
}

interface EligibleRolePreview {
  title: string;
  match_reason: string;
  experience_level: string;
}

interface RoleFitData {
  verdict: Verdict;
  verdict_label: string;
  verdict_explanation: string;
  
  structural_gaps: StructuralGap[];
  expressive_gaps: string[];
  structural_gap_count: number;
  expressive_gap_count: number;
  
  show_mismatch_section: boolean;
  mismatch_message: string | null;
  dignity_statement: string | null;
  
  eligible_roles_preview: EligibleRolePreview[];
  eligible_roles_count: number;
  show_eligible_roles_teaser: boolean;
  
  target_role_level: string;
  resume_level: string;
  level_gap: number;
}

interface RoleFitAssessmentProps {
  data: RoleFitData;
  jobTitle: string;
  className?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// VERDICT CONFIGS
// ═══════════════════════════════════════════════════════════════════════════

const VERDICT_CONFIG: Record<Verdict, {
  icon: typeof CheckCircle;
  bgGradient: string;
  borderColor: string;
  iconBg: string;
  iconColor: string;
  textColor: string;
}> = {
  strong_fit: {
    icon: CheckCircle,
    bgGradient: 'from-emerald-50 to-green-50',
    borderColor: 'border-emerald-200',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
    textColor: 'text-emerald-800',
  },
  moderate_fit: {
    icon: TrendingUp,
    bgGradient: 'from-blue-50 to-indigo-50',
    borderColor: 'border-blue-200',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    textColor: 'text-blue-800',
  },
  stretch_role: {
    icon: AlertTriangle,
    bgGradient: 'from-amber-50 to-orange-50',
    borderColor: 'border-amber-200',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    textColor: 'text-amber-800',
  },
  role_mismatch: {
    icon: ShieldAlert,
    bgGradient: 'from-red-50 to-orange-50',
    borderColor: 'border-red-200',
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    textColor: 'text-red-800',
  },
};

const SEVERITY_STYLES: Record<Severity, { bg: string; text: string; border: string }> = {
  critical: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
  significant: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  moderate: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
};

const GAP_CATEGORY_LABELS: Record<GapCategory, string> = {
  years_experience: 'Years of Experience',
  leadership: 'Leadership Experience',
  budget_ownership: 'Budget Ownership',
  scope_level: 'Scope & Seniority',
  domain_expertise: 'Domain Expertise',
  technical_depth: 'Technical Depth',
  credential: 'Credentials',
};

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export function RoleFitAssessment({ data, jobTitle, className = '' }: RoleFitAssessmentProps): ReactElement | null {
  const [showGapDetails, setShowGapDetails] = useState(false);
  const { hasAccess } = useFeatureAccess('fullOptimizationPlan');
  
  // Don't render for strong fits (let the normal flow handle it)
  if (data.verdict === 'strong_fit') {
    return null;
  }

  const config = VERDICT_CONFIG[data.verdict];
  const Icon = config.icon;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Main Assessment Banner */}
      <div className={`bg-gradient-to-r ${config.bgGradient} ${config.borderColor} border rounded-xl overflow-hidden`}>
        {/* Header */}
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className={`p-3 ${config.iconBg} rounded-xl`}>
              <Icon className={`w-6 h-6 ${config.iconColor}`} />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  {data.verdict_label}
                </h3>
                {data.verdict === 'role_mismatch' && (
                  <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                    Action Needed
                  </span>
                )}
              </div>
              
              <p className="text-gray-600">
                {data.verdict_explanation}
              </p>
            </div>
          </div>
        </div>

        {/* Mismatch Details (only for role_mismatch) */}
        {data.show_mismatch_section && data.mismatch_message && (
          <div className="px-6 pb-4">
            <div className="bg-white/60 rounded-lg p-4 border border-red-100">
              <p className="text-gray-700 text-sm mb-3">
                {data.mismatch_message}
              </p>
              
              {data.dignity_statement && (
                <div className="flex items-start gap-2 mt-3 pt-3 border-t border-red-100">
                  <Lightbulb className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-600 italic">
                    {data.dignity_statement}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Gap Toggle */}
        {data.structural_gaps.length > 0 && (
          <div className="border-t border-gray-200/50">
            <button
              onClick={() => setShowGapDetails(!showGapDetails)}
              className="w-full px-6 py-3 flex items-center justify-between text-sm font-medium text-gray-700 hover:bg-white/30 transition-colors"
            >
              <span>
                {data.structural_gap_count} structural gap{data.structural_gap_count !== 1 ? 's' : ''} detected
                {data.expressive_gap_count > 0 && ` • ${data.expressive_gap_count} fixable with rewording`}
              </span>
              {showGapDetails ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </button>
          </div>
        )}
      </div>

      {/* Expandable Gap Details */}
      {showGapDetails && data.structural_gaps.length > 0 && (
        <StructuralGapList gaps={data.structural_gaps} />
      )}

      {/* Eligible Roles Section (The Upsell) */}
      {data.show_eligible_roles_teaser && (
        <EligibleRolesTeaser
          roles={data.eligible_roles_preview}
          totalCount={data.eligible_roles_count}
          resumeLevel={data.resume_level}
          targetRole={jobTitle}
          hasFullAccess={hasAccess}
        />
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// STRUCTURAL GAPS LIST
// ═══════════════════════════════════════════════════════════════════════════

interface StructuralGapListProps {
  gaps: StructuralGap[];
}

function StructuralGapList({ gaps }: StructuralGapListProps): ReactElement {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <XCircle className="w-5 h-5 text-red-500" />
        Gaps That Cannot Be Fixed With Rewording
      </h4>
      
      <div className="space-y-3">
        {gaps.map((gap, index) => {
          const severityStyle = SEVERITY_STYLES[gap.severity];
          
          return (
            <div
              key={index}
              className={`p-4 rounded-lg border ${severityStyle.bg} ${severityStyle.border}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-900">
                      {GAP_CATEGORY_LABELS[gap.category] || gap.category}
                    </span>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${severityStyle.bg} ${severityStyle.text}`}>
                      {gap.severity}
                    </span>
                  </div>
                  
                  <div className="grid sm:grid-cols-2 gap-2 text-sm mt-2">
                    <div>
                      <span className="text-gray-500">Required: </span>
                      <span className="text-gray-900">{gap.requirement}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Your resume: </span>
                      <span className="text-gray-900">{gap.current_state}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mt-2">
                {gap.explanation}
              </p>
            </div>
          );
        })}
      </div>
      
      <p className="text-xs text-gray-500 mt-4 flex items-center gap-1">
        <Lightbulb className="w-4 h-4" />
        These gaps require actual experience to address, not resume optimization.
      </p>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ELIGIBLE ROLES TEASER (THE UPSELL)
// ═══════════════════════════════════════════════════════════════════════════

interface EligibleRolesTeaserProps {
  roles: EligibleRolePreview[];
  totalCount: number;
  resumeLevel: string;
  targetRole: string;
  hasFullAccess: boolean;
}

function EligibleRolesTeaser({
  roles,
  totalCount,
  resumeLevel,
  targetRole,
  hasFullAccess,
}: EligibleRolesTeaserProps): ReactElement {
  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl text-white">
            <Briefcase className="w-6 h-6" />
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Roles You're Well-Positioned For
            </h3>
            <p className="text-gray-600 text-sm mt-1">
              Based on your {resumeLevel}-level experience, these roles match your current qualifications.
            </p>
          </div>
        </div>
      </div>

      {/* Role Preview */}
      <div className="px-6 pb-4">
        <div className="space-y-3">
          {roles.slice(0, hasFullAccess ? roles.length : 2).map((role, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-4 border border-indigo-100"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">{role.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{role.match_reason}</p>
                </div>
                <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full capitalize">
                  {role.experience_level}
                </span>
              </div>
            </div>
          ))}
          
          {/* Locked roles preview */}
          {!hasFullAccess && roles.length > 2 && (
            <div className="relative">
              <div className="bg-white/50 rounded-lg p-4 border border-indigo-100 filter blur-[2px]">
                <div className="h-12 bg-gray-100 rounded animate-pulse" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Lock className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Upsell CTA */}
      {!hasFullAccess && totalCount > 2 && (
        <div className="px-6 pb-6">
          <a
            href="/pricing"
            className="flex items-center justify-between w-full p-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            <div>
              <p className="font-medium">
                See all {totalCount} eligible roles
              </p>
              <p className="text-sm text-indigo-100">
                Plus skills matched and career growth paths
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              <ArrowRight className="w-5 h-5" />
            </div>
          </a>
          
          <p className="text-xs text-center text-gray-500 mt-3">
            Unlock with Pro • Includes recommended search terms
          </p>
        </div>
      )}

      {/* Full access - show growth path */}
      {hasFullAccess && (
        <div className="px-6 pb-6">
          <div className="bg-white rounded-lg p-4 border border-indigo-100">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <TrendingUp className="w-5 h-5 text-indigo-500" />
              <span>
                <strong className="text-gray-900">Career Path:</strong> These roles position you for 
                progression toward {targetRole} in 1-2 years.
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPACT BADGE VERSION (for results header)
// ═══════════════════════════════════════════════════════════════════════════

interface RoleFitBadgeProps {
  verdict: Verdict;
  onClick?: () => void;
}

export function RoleFitBadge({ verdict, onClick }: RoleFitBadgeProps): ReactElement {
  const config = VERDICT_CONFIG[verdict];
  const Icon = config.icon;
  
  const labels: Record<Verdict, string> = {
    strong_fit: 'Strong Fit',
    moderate_fit: 'Moderate Fit',
    stretch_role: 'Stretch Role',
    role_mismatch: 'Role Mismatch',
  };
  
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1 ${config.iconBg} ${config.textColor} text-sm font-medium rounded-full hover:opacity-80 transition-opacity`}
    >
      <Icon className="w-4 h-4" />
      {labels[verdict]}
    </button>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export default RoleFitAssessment;