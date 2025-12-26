import { useState } from 'react';
import { Info } from 'lucide-react';

type TooltipType = 
  | 'hiring-ready' 
  | 'hiring-attention'
  | 'ats-pass' 
  | 'ats-fail' 
  | 'search-discoverable' 
  | 'search-limited'
  | 'search-low'
  | 'alignment';

const TOOLTIP_CONTENT: Record<TooltipType, string> = {
  'hiring-ready': 
    'Your resume passes ATS screening, appears in recruiter searches, and meets role requirements. You can apply without making changes.',
  'hiring-attention':
    'Your resume needs adjustments before it can pass ATS screening or appear in recruiter searches. Review the items below.',
  'ats-pass': 
    'Your resume parsed correctly, includes required keywords, and has no disqualifying gaps. It would advance to recruiter review.',
  'ats-fail': 
    'Your resume is missing required criteria that may prevent it from passing ATS screening. Address the items listed to proceed.',
  'search-discoverable': 
    'Recruiters searching for this role are likely to find your resume based on titles, skills, and experience.',
  'search-limited': 
    'Your resume may appear in some searches, but missing criteria reduce visibility. Adding the items below can improve discovery.',
  'search-low':
    'Recruiters are unlikely to find your resume in searches for this role. Key criteria are missing.',
  'alignment': 
    'This score measures wording similarity to the job description. It does not determine eligibility or hiring decisions.',
};

interface StatusTooltipProps {
  type: TooltipType;
  children: React.ReactNode;
}

export function StatusTooltip({ type, children }: StatusTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-flex items-center gap-1">
      {children}
      <button
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
        className="p-0.5 text-gray-400 hover:text-gray-600 transition-colors"
        aria-label="More information"
      >
        <Info className="w-4 h-4" />
      </button>
      
      {isVisible && (
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-72">
          <div className="bg-gray-900 text-white text-sm rounded-lg px-4 py-3 shadow-lg">
            {TOOLTIP_CONTENT[type]}
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
              <div className="border-8 border-transparent border-t-gray-900" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function getTooltipType(
  section: 'hiring' | 'ats' | 'search' | 'alignment',
  status?: string
): TooltipType {
  if (section === 'hiring') {
    return status === 'READY' ? 'hiring-ready' : 'hiring-attention';
  }
  if (section === 'ats') {
    return status === 'PASS' ? 'ats-pass' : 'ats-fail';
  }
  if (section === 'search') {
    if (status === 'DISCOVERABLE') return 'search-discoverable';
    if (status === 'LIMITED') return 'search-limited';
    return 'search-low';
  }
  return 'alignment';
}

export default StatusTooltip;
