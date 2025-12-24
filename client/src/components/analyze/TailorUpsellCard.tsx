import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, Lock, TrendingUp, FileText } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface TailorUpsellCardProps {
  onUnlock?: () => void;
  currentScore?: number;
  targetScore?: number;
}

export function TailorUpsellCard({ 
  onUnlock, 
  currentScore = 65, 
  targetScore = 98 
}: TailorUpsellCardProps) {
  const { t } = useTranslation();

  return (
    <Card className="border-2 border-indigo-100 bg-gradient-to-r from-indigo-50 to-purple-50 overflow-hidden relative hover:shadow-lg transition-all duration-300">
      {/* Gradient Background Accent */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-600 to-purple-600"></div>
      
      <CardContent className="p-8 flex flex-col items-center text-center space-y-6">
        
        {/* Value Proposition */}
        <div className="space-y-3">
          <h3 className="text-2xl font-bold text-indigo-900 flex items-center justify-center gap-2">
            <Sparkles className="h-6 w-6 text-indigo-600 fill-indigo-600" />
            {t('upsell.title', 'Instant {{score}}% Match Score', { score: targetScore })}
          </h3>
          <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
            {t('upsell.description', "Don't guess where to put keywords. Our AI will rewrite your resume to perfectly align with this job description.")}
          </p>
        </div>

        {/* Score Improvement Visual */}
        <div className="flex items-center gap-4 bg-white px-6 py-3 rounded-full shadow-sm border border-gray-200">
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-red-600">{currentScore}%</span>
            <TrendingUp className="h-4 w-4 text-green-600" />
            <span className="text-lg font-semibold text-green-600">{targetScore}%</span>
          </div>
          <span className="text-sm text-gray-500 font-medium">
            {t('upsell.improvement', '+{{improvement}}% Match', { improvement: targetScore - currentScore })}
          </span>
        </div>

        {/* The "Blurred" Preview Tease */}
        <div className="w-full max-w-lg bg-white rounded-lg shadow-sm border border-gray-200 p-6 relative">
          <div className="space-y-3">
            {/* Simulated Resume Content */}
            <div className="filter blur-[4px] select-none opacity-50 space-y-2">
              <div className="h-3 bg-gray-300 rounded w-full"></div>
              <div className="h-3 bg-gray-300 rounded w-5/6"></div>
              <div className="h-3 bg-gray-300 rounded w-4/5"></div>
              <div className="h-3 bg-gray-300 rounded w-full"></div>
              <div className="h-3 bg-gray-300 rounded w-3/4"></div>
              <div className="h-3 bg-gray-300 rounded w-5/6"></div>
            </div>
            
            {/* Keywords Badge */}
            <div className="flex gap-2 justify-center mt-4">
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full filter blur-[2px] opacity-60">
                TypeScript
              </span>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full filter blur-[2px] opacity-60">
                React
              </span>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full filter blur-[2px] opacity-60">
                AWS
              </span>
            </div>
          </div>
          
          {/* Lock Overlay */}
          <div className="absolute inset-0 flex items-center justify-center z-10 bg-white/30 backdrop-blur-sm rounded-lg">
            <div className="bg-white p-4 rounded-full shadow-xl border-2 border-indigo-200">
              <Lock className="h-8 w-8 text-indigo-600" />
            </div>
          </div>
          
          {/* Ready Badge */}
          <div className="absolute top-3 right-3 bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
            {t('upsell.ready', '98% Match Ready')}
          </div>
        </div>

        {/* Features List */}
        <div className="w-full max-w-lg space-y-2 text-left">
          <div className="flex items-center gap-3 text-sm text-gray-700">
            <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-green-600 text-xs">✓</span>
            </div>
            <span>{t('upsell.features.rewrite', 'AI-powered resume rewrite')}</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-700">
            <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-green-600 text-xs">✓</span>
            </div>
            <span>{t('upsell.features.coverLetter', 'Custom cover letter generation')}</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-700">
            <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-green-600 text-xs">✓</span>
            </div>
            <span>{t('upsell.features.keywords', 'All missing keywords included')}</span>
          </div>
        </div>

        {/* Primary CTA */}
        <Button 
          size="lg" 
          className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg transform hover:-translate-y-1 transition-all duration-200 text-lg px-8 py-3"
          onClick={onUnlock}
        >
          <FileText className="mr-2 h-5 w-5" />
          {t('upsell.cta', 'Unlock Optimized Resume & Cover Letter')}
        </Button>
        
        {/* Social Proof */}
        <div className="text-center space-y-2">
          <p className="text-xs text-gray-500 font-medium">
            {t('upsell.socialProof', 'Join 500+ professionals who got hired faster')}
          </p>
          <div className="flex items-center justify-center gap-1">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-yellow-500 text-sm">★</span>
            ))}
            <span className="text-xs text-gray-500 ml-1">
              {t('upsell.rating', '4.9/5 (127 reviews)')}
            </span>
          </div>
        </div>

      </CardContent>
    </Card>
  );
}

export default TailorUpsellCard;
