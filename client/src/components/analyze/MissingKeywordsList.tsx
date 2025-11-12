import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface MissingKeyword {
  word: string;
  priority: 'high' | 'medium' | 'low';
}

interface MissingKeywordsListProps {
  keywords: MissingKeyword[];
}

export function MissingKeywordsList({ keywords }: MissingKeywordsListProps) {
  const getVariant = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'destructive' as const;
      case 'medium':
        return 'default' as const;
      case 'low':
        return 'secondary' as const;
      default:
        return 'secondary' as const;
    }
  };

  const getPriorityLabel = (priority: string) => {
    return priority.toUpperCase();
  };

  return (
    <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>⚠️</span>
          <span>Missing Keywords</span>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Consider adding these skills or keywords to improve your match
        </p>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {keywords.map((kw, index) => (
            <Badge
              key={index}
              variant={getVariant(kw.priority)}
              className="text-sm px-3 py-1"
            >
              <span className="font-semibold text-xs mr-1">
                [{getPriorityLabel(kw.priority)}]
              </span>
              {kw.word}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
