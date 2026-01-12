/**
 * FeatureGate Component
 * 
 * Conditional rendering wrapper that shows content based on user's tier.
 * Can show fallback content for users without access.
 * 
 * File: client/src/components/subscription/FeatureGate.tsx
 */

import type { ReactNode, ReactElement } from 'react';
import { 
  useFeatureAccess, 
  useSubscription, 
} from '../../contexts/SubscriptionContext';
import type { FeatureType, TierType } from '../../contexts/SubscriptionContext';
import { LockedFeature } from './LockedFeature';
import { UpgradeCard } from './UpgradeCard';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

type GateBehavior = 'hide' | 'lock' | 'card' | 'custom';

interface FeatureGateProps {
  feature: FeatureType;
  children: ReactNode;
  fallback?: ReactNode;
  behavior?: GateBehavior;
  lockProps?: {
    title?: string;
    description?: string;
    showPreview?: boolean;
    ctaText?: string;
  };
  cardFeature?: FeatureType;
}

interface TierGateProps {
  tiers: TierType[];
  children: ReactNode;
  fallback?: ReactNode;
}

interface AnalysisGateProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface PreviewGateProps<T> {
  items: T[];
  previewCount?: number;
  renderItem: (item: T, index: number) => ReactNode;
  renderLocked?: (lockedCount: number) => ReactNode;
  feature?: FeatureType;
}

interface SimpleGateProps {
  children: ReactNode;
  fallback?: ReactNode;
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * FeatureGate - Conditionally render content based on feature access
 */
export function FeatureGate({
  feature,
  children,
  fallback = null,
  behavior = 'hide',
  lockProps = {},
  cardFeature,
}: FeatureGateProps): ReactElement | null {
  const { hasAccess } = useFeatureAccess(feature);

  if (hasAccess) {
    return <>{children}</>;
  }

  switch (behavior) {
    case 'hide':
      return fallback ? <>{fallback}</> : null;

    case 'lock':
      return (
        <LockedFeature feature={feature} {...lockProps}>
          {children}
        </LockedFeature>
      );

    case 'card':
      // Type assertion needed: FeatureGate uses FeatureType, UpgradeCard uses FeatureCardKey
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return <UpgradeCard feature={(cardFeature || feature) as any} />;

    case 'custom':
      return <>{fallback}</>;

    default:
      return null;
  }
}

/**
 * PaidOnlyGate - Only show content to paid users
 */
export function PaidOnlyGate({ children, fallback = null }: SimpleGateProps): ReactElement | null {
  const { isPaid } = useSubscription();

  if (isPaid()) {
    return <>{children}</>;
  }

  return fallback ? <>{fallback}</> : null;
}

/**
 * FreeOnlyGate - Only show content to free users (for upgrade prompts)
 */
export function FreeOnlyGate({ children }: { children: ReactNode }): ReactElement | null {
  const { isPaid } = useSubscription();

  if (!isPaid()) {
    return <>{children}</>;
  }

  return null;
}

/**
 * TierGate - Show content only for specific tiers
 */
export function TierGate({ tiers, children, fallback = null }: TierGateProps): ReactElement | null {
  const { tier } = useSubscription();

  if (tiers.includes(tier)) {
    return <>{children}</>;
  }

  return fallback ? <>{fallback}</> : null;
}

/**
 * AnalysisGate - Check if user has analyses remaining
 */
export function AnalysisGate({ children, fallback = null }: AnalysisGateProps): ReactElement | null {
  const { hasAnalysesRemaining } = useSubscription();

  if (hasAnalysesRemaining()) {
    return <>{children}</>;
  }

  return fallback ? <>{fallback}</> : null;
}

/**
 * PreviewGate - Show limited preview for free users, full for paid
 */
export function PreviewGate<T>({
  items = [],
  previewCount = 2,
  renderItem,
  renderLocked,
  feature = 'fullOptimizationPlan',
}: PreviewGateProps<T>): ReactElement {
  const { hasAccess } = useFeatureAccess(feature);

  if (hasAccess) {
    return <>{items.map((item, index) => renderItem(item, index))}</>;
  }

  const previewItems = items.slice(0, previewCount);
  const lockedCount = items.length - previewCount;

  return (
    <>
      {previewItems.map((item, index) => renderItem(item, index))}
      {lockedCount > 0 && renderLocked && renderLocked(lockedCount)}
    </>
  );
}

export default FeatureGate;