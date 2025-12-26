import { HelpCircle, X, CheckCircle, Search, TrendingUp } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HelpModal({ isOpen, onClose }: HelpModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/50" 
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-xl font-bold text-gray-900">How to interpret your results</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        <div className="px-6 py-6 space-y-6">
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">What this report tells you</h3>
            <p className="text-gray-600">
              This report shows whether your resume is <strong>eligible</strong>, <strong>discoverable</strong>, and <strong>competitive</strong> for the role you're applying to.
            </p>
            <p className="text-gray-500 text-sm mt-2 italic">
              It is not a hiring decision and does not predict interview outcomes.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">The three things that matter</h3>
            
            <div className="space-y-4">
              <div className="flex gap-4 p-4 bg-blue-50 rounded-lg">
                <CheckCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900">1. ATS Status</h4>
                  <p className="text-gray-600 text-sm mt-1">
                    Determines whether your resume can pass automated screening and reach a recruiter.
                  </p>
                  <ul className="mt-2 text-sm space-y-1">
                    <li className="text-green-700">• <strong>PASS</strong> means your resume clears this gate</li>
                    <li className="text-red-700">• <strong>FAIL</strong> means changes are needed before applying</li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-4 p-4 bg-slate-50 rounded-lg">
                <Search className="w-6 h-6 text-slate-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900">2. Search Status</h4>
                  <p className="text-gray-600 text-sm mt-1">
                    Shows whether recruiters are likely to find your resume when they search.
                  </p>
                  <ul className="mt-2 text-sm space-y-1">
                    <li className="text-green-700">• <strong>DISCOVERABLE</strong> means you appear in relevant searches</li>
                    <li className="text-yellow-700">• <strong>LIMITED</strong> means visibility could be improved</li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-4 p-4 bg-indigo-50 rounded-lg">
                <TrendingUp className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900">3. Resume Optimization Alignment</h4>
                  <p className="text-gray-600 text-sm mt-1">
                    Reflects how closely your wording matches the job description.
                  </p>
                  <p className="text-indigo-700 text-sm mt-1 font-medium">
                    This score is for optimization only — not eligibility.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-green-800 mb-2">When to stop optimizing</h3>
            <p className="text-green-700">
              If your status is <strong>READY TO SUBMIT</strong>, your resume meets application requirements.
            </p>
            <p className="text-green-700 mt-2">
              Further changes are optional and may not improve hiring outcomes.
            </p>
            <p className="text-green-600 text-sm mt-3 italic">
              Many strong candidates apply successfully without perfect alignment scores.
            </p>
          </section>
        </div>

        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 rounded-b-2xl">
          <p className="text-sm text-gray-500 text-center">
            Recruiters evaluate experience, impact, and fit — not optimization scores.
          </p>
        </div>
      </div>
    </div>
  );
}

export function HelpButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
    >
      <HelpCircle className="w-4 h-4" />
      How to interpret these results
    </button>
  );
}

export default HelpModal;
