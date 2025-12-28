/**
 * UpgradeCard Component
 * 
 * Promotional cards that highlight premium features.
 * Used throughout the app to drive upgrades.
 * 
 * File: client/src/components/subscription/UpgradeCard.tsx
 */

import type { ReactElement } from 'react';
import {
  Sparkles,
  FileText,
  MessageSquare,
  FileUp,
  ArrowRight,
  Check,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

type FeatureCardKey = 'resumeRewriter' | 'interviewPrep' | 'coverLetter' | 'fullReport' | 'custom';

interface FeatureCardConfig {
  icon: LucideIcon;
  title: string;
  headline: string;
  description: string;
  benefits: string[];
  ctaText: string;
  gradient: string;
  bgGradient: string;
}

interface UpgradeCardProps {
  feature?: FeatureCardKey;
  variant?: 'default' | 'compact' | 'banner';
  custom?: Partial<FeatureCardConfig>;
  onCtaClick?: () => void;
  className?: string;
}

interface CompactCardProps {
  config: FeatureCardConfig;
  onCtaClick?: () => void;
  className?: string;
}

interface BannerCardProps {
  config: FeatureCardConfig;
  onCtaClick?: () => void;
  className?: string;
}

interface UpgradeCardGridProps {
  features?: FeatureCardKey[];
  className?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// FEATURE CONFIGS
// ═══════════════════════════════════════════════════════════════════════════

const FEATURE_CARDS: Record<Exclude<FeatureCardKey, 'custom'>, FeatureCardConfig> = {
  resumeRewriter: {
    icon: FileUp,
    title: 'AI Resume Rewriter',
    headline: 'Fix This Automatically',
    description: 'Our AI rewrites your resume to naturally include missing keywords while preserving your authentic voice.',
    benefits: [
      'Adds missing skills contextually',
      'Preserves your achievements',
      'Download as DOCX or PDF',
    ],
    ctaText: 'Rewrite My Resume',
    gradient: 'from-purple-500 to-indigo-600',
    bgGradient: 'from-purple-50 to-indigo-50',
  },
  interviewPrep: {
    icon: MessageSquare,
    title: 'Interview Preparation',
    headline: 'Prepare for Your Interview',
    description: 'Get likely interview questions based on this specific job and your resume gaps.',
    benefits: [
      '15+ tailored questions',
      'Answer tips for each',
      'Gap-based questions included',
    ],
    ctaText: 'Get Interview Questions',
    gradient: 'from-emerald-500 to-teal-600',
    bgGradient: 'from-emerald-50 to-teal-50',
  },
  coverLetter: {
    icon: FileText,
    title: 'Cover Letter Generator',
    headline: 'Generate a Tailored Cover Letter',
    description: 'Create a professional cover letter that highlights your matching skills and addresses gaps proactively.',
    benefits: [
      'Tailored to this exact job',
      'Multiple tone options',
      'Ready to send',
    ],
    ctaText: 'Generate Cover Letter',
    gradient: 'from-blue-500 to-cyan-600',
    bgGradient: 'from-blue-50 to-cyan-50',
  },
  fullReport: {
    icon: Sparkles,
    title: 'Full Analysis Report',
    headline: 'Unlock Complete Analysis',
    description: 'Get the full optimization plan with all suggestions and detailed breakdowns.',
    benefits: [
      'All optimization suggestions',
      'Full quality breakdown',
      'PDF export',
    ],
    ctaText: 'Unlock Full Report',
    gradient: 'from-indigo-500 to-purple-600',
    bgGradient: 'from-indigo-50 to-purple-50',
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * UpgradeCard - Feature promotion card
 */
export function UpgradeCard({
  feature = 'fullReport',
  variant = 'default',
  custom = {},
  onCtaClick,
  className = '',
}: UpgradeCardProps): ReactElement {
  const config: FeatureCardConfig = feature === 'custom' 
    ? { ...FEATURE_CARDS.fullReport, ...custom } as FeatureCardConfig
    : FEATURE_CARDS[feature] || FEATURE_CARDS.fullReport;

  const Icon = config.icon;

  if (variant === 'compact') {
    return <CompactCard config={config} onCtaClick={onCtaClick} className={className} />;
  }

  if (variant === 'banner') {
    return <BannerCard config={config} onCtaClick={onCtaClick} className={className} />;
  }

  return (
    <div className={`bg-gradient-to-br ${config.bgGradient} border border-gray-200 rounded-xl p-6 ${className}`}>
      <div className="flex items-start gap-4 mb-4">
        <div className={`p-3 bg-gradient-to-br ${config.gradient} rounded-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            {config.title}
          </p>
          <h3 className="text-lg font-semibold text-gray-900">
            {config.headline}
          </h3>
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-4">
        {config.description}
      </p>

      <ul className="space-y-2 mb-5">
        {config.benefits.map((benefit, index) => (
          <li key={index} className="flex items-center gap-2 text-sm text-gray-700">
            <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
            {benefit}
          </li>
        ))}
      </ul>

      {onCtaClick ? (
        <button
          onClick={onCtaClick}
          className={`w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r ${config.gradient} text-white font-medium rounded-lg hover:opacity-90 transition-opacity`}
        >
          {config.ctaText}
          <ArrowRight className="w-4 h-4" />
        </button>
      ) : (
        <a
          href="/pricing"
          className={`w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r ${config.gradient} text-white font-medium rounded-lg hover:opacity-90 transition-opacity`}
        >
          {config.ctaText}
          <ArrowRight className="w-4 h-4" />
        </a>
      )}

      <p className="text-xs text-center text-gray-500 mt-3">
        <Sparkles className="w-3 h-3 inline mr-1" />
        Available with Pro
      </p>
    </div>
  );
}

/**
 * Compact variant - smaller card for sidebars
 */
function CompactCard({ config, onCtaClick, className = '' }: CompactCardProps): ReactElement {
  const Icon = config.icon;

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-center gap-3 mb-3">
        <div className={`p-2 bg-gradient-to-br ${config.gradient} rounded-lg`}>
          <Icon className="w-4 h-4 text-white" />
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-900">{config.headline}</h4>
          <p className="text-xs text-gray-500">{config.title}</p>
        </div>
      </div>

      {onCtaClick ? (
        <button
          onClick={onCtaClick}
          className="w-full text-center text-sm font-medium text-indigo-600 hover:text-indigo-700"
        >
          {config.ctaText} →
        </button>
      ) : (
        <a
          href="/pricing"
          className="block w-full text-center text-sm font-medium text-indigo-600 hover:text-indigo-700"
        >
          {config.ctaText} →
        </a>
      )}
    </div>
  );
}

/**
 * Banner variant - horizontal banner
 */
function BannerCard({ config, onCtaClick, className = '' }: BannerCardProps): ReactElement {
  const Icon = config.icon;

  return (
    <div className={`bg-gradient-to-r ${config.bgGradient} border border-gray-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 bg-gradient-to-br ${config.gradient} rounded-lg`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-900">{config.headline}</h4>
            <p className="text-xs text-gray-600">{config.description.slice(0, 60)}...</p>
          </div>
        </div>

        {onCtaClick ? (
          <button
            onClick={onCtaClick}
            className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${config.gradient} text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity`}
          >
            {config.ctaText}
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <a
            href="/pricing"
            className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${config.gradient} text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity`}
          >
            {config.ctaText}
            <ArrowRight className="w-4 h-4" />
          </a>
        )}
      </div>
    </div>
  );
}

/**
 * UpgradeCardGrid - Display multiple feature cards in a grid
 */
export function UpgradeCardGrid({ 
  features = ['resumeRewriter', 'interviewPrep', 'coverLetter'], 
  className = '' 
}: UpgradeCardGridProps): ReactElement {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}>
      {features.map((feature) => (
        <UpgradeCard key={feature} feature={feature} />
      ))}
    </div>
  );
}

export default UpgradeCard;