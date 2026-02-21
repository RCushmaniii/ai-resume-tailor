/**
 * Subscription Context
 *
 * Manages user subscription state across the app.
 * Provides hooks for checking features and showing upgrade prompts.
 *
 * File: client/src/contexts/SubscriptionContext.tsx
 */

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useUser } from '@clerk/clerk-react';

// =========================================================================
// TYPES & INTERFACES
// =========================================================================

export type TierType = 'guest' | 'free' | 'pro' | 'commercial';

export interface SubscriptionData {
  id: string;
  status: string;
  current_period_end: number;
  cancel_at_period_end: boolean;
}

export interface UsageData {
  analysesUsed: number;
  analysesLimit: number;
  periodEnd: string | null;
}

export interface TierInfoData {
  name: string;
  badge: string | null;
  color: string;
}

export interface SubscriptionContextType {
  // State
  tier: TierType;
  isLoading: boolean;
  subscription: SubscriptionData | null;
  usage: UsageData;

  // Tier info
  tierInfo: TierInfoData;

  // Feature checks
  hasFeature: (featureName: FeatureType) => boolean;
  hasAnalysesRemaining: () => boolean;
  getAnalysesRemaining: () => number;
  isPaid: () => boolean;

  // Actions
  incrementUsage: () => void;
  refreshSubscription: () => Promise<void>;

  // Constants
  TIERS: typeof TIERS;
  FEATURE_ACCESS: typeof FEATURE_ACCESS;
  TIER_INFO: typeof TIER_INFO;
}

export type FeatureType =
  | 'basicAnalysis'
  | 'fullOptimizationPlan'
  | 'resumeQualityFull'
  | 'interviewPrepFull'
  | 'coverLetterGenerator'
  | 'resumeRewriter'
  | 'pdfExport'
  | 'teamDashboard';

// =========================================================================
// CONSTANTS
// =========================================================================

export const TIERS = {
  GUEST: 'guest' as const,
  FREE: 'free' as const,
  PRO: 'pro' as const,
  COMMERCIAL: 'commercial' as const,
};

export const FEATURE_ACCESS = {
  // Analysis limits
  analysisLimit: {
    [TIERS.GUEST]: 3,
    [TIERS.FREE]: 5,
    [TIERS.PRO]: 50,
    [TIERS.COMMERCIAL]: 500,
  } as Record<TierType, number>,

  // Feature availability
  features: {
    basicAnalysis: [TIERS.GUEST, TIERS.FREE, TIERS.PRO, TIERS.COMMERCIAL],
    fullOptimizationPlan: [TIERS.PRO, TIERS.COMMERCIAL],
    resumeQualityFull: [TIERS.PRO, TIERS.COMMERCIAL],
    interviewPrepFull: [TIERS.PRO, TIERS.COMMERCIAL],
    coverLetterGenerator: [TIERS.PRO, TIERS.COMMERCIAL],
    resumeRewriter: [TIERS.PRO, TIERS.COMMERCIAL],
    pdfExport: [TIERS.PRO, TIERS.COMMERCIAL],
    teamDashboard: [TIERS.COMMERCIAL],
  } as Record<FeatureType, TierType[]>,

  // Preview limits for free users
  previewLimits: {
    optimizationItems: 2,
    interviewQuestions: 3,
    qualityDimensions: 1,
  },
};

export const TIER_INFO: Record<TierType, TierInfoData> = {
  [TIERS.GUEST]: {
    name: 'Guest',
    badge: null,
    color: 'gray',
  },
  [TIERS.FREE]: {
    name: 'Free',
    badge: null,
    color: 'gray',
  },
  [TIERS.PRO]: {
    name: 'Pro',
    badge: '⭐',
    color: 'indigo',
  },
  [TIERS.COMMERCIAL]: {
    name: 'Commercial',
    badge: '🏢',
    color: 'purple',
  },
};

// =========================================================================
// CONTEXT
// =========================================================================

const SubscriptionContext = createContext<SubscriptionContextType | null>(null);

interface SubscriptionProviderProps {
  children: ReactNode;
}

/**
 * Subscription Provider
 */
export function SubscriptionProvider({ children }: SubscriptionProviderProps) {
  const [tier, setTier] = useState<TierType>(TIERS.GUEST);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [usage, setUsage] = useState<UsageData>({
    analysesUsed: 0,
    analysesLimit: 3,
    periodEnd: null,
  });

  const { isSignedIn, isLoaded, getToken } = useAuth();
  const { user } = useUser();

  const loadSubscriptionStatus = useCallback(async (signedIn: boolean): Promise<void> => {
    setIsLoading(true);
    try {
      if (!signedIn) {
        // Guest user - use localStorage for usage tracking
        const guestUsed = parseInt(localStorage.getItem('guest_analyses_used') || '0', 10);
        setTier(TIERS.GUEST);
        setUsage({
          analysesUsed: guestUsed,
          analysesLimit: FEATURE_ACCESS.analysisLimit[TIERS.GUEST],
          periodEnd: null,
        });
      } else {
        // Authenticated user - fetch subscription from API
        const token = await getToken();
        const response = await fetch('/api/subscription', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          const userTier = (data.tier as TierType) || TIERS.FREE;
          setTier(userTier);
          setSubscription(data.subscription || null);
          setUsage({
            analysesUsed: data.analyses_used || 0,
            analysesLimit: FEATURE_ACCESS.analysisLimit[userTier],
            periodEnd: data.period_end || null,
          });
        } else {
          // API error or no subscription - default to free tier for authenticated users
          setTier(TIERS.FREE);
          setUsage({
            analysesUsed: 0,
            analysesLimit: FEATURE_ACCESS.analysisLimit[TIERS.FREE],
            periodEnd: null,
          });
        }
      }
    } catch (error) {
      console.error('Failed to load subscription status:', error);
      if (signedIn) {
        setTier(TIERS.FREE);
      } else {
        setTier(TIERS.GUEST);
      }
    } finally {
      setIsLoading(false);
    }
  }, [getToken]);

  // Load subscription when auth state changes
  useEffect(() => {
    if (!isLoaded) return;
    loadSubscriptionStatus(isSignedIn ?? false);
  }, [isLoaded, isSignedIn, user?.id, loadSubscriptionStatus]);

  const hasFeature = useCallback((featureName: FeatureType): boolean => {
    const allowedTiers = FEATURE_ACCESS.features[featureName];
    if (!allowedTiers) return false;
    return allowedTiers.includes(tier);
  }, [tier]);

  const hasAnalysesRemaining = useCallback((): boolean => {
    return usage.analysesUsed < usage.analysesLimit;
  }, [usage]);

  const getAnalysesRemaining = useCallback((): number => {
    return Math.max(0, usage.analysesLimit - usage.analysesUsed);
  }, [usage]);

  const isPaid = useCallback((): boolean => {
    return tier === TIERS.PRO || tier === TIERS.COMMERCIAL;
  }, [tier]);

  const incrementUsage = useCallback((): void => {
    setUsage(prev => ({
      ...prev,
      analysesUsed: prev.analysesUsed + 1,
    }));

    if (tier === TIERS.GUEST) {
      const current = parseInt(localStorage.getItem('guest_analyses_used') || '0', 10);
      localStorage.setItem('guest_analyses_used', (current + 1).toString());
    }
  }, [tier]);

  const refreshSubscription = useCallback(async (): Promise<void> => {
    await loadSubscriptionStatus(isSignedIn ?? false);
  }, [loadSubscriptionStatus, isSignedIn]);

  const value: SubscriptionContextType = {
    tier,
    isLoading,
    subscription,
    usage,
    tierInfo: TIER_INFO[tier],
    hasFeature,
    hasAnalysesRemaining,
    getAnalysesRemaining,
    isPaid,
    incrementUsage,
    refreshSubscription,
    TIERS,
    FEATURE_ACCESS,
    TIER_INFO,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
}

/**
 * Hook to use subscription context
 */
export function useSubscription(): SubscriptionContextType {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within SubscriptionProvider');
  }
  return context;
}

/**
 * Hook to check specific feature access
 */
export interface FeatureAccessResult {
  hasAccess: boolean;
  tier: TierType;
  isPaid: boolean;
  requiredTier: TierType;
}

export function useFeatureAccess(featureName: FeatureType): FeatureAccessResult {
  const { hasFeature, tier, isPaid } = useSubscription();

  return {
    hasAccess: hasFeature(featureName),
    tier,
    isPaid: isPaid(),
    requiredTier: FEATURE_ACCESS.features[featureName]?.[0] || TIERS.PRO,
  };
}

export default SubscriptionContext;
