/**
 * LockedFeature Component
 * 
 * Wraps content that should be locked for free users.
 * Shows a blurred preview with upgrade overlay.
 * 
 * File: client/src/components/subscription/LockedFeature.tsx
 */

import type { ReactNode, ReactElement } from 'react';
import { useFeatureAccess } from '../../contexts/SubscriptionContext';
import type { FeatureType } from '../../contexts/SubscriptionContext';
import { Lock, Sparkles } from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

interface LockedFeatureProps {
  feature: FeatureType;
  title?: string;
  description?: string;
  children: ReactNode;
  showPreview?: boolean;
  ctaText?: string;
  onUpgradeClick?: () => void;
  className?: string;
}

interface LockedFeatureInlineProps {
  feature: FeatureType;
  children: ReactNode;
  lockedText?: string;
}

interface LockedCountProps {
  feature: FeatureType;
  count: number;
  singular?: string;
  plural?: string;
  className?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * LockedFeature - Wraps premium content with lock overlay
 */
export function LockedFeature({
  feature,
  title = 'Premium Feature',
  description = 'Upgrade to Pro to unlock this feature',
  children,
  showPreview = true,
  ctaText = 'Upgrade to Pro',
  onUpgradeClick,
  className = '',
}: LockedFeatureProps): ReactElement {
  const { hasAccess } = useFeatureAccess(feature);

  if (hasAccess) {
    return <>{children}</>;
  }

  return (
    <div className={`relative ${className}`}>
      {showPreview ? (
        <div className="filter blur-sm pointer-events-none select-none" aria-hidden="true">
          {children}
        </div>
      ) : (
        <div className="h-32 bg-gray-100 rounded-lg" />
      )}

      <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] flex items-center justify-center rounded-lg">
        <div className="text-center p-6 max-w-sm">
          <div className="mx-auto w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-6 h-6 text-indigo-600" />
          </div>

          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {title}
          </h3>

          <p className="text-sm text-gray-600 mb-4">
            {description}
          </p>

          {onUpgradeClick ? (
            <button
              onClick={onUpgradeClick}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              {ctaText}
            </button>
          ) : (
            <a
              href="/pricing"
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              {ctaText}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * LockedFeatureInline - Smaller inline version for lists/items
 */
export function LockedFeatureInline({
  feature,
  children,
  lockedText = 'Upgrade to unlock',
}: LockedFeatureInlineProps): ReactElement {
  const { hasAccess } = useFeatureAccess(feature);

  if (hasAccess) {
    return <>{children}</>;
  }

  return (
    <div className="flex items-center gap-2 text-gray-400">
      <Lock className="w-4 h-4" />
      <span className="text-sm italic">{lockedText}</span>
    </div>
  );
}

/**
 * LockedCount - Shows "X more available" with lock
 */
export function LockedCount({
  feature,
  count,
  singular = 'item',
  plural = 'items',
  className = '',
}: LockedCountProps): ReactElement | null {
  const { hasAccess } = useFeatureAccess(feature);

  if (hasAccess || count <= 0) {
    return null;
  }

  const label = count === 1 ? singular : plural;

  return (
    <a
      href="/pricing"
      className={`flex items-center gap-2 p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors ${className}`}
    >
      <Lock className="w-4 h-4 text-gray-400" />
      <span className="text-sm text-gray-600">
        <span className="font-medium">{count} more {label}</span> available with Pro
      </span>
      <Sparkles className="w-4 h-4 text-indigo-500 ml-auto" />
    </a>
  );
}

export default LockedFeature;