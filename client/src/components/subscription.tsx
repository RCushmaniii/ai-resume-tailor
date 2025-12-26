/**
 * Subscription Components Index
 * 
 * Export all subscription-related components for easy importing.
 * 
 * Usage:
 *   import { LockedFeature, UpgradeCard, FeatureGate } from '@/components/subscription';
 * 
 * File: client/src/components/subscription/index.js
 */

// Context & Hooks
export {
  SubscriptionProvider,
  useSubscription,
  useFeatureAccess,
  TIERS,
  FEATURE_ACCESS,
  TIER_INFO,
} from '../../contexts/SubscriptionContext';

// Locked Feature Components
export {
  LockedFeature,
  LockedFeatureInline,
  LockedCount,
} from './LockedFeature';

// Upgrade Cards
export {
  UpgradeCard,
  UpgradeCardGrid,
} from './UpgradeCard';

// Upgrade Banners
export {
  CreditExhaustedBanner,
  LowCreditsBanner,
  UpgradeSuccessBanner,
  ProBadgeBanner,
  ContextualUpgradeBanner,
  AutoUpgradeBanner,
} from './UpgradeBanner';

// Feature Gates
export {
  FeatureGate,
  PaidOnlyGate,
  FreeOnlyGate,
  TierGate,
  AnalysisGate,
  PreviewGate,
} from './FeatureGate';

// Badges & Indicators
export {
  PremiumBadge,
  UpgradeBadge,
  UsageIndicator,
  UsageBadge,
  SubscriptionStatus,
} from './PremiumBadge';