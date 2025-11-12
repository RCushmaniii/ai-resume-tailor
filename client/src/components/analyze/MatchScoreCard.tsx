import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface MatchScoreCardProps {
  score: number;
}

export function MatchScoreCard({ score }: MatchScoreCardProps) {
  const getScoreLabel = (score: number) => {
    if (score >= 80) return { text: 'Excellent Match', variant: 'default' as const, color: 'text-green-600' };
    if (score >= 60) return { text: 'Good Match', variant: 'secondary' as const, color: 'text-yellow-600' };
    return { text: 'Needs Improvement', variant: 'destructive' as const, color: 'text-red-600' };
  };

  const { text, variant, color } = getScoreLabel(score);

  return (
    <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <CardContent className="pt-8 pb-8">
        <div className="text-center space-y-4">
          {/* Score Display */}
          <div className={`text-6xl md:text-7xl font-bold ${color}`}>
            {score}
            <span className="text-2xl md:text-3xl">%</span>
          </div>

          {/* Score Label */}
          <Badge variant={variant} className="text-base px-4 py-1">
            {text}
          </Badge>

          {/* Optional: Circular progress indicator */}
          <div className="flex justify-center mt-6">
            <div className="relative w-32 h-32">
              <svg className="transform -rotate-90 w-32 h-32">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-gray-200"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 56}`}
                  strokeDashoffset={`${2 * Math.PI * 56 * (1 - score / 100)}`}
                  className={color}
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
