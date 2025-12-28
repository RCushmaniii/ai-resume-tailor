/**
 * Registration Gate Modal
 * 
 * Shows when a guest user has used all 3 free analyses.
 * Soft gate - offers path to more free usage via registration.
 * 
 * Triggers:
 * - Guest completes 3rd analysis
 * - Guest tries to run 4th analysis
 * 
 * File: client/src/components/auth/RegistrationGateModal.tsx
 */

import type { ReactElement, MouseEvent } from 'react';
import {
  X,
  PartyPopper,
  Check,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

interface RegistrationGateModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onSignIn?: () => void;
  allowDismiss?: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export function RegistrationGateModal({
  isOpen,
  onClose,
  onSignIn,
  allowDismiss = false,
}: RegistrationGateModalProps): ReactElement | null {
  if (!isOpen) return null;

  const handleBackdropClick = (e: MouseEvent) => {
    if (allowDismiss && e.target === e.currentTarget) {
      onClose?.();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Close button - only if dismissable */}
        {allowDismiss && onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-8 text-center text-white">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
            <PartyPopper className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold">
            You've used your 3 free analyses
          </h2>
          <p className="text-blue-100 mt-2">
            Create a free account to keep going
          </p>
        </div>

        {/* Benefits */}
        <div className="px-6 py-6">
          <p className="text-sm text-gray-600 mb-4">
            Create a free account to unlock:
          </p>
          
          <ul className="space-y-3">
            <li className="flex items-center gap-3">
              <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                <Check className="w-3 h-3 text-green-600" />
              </div>
              <span className="text-gray-900 font-medium">5 more free analyses</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                <Check className="w-3 h-3 text-green-600" />
              </div>
              <span className="text-gray-700">Save your analysis history</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                <Check className="w-3 h-3 text-green-600" />
              </div>
              <span className="text-gray-700">Access from any device</span>
            </li>
          </ul>

          {/* Primary CTA */}
          <a
            href="/signup"
            className="mt-6 w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
          >
            Create Free Account
            <ArrowRight className="w-4 h-4" />
          </a>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white text-gray-500">or</span>
            </div>
          </div>

          {/* Pro Upgrade */}
          <a
            href="/pricing"
            className="w-full flex items-center justify-between px-4 py-3 border-2 border-blue-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900">Upgrade to Pro</p>
                <p className="text-sm text-gray-500">$12/mo • 50 analyses + all features</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
          </a>

          {/* Sign in link */}
          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{' '}
            {onSignIn ? (
              <button
                onClick={onSignIn}
                className="font-medium text-blue-600 hover:text-blue-700"
              >
                Sign in
              </button>
            ) : (
              <a
                href="/login"
                className="font-medium text-blue-600 hover:text-blue-700"
              >
                Sign in
              </a>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegistrationGateModal;
