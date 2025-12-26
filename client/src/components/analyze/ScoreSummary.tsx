import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface ScoreSummaryProps {
  score: number;
  summary: string;
}

export function ScoreSummary({ score, summary }: ScoreSummaryProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-50 border-green-200';
    if (score >= 60) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  const getIcon = (score: number) => {
    if (score >= 80) return <CheckCircle2 className="h-5 w-5 text-green-600" />;
    if (score >= 60) return <AlertCircle className="h-5 w-5 text-yellow-600" />;
    return <AlertCircle className="h-5 w-5 text-red-600" />;
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent Match';
    if (score >= 60) return 'Good Match';
    return 'Needs Improvement';
  };

  return (
    <div className={`rounded-lg border p-4 ${getScoreBg(score)}`}>
      <div className="flex items-start gap-3">
        {getIcon(score)}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={`font-semibold ${getScoreColor(score)}`}>
              {getScoreLabel(score)}
            </h3>
            <span className={`text-2xl font-bold ${getScoreColor(score)}`}>
              {score}%
            </span>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">
            {summary}
          </p>
        </div>
      </div>
    </div>
  );
}
