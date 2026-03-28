/**
 * useAnalysisLimit Hook
 *
 * Checks and enforces analysis limits based on user tier:
 * - Free: 3 total (server-enforced)
 * - Pro: 50/month
 *
 * All users must be authenticated. No guest/localStorage tracking.
 *
 * File: client/src/hooks/useAnalysisLimit.ts
 */

import { useCallback } from 'react';
import { useSubscription } from '../contexts/SubscriptionContext';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export type LimitReason = 'ok' | 'free_limit';

export interface AnalysisLimitCheck {
  allowed: boolean;
  reason: LimitReason;
  remaining: number;
  used: number;
  limit: number;
}

export interface UseAnalysisLimitReturn {
  checkCanAnalyze: () => AnalysisLimitCheck;
  incrementUsage: () => void;
}

// ═══════════════════════════════════════════════════════════════════════════
// HOOK
// ═══════════════════════════════════════════════════════════════════════════

export function useAnalysisLimit(): UseAnalysisLimitReturn {
  const { tier, usage, TIERS, incrementUsage: incrementContextUsage } = useSubscription();

  /**
   * Check if user can run another analysis
   */
  const checkCanAnalyze = useCallback((): AnalysisLimitCheck => {
    const { analysesUsed, analysesLimit } = usage;
    const remaining = Math.max(0, analysesLimit - analysesUsed);
    const isAtLimit = analysesUsed >= analysesLimit;
    const isFree = tier === TIERS.FREE;

    return {
      allowed: !isAtLimit,
      reason: isAtLimit && isFree ? 'free_limit' : 'ok',
      remaining,
      used: analysesUsed,
      limit: analysesLimit,
    };
  }, [tier, usage, TIERS]);

  /**
   * Increment usage after successful analysis
   */
  const incrementUsage = useCallback((): void => {
    incrementContextUsage();
  }, [incrementContextUsage]);

  return {
    checkCanAnalyze,
    incrementUsage,
  };
}

export default useAnalysisLimit;
