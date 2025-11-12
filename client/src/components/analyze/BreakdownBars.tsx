import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface Breakdown {
  keywords: number;
  semantic: number;
  tone: number;
}

interface BreakdownBarsProps {
  breakdown: Breakdown;
}

export function BreakdownBars({ breakdown }: BreakdownBarsProps) {
  const categories = [
    { label: 'Keywords Match', value: breakdown.keywords, color: 'bg-blue-500' },
    { label: 'Semantic Match', value: breakdown.semantic, color: 'bg-purple-500' },
    { label: 'Tone & Style', value: breakdown.tone, color: 'bg-green-500' },
  ];

  return (
    <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
      <CardHeader>
        <CardTitle>Score Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {categories.map((category) => (
          <div key={category.label} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">{category.label}</span>
              <span className="text-sm font-semibold">{category.value}%</span>
            </div>
            <Progress value={category.value} className="h-3" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
