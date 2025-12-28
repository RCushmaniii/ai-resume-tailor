/**
 * useAnalysisLimit Hook
 * 
 * Checks and enforces analysis limits based on user tier:
 * - Guest: 3 total (localStorage)
 * - Free: 5 total (after registration)
 * - Pro: 50/month
 * 
 * File: client/src/hooks/useAnalysisLimit.ts
 */

import { useCallback } from 'react';
import { useSubscription } from '../contexts/SubscriptionContext';

// ═══════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

const GUEST_STORAGE_KEY = 'guest_analyses';
const GUEST_LIMIT = 3;

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export type LimitReason = 'ok' | 'guest_limit' | 'free_limit';

export interface AnalysisLimitCheck {
  allowed: boolean;
  reason: LimitReason;
  remaining: number;
  used: number;
  limit: number;
  isGuest: boolean;
}

export interface UseAnalysisLimitReturn {
  checkCanAnalyze: () => AnalysisLimitCheck;
  incrementUsage: () => void;
  getGuestUsage: () => number;
  clearGuestUsage: () => void;
  transferGuestUsage: () => number;
}

// ═══════════════════════════════════════════════════════════════════════════
// GUEST STORAGE HELPERS
// ═══════════════════════════════════════════════════════════════════════════

function getGuestAnalysesCount(): number {
  if (typeof window === 'undefined') return 0;
  return parseInt(localStorage.getItem(GUEST_STORAGE_KEY) || '0', 10);
}

function setGuestAnalysesCount(count: number): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(GUEST_STORAGE_KEY, count.toString());
}

function clearGuestAnalyses(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(GUEST_STORAGE_KEY);
}

// ═══════════════════════════════════════════════════════════════════════════
// HOOK
// ═══════════════════════════════════════════════════════════════════════════

export function useAnalysisLimit(): UseAnalysisLimitReturn {
  const { tier, usage, TIERS, incrementUsage: incrementContextUsage } = useSubscription();
  
  const isGuest = tier === TIERS.GUEST;
  
  /**
   * Check if user can run another analysis
   */
  const checkCanAnalyze = useCallback((): AnalysisLimitCheck => {
    if (isGuest) {
      const used = getGuestAnalysesCount();
      const remaining = Math.max(0, GUEST_LIMIT - used);
      
      return {
        allowed: used < GUEST_LIMIT,
        reason: used >= GUEST_LIMIT ? 'guest_limit' : 'ok',
        remaining,
        used,
        limit: GUEST_LIMIT,
        isGuest: true,
      };
    }
    
    // Registered user (free or pro)
    const { analysesUsed, analysesLimit } = usage;
    const remaining = Math.max(0, analysesLimit - analysesUsed);
    const isAtLimit = analysesUsed >= analysesLimit;
    
    // Free users hit a hard wall
    const isFree = tier === TIERS.FREE;
    
    return {
      allowed: !isAtLimit,
      reason: isAtLimit && isFree ? 'free_limit' : 'ok',
      remaining,
      used: analysesUsed,
      limit: analysesLimit,
      isGuest: false,
    };
  }, [isGuest, tier, usage, TIERS]);
  
  /**
   * Increment usage after successful analysis
   */
  const incrementUsage = useCallback((): void => {
    if (isGuest) {
      const current = getGuestAnalysesCount();
      setGuestAnalysesCount(current + 1);
    } else {
      incrementContextUsage();
    }
  }, [isGuest, incrementContextUsage]);
  
  /**
   * Get current guest usage count
   */
  const getGuestUsage = useCallback((): number => {
    return getGuestAnalysesCount();
  }, []);
  
  /**
   * Clear guest usage (after registration)
   */
  const clearGuestUsage = useCallback((): void => {
    clearGuestAnalyses();
  }, []);
  
  /**
   * Transfer guest usage to registered user
   * Returns the count that was transferred
   */
  const transferGuestUsage = useCallback((): number => {
    const count = getGuestAnalysesCount();
    clearGuestAnalyses();
    return count;
  }, []);
  
  return {
    checkCanAnalyze,
    incrementUsage,
    getGuestUsage,
    clearGuestUsage,
    transferGuestUsage,
  };
}

export default useAnalysisLimit;
