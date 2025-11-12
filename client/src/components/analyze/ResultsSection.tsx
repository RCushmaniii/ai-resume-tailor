import { Button } from '@/components/ui/button';
import { MatchScoreCard } from './MatchScoreCard';
import { BreakdownBars } from './BreakdownBars';
import { MissingKeywordsList } from './MissingKeywordsList';
import { SuggestionsList } from './SuggestionsList';
import type { AnalysisResult } from '@/mocks/analysisResult';

interface ResultsSectionProps {
  results: AnalysisResult;
  onAnalyzeAgain: () => void;
}

export function ResultsSection({ results, onAnalyzeAgain }: ResultsSectionProps) {
  return (
    <div id="results" className="space-y-6">
      {/* Match Score */}
      <MatchScoreCard score={results.match_score} />

      {/* Score Breakdown */}
      <BreakdownBars breakdown={results.breakdown} />

      {/* Missing Keywords */}
      {results.missing_keywords.length > 0 && (
        <MissingKeywordsList keywords={results.missing_keywords} />
      )}

      {/* Suggestions */}
      {results.suggestions.length > 0 && (
        <SuggestionsList suggestions={results.suggestions} />
      )}

      {/* Analyze Again Button */}
      <div className="flex justify-center pt-4">
        <Button
          onClick={onAnalyzeAgain}
          variant="outline"
          size="lg"
          className="px-12"
        >
          Analyze Again
        </Button>
      </div>
    </div>
  );
}
