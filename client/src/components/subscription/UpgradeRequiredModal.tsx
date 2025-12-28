/**
 * Upgrade Required Modal
 * 
 * Shows when a registered free user has exhausted their 5 analyses.
 * Hard gate - must upgrade to Pro to continue.
 * 
 * Triggers:
 * - Free user uses 5th analysis
 * - Free user tries to run 6th analysis
 * 
 * File: client/src/components/subscription/UpgradeRequiredModal.tsx
 */

import type { ReactElement } from 'react';
import {
  Zap,
  Sparkles,
  Shield,
  FileText,
  MessageSquare,
  PenTool,
  Download,
  BarChart3,
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

interface UpgradeRequiredModalProps {
  isOpen: boolean;
  analysesUsed?: number;
  onClose?: () => void;
}

// ═══════════════════════════════════════════════════════════════════════════
// PRO FEATURES
// ═══════════════════════════════════════════════════════════════════════════

const PRO_FEATURES = [
  { icon: BarChart3, label: '50 analyses per month' },
  { icon: PenTool, label: 'AI Resume Rewriter' },
  { icon: MessageSquare, label: 'Interview Prep Questions' },
  { icon: FileText, label: 'Cover Letter Generator' },
  { icon: Download, label: 'Full optimization reports' },
];

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export function UpgradeRequiredModal({
  isOpen,
  analysesUsed = 5,
  onClose,
}: UpgradeRequiredModalProps): ReactElement | null {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-8 text-center text-white">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
            <Zap className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold">
            You've used all {analysesUsed} free analyses
          </h2>
          <p className="text-amber-100 mt-2">
            Upgrade to Pro to continue
          </p>
        </div>

        {/* Features */}
        <div className="px-6 py-6">
          <ul className="space-y-3">
            {PRO_FEATURES.map((feature, index) => (
              <li key={index} className="flex items-center gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <feature.icon className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-gray-700">{feature.label}</span>
              </li>
            ))}
          </ul>

          {/* Pricing */}
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
            <div className="flex items-baseline justify-center gap-2">
              <span className="text-3xl font-bold text-gray-900">$12</span>
              <span className="text-gray-600">/month</span>
            </div>
            <p className="text-center text-sm text-blue-600 mt-1">
              or $79/year (save 45%)
            </p>
          </div>

          {/* Primary CTA */}
          <a
            href="/pricing"
            className="mt-6 w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
          >
            <Sparkles className="w-5 h-5" />
            Upgrade to Pro
          </a>

          {/* Guarantee */}
          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500">
            <Shield className="w-4 h-4" />
            <span>7-day money-back guarantee</span>
          </div>

          {/* Close option (less prominent) */}
          {onClose && (
            <button
              onClick={onClose}
              className="mt-4 w-full text-center text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              Maybe later
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default UpgradeRequiredModal;
