import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from 'react-i18next';

interface MatchScoreCardProps {
  score: number;
}

export function MatchScoreCard({ score }: MatchScoreCardProps) {
  const { t } = useTranslation();

  // Helper for styling and translation keys
  const getScoreDetails = (score: number) => {
    if (score >= 80) return { 
      labelKey: 'results.score.excellent', // specific translation key
      variant: 'default' as const, 
      color: 'text-green-600',
      stroke: 'text-green-500' 
    };
    if (score >= 60) return { 
      labelKey: 'results.score.good', 
      variant: 'secondary' as const, 
      color: 'text-yellow-600',
      stroke: 'text-yellow-500' 
    };
    return { 
      labelKey: 'results.score.needsWork', 
      variant: 'destructive' as const, 
      color: 'text-red-600',
      stroke: 'text-red-500' 
    };
  };

  const { labelKey, variant, color, stroke } = getScoreDetails(score);

  // SVG Configuration
  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - score / 100);

  return (
    <Card className="animate-in fade-in slide-in-from-bottom-4 duration-700 h-full flex items-center justify-center">
      <CardContent className="pt-8 pb-8 flex flex-col items-center">
        
        {/* Hero: Donut Chart with Score Inside */}
        <div className="relative w-40 h-40 mb-6">
          <svg className="transform -rotate-90 w-full h-full">
            {/* Background Circle */}
            <circle
              cx="50%"
              cy="50%"
              r={radius}
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-gray-100"
            />
            {/* Progress Circle (Animated) */}
            <circle
              cx="50%"
              cy="50%"
              r={radius}
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className={`${stroke} transition-all duration-1000 ease-out`}
              strokeLinecap="round"
            />
          </svg>
          
          {/* Centered Score Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-5xl font-bold ${color}`}>
              {score}
              <span className="text-2xl">%</span>
            </span>
          </div>
        </div>

        {/* Score Label Badge */}
        <Badge 
          variant={variant} 
          className="text-sm px-4 py-1.5 uppercase tracking-wide font-semibold shadow-sm"
        >
          {t(labelKey)}
        </Badge>
        
        <p className="text-xs text-gray-400 mt-4 text-center max-w-[200px]">
          {t('results.score.context')} {/* e.g. "Based on ATS keyword matching algorithms" */}
        </p>

      </CardContent>
    </Card>
  );
}
