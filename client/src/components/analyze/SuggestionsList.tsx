import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SuggestionsListProps {
  suggestions: string[];
}

export function SuggestionsList({ suggestions }: SuggestionsListProps) {
  return (
    <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>💡</span>
          <span>Suggestions to Improve</span>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Actionable recommendations to strengthen your resume
        </p>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {suggestions.map((suggestion, index) => (
            <li key={index} className="flex items-start gap-3 group">
              <span className="text-primary font-bold mt-0.5 flex-shrink-0">
                •
              </span>
              <span className="text-sm leading-relaxed group-hover:text-foreground transition-colors">
                {suggestion}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
