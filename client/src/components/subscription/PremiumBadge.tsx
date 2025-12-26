/**
 * Premium Badge & Usage Indicator Components
 * 
 * Small UI elements for showing subscription status.
 * 
 * File: client/src/components/subscription/PremiumBadge.tsx
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { SparklesIcon, BoltIcon } from '@heroicons/react/24/solid';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

interface BaseComponentProps {
  className?: string;
}

interface UsageIndicatorProps extends BaseComponentProps {
  showWhenFull?: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * PremiumBadge - Small badge showing Pro/Premium status
 */
export function PremiumBadge({ className = '' }: BaseComponentProps): JSX.Element | null {
  const { tierInfo, isPaid } = useSubscription();

  if (!isPaid()) return null;

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-medium rounded-full ${className}`}>
      <SparklesIcon className="w-3 h-3" />
      {tierInfo.name}
    </span>
  );
}

/**
 * UpgradeBadge - Badge that links to pricing (for free users)
 */
export function UpgradeBadge({ className = '' }: BaseComponentProps): JSX.Element | null {
  const { isPaid } = useSubscription();

  if (isPaid()) return null;

  return (
    <Link
      to="/pricing"
      className={`inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 hover:bg-indigo-100 text-gray-600 hover:text-indigo-600 text-xs font-medium rounded-full transition-colors ${className}`}
    >
      <SparklesIcon className="w-3 h-3" />
      Upgrade
    </Link>
  );
}

/**
 * UsageIndicator - Shows remaining analyses
 */
export function UsageIndicator({ 
  showWhenFull = false, 
  className = '' 
}: UsageIndicatorProps): JSX.Element | null {
  const { usage, isPaid } = useSubscription();

  const remaining = usage.analysesLimit - usage.analysesUsed;
  const percentage = (usage.analysesUsed / usage.analysesLimit) * 100;

  if (!showWhenFull && remaining > 10) return null;

  let colorClass = 'text-green-600 bg-green-100';
  let barColor = 'bg-green-500';
  
  if (remaining <= 2) {
    colorClass = 'text-red-600 bg-red-100';
    barColor = 'bg-red-500';
  } else if (remaining <= 5) {
    colorClass = 'text-amber-600 bg-amber-100';
    barColor = 'bg-amber-500';
  }

  return (
    <div className={className}>
      <div className="flex items-center justify-between text-xs mb-1">
        <span className="text-gray-600">
          <BoltIcon className="w-3 h-3 inline mr-1" />
          Analyses
        </span>
        <span className={`font-medium px-1.5 py-0.5 rounded ${colorClass}`}>
          {remaining} left
        </span>
      </div>
      
      <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${barColor} transition-all duration-300`}
          style={{ width: `${Math.min(100, percentage)}%` }}
        />
      </div>

      {!isPaid() && remaining <= 5 && (
        <Link
          to="/pricing"
          className="text-xs text-indigo-600 hover:text-indigo-700 mt-1 block"
        >
          Get more →
        </Link>
      )}
    </div>
  );
}

/**
 * UsageBadge - Compact badge showing usage
 */
export function UsageBadge({ className = '' }: BaseComponentProps): JSX.Element {
  const { usage } = useSubscription();
  const remaining = usage.analysesLimit - usage.analysesUsed;

  let colorClass = 'bg-green-100 text-green-700';
  if (remaining <= 2) {
    colorClass = 'bg-red-100 text-red-700';
  } else if (remaining <= 5) {
    colorClass = 'bg-amber-100 text-amber-700';
  }

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full ${colorClass} ${className}`}>
      <BoltIcon className="w-3 h-3" />
      {remaining} analyses left
    </span>
  );
}

/**
 * SubscriptionStatus - Full status display for settings/profile
 */
export function SubscriptionStatus({ className = '' }: BaseComponentProps): JSX.Element {
  const { tierInfo, usage, subscription, isPaid } = useSubscription();

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-medium text-gray-900">Your Plan</h3>
          <p className="text-sm text-gray-500">
            {isPaid() ? 'Thank you for being a Pro member!' : 'Free plan'}
          </p>
        </div>
        
        {isPaid() ? (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-medium rounded-full">
            <SparklesIcon className="w-4 h-4" />
            {tierInfo.name}
          </span>
        ) : (
          <Link
            to="/pricing"
            className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <SparklesIcon className="w-4 h-4" />
            Upgrade
          </Link>
        )}
      </div>

      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Analyses this month</span>
            <span className="font-medium">
              {usage.analysesUsed} / {usage.analysesLimit}
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 transition-all duration-300"
              style={{ width: `${(usage.analysesUsed / usage.analysesLimit) * 100}%` }}
            />
          </div>
        </div>

        {isPaid() && subscription?.current_period_end && (
          <p className="text-xs text-gray-500">
            Renews {new Date(subscription.current_period_end * 1000).toLocaleDateString()}
          </p>
        )}
      </div>

      {isPaid() && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <Link
            to="/settings/billing"
            className="text-sm text-indigo-600 hover:text-indigo-700"
          >
            Manage subscription →
          </Link>
        </div>
      )}
    </div>
  );
}

export default PremiumBadge;