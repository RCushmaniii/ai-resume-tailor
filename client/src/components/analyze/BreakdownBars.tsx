import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Info } from 'lucide-react';

interface Breakdown {
  keywords: number;
  semantic: number;
  tone: number;
}

interface BreakdownBarsProps {
  breakdown: Breakdown;
}

export function BreakdownBars({ breakdown }: BreakdownBarsProps) {
  const TARGET_THRESHOLD = 80; // Target score for "good" match
  
  const categories = [
    { 
      label: 'Keywords Match', 
      value: breakdown.keywords, 
      color: 'bg-blue-500',
      description: 'Hard skills presence from job description'
    },
    { 
      label: 'Semantic Match', 
      value: breakdown.semantic, 
      color: 'bg-purple-500',
      description: 'Contextual relevance of your experience'
    },
    { 
      label: 'Tone & Style', 
      value: breakdown.tone, 
      color: 'bg-green-500',
      description: 'Professional formatting and action verbs'
    },
  ];

  const getScoreColor = (value: number) => {
    if (value >= TARGET_THRESHOLD) return 'text-green-600';
    if (value >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle>Score Breakdown</CardTitle>
          <Info className="h-4 w-4 text-gray-400" />
        </div>
        <p className="text-sm text-muted-foreground">
          Target: {TARGET_THRESHOLD}% or higher for optimal match
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {categories.map((category) => (
          <div key={category.label} className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{category.label}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  category.value >= TARGET_THRESHOLD 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {category.value >= TARGET_THRESHOLD ? 'Good' : 'Needs Work'}
                </span>
              </div>
              <span className={`text-sm font-semibold ${getScoreColor(category.value)}`}>
                {category.value}%
              </span>
            </div>
            <div className="relative">
              <Progress value={category.value} className="h-3" />
              {/* Target marker line */}
              <div 
                className="absolute top-0 h-3 w-0.5 bg-gray-600"
                style={{ left: `${TARGET_THRESHOLD}%` }}
              >
                <div className="absolute -top-1 -left-1 w-0 h-0 border-l-4 border-r-0 border-t-4 border-b-4 border-l-gray-600 border-t-transparent border-b-transparent" />
              </div>
            </div>
            <p className="text-xs text-gray-500">
              {category.description}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
