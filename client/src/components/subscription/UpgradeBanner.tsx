/**
 * UpgradeBanner Component
 * 
 * Banners for various upgrade prompts:
 * - Credit exhaustion
 * - Low credits warning
 * - Feature upsells
 * - Success messages after upgrade
 * 
 * File: client/src/components/subscription/UpgradeBanner.tsx
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { useSubscription } from '../../contexts/SubscriptionContext';
import {
  ExclamationTriangleIcon,
  SparklesIcon,
  CheckCircleIcon,
  XMarkIcon,
  ArrowRightIcon,
  BoltIcon,
} from '@heroicons/react/24/outline';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

interface BannerBaseProps {
  onDismiss?: () => void;
  className?: string;
}

interface LowCreditsBannerProps extends BannerBaseProps {
  remaining: number;
}

interface UpgradeSuccessBannerProps extends BannerBaseProps {
  planName?: string;
}

interface ContextualUpgradeBannerProps {
  score: number;
  className?: string;
}

interface AutoUpgradeBannerProps {
  score?: number;
  className?: string;
}

interface BannerConfig {
  headline: string;
  message: string;
  cta: string;
  gradient: string;
  border: string;
  iconBg: string;
  iconColor: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * CreditExhaustedBanner - Shows when user has no credits left
 */
export function CreditExhaustedBanner({ 
  onDismiss, 
  className = '' 
}: BannerBaseProps): JSX.Element {
  const { tier, TIERS } = useSubscription();
  const isGuest = tier === TIERS.GUEST;

  return (
    <div className={`bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-start gap-3">
        <div className="p-2 bg-amber-100 rounded-full">
          <ExclamationTriangleIcon className="w-5 h-5 text-amber-600" />
        </div>
        
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">
            {isGuest ? "You've used all free analyses" : "You've reached your analysis limit"}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {isGuest 
              ? "Create a free account to get 2 more analyses, or upgrade to Pro for 50/month."
              : "Upgrade to Pro to get 50 analyses per month and unlock all premium features."
            }
          </p>
          
          <div className="flex items-center gap-3 mt-3">
            {isGuest && (
              <Link
                to="/signup"
                className="text-sm font-medium text-amber-700 hover:text-amber-800"
              >
                Create Free Account
              </Link>
            )}
            <Link
              to="/pricing"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
            >
              <SparklesIcon className="w-4 h-4" />
              Upgrade to Pro
            </Link>
          </div>
        </div>

        {onDismiss && (
          <button
            onClick={onDismiss}
            className="p-1 text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * LowCreditsBanner - Warning when credits are running low
 */
export function LowCreditsBanner({ 
  remaining, 
  onDismiss, 
  className = '' 
}: LowCreditsBannerProps): JSX.Element | null {
  if (remaining > 2) return null;

  return (
    <div className={`bg-blue-50 border border-blue-200 rounded-lg p-3 ${className}`}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <BoltIcon className="w-5 h-5 text-blue-600" />
          <p className="text-sm text-blue-800">
            <span className="font-medium">{remaining} {remaining === 1 ? 'analysis' : 'analyses'}</span> remaining
          </p>
        </div>
        
        <Link
          to="/pricing"
          className="text-sm font-medium text-blue-700 hover:text-blue-800 flex items-center gap-1"
        >
          Get more <ArrowRightIcon className="w-3 h-3" />
        </Link>

        {onDismiss && (
          <button onClick={onDismiss} className="p-1 text-blue-400 hover:text-blue-600">
            <XMarkIcon className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * UpgradeSuccessBanner - Shows after successful upgrade
 */
export function UpgradeSuccessBanner({ 
  planName = 'Pro', 
  onDismiss, 
  className = '' 
}: UpgradeSuccessBannerProps): JSX.Element {
  return (
    <div className={`bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-start gap-3">
        <div className="p-2 bg-green-100 rounded-full">
          <CheckCircleIcon className="w-5 h-5 text-green-600" />
        </div>
        
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">
            Welcome to {planName}! 🎉
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Your toolkit is now unlocked. You have 50 analyses this month and access to all premium features.
          </p>
        </div>

        {onDismiss && (
          <button
            onClick={onDismiss}
            className="p-1 text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * ProBadgeBanner - Subtle banner showing Pro benefits
 */
export function ProBadgeBanner({ className = '' }: { className?: string }): JSX.Element | null {
  const { isPaid } = useSubscription();

  if (isPaid()) return null;

  return (
    <div className={`bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-4 text-white ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <SparklesIcon className="w-6 h-6" />
          <div>
            <p className="font-medium">Unlock Pro Features</p>
            <p className="text-sm text-indigo-100">
              Resume Rewriter • Interview Prep • Cover Letters • 50 analyses/mo
            </p>
          </div>
        </div>
        
        <Link
          to="/pricing"
          className="flex-shrink-0 px-4 py-2 bg-white text-indigo-600 text-sm font-medium rounded-lg hover:bg-indigo-50 transition-colors"
        >
          Upgrade Now
        </Link>
      </div>
    </div>
  );
}

/**
 * ContextualUpgradeBanner - Shows different message based on score
 */
export function ContextualUpgradeBanner({ 
  score, 
  className = '' 
}: ContextualUpgradeBannerProps): JSX.Element | null {
  const { isPaid } = useSubscription();

  if (isPaid()) return null;

  let config: BannerConfig;
  
  if (score >= 85) {
    config = {
      headline: "You're a Strong Match!",
      message: "Stand out from other qualified candidates with a tailored cover letter and interview prep.",
      cta: "Finish Strong with Pro",
      gradient: "from-green-50 to-emerald-50",
      border: "border-green-200",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    };
  } else if (score >= 70) {
    config = {
      headline: "Good Match - Room to Improve",
      message: "Our AI Resume Rewriter can add missing keywords naturally to boost your score.",
      cta: "Improve My Resume",
      gradient: "from-blue-50 to-indigo-50",
      border: "border-blue-200",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    };
  } else if (score >= 55) {
    config = {
      headline: "Borderline Match",
      message: "You might get filtered by ATS. Let our AI rewrite your resume to improve your chances.",
      cta: "Fix My Resume Now",
      gradient: "from-amber-50 to-orange-50",
      border: "border-amber-200",
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
    };
  } else {
    config = {
      headline: "Let's Improve Your Match",
      message: "Our AI can help you bridge the gap by rewriting your resume with the right keywords.",
      cta: "Rewrite My Resume",
      gradient: "from-red-50 to-orange-50",
      border: "border-red-200",
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
    };
  }

  return (
    <div className={`bg-gradient-to-r ${config.gradient} ${config.border} border rounded-lg p-4 ${className}`}>
      <div className="flex items-start gap-3">
        <div className={`p-2 ${config.iconBg} rounded-full`}>
          <SparklesIcon className={`w-5 h-5 ${config.iconColor}`} />
        </div>
        
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{config.headline}</h3>
          <p className="text-sm text-gray-600 mt-1">{config.message}</p>
          
          <Link
            to="/pricing"
            className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
          >
            <SparklesIcon className="w-4 h-4" />
            {config.cta}
          </Link>
        </div>
      </div>
    </div>
  );
}

/**
 * AutoUpgradeBanner - Automatically shows appropriate banner based on state
 */
export function AutoUpgradeBanner({ 
  score, 
  className = '' 
}: AutoUpgradeBannerProps): JSX.Element | null {
  const { hasAnalysesRemaining, getAnalysesRemaining, isPaid } = useSubscription();
  
  if (isPaid()) return null;

  const remaining = getAnalysesRemaining();

  if (!hasAnalysesRemaining()) {
    return <CreditExhaustedBanner className={className} />;
  }

  if (remaining <= 2) {
    return <LowCreditsBanner remaining={remaining} className={className} />;
  }

  if (score !== undefined) {
    return <ContextualUpgradeBanner score={score} className={className} />;
  }

  return <ProBadgeBanner className={className} />;
}

export default AutoUpgradeBanner;