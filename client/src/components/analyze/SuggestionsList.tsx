import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, AlertTriangle, XCircle, Info, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Define the shape locally or import from your types file
interface Suggestion {
  type: 'critical' | 'warning' | 'tip';
  title: string;
  description: string;
}

interface SuggestionsListProps {
  suggestions: Suggestion[];
}

export function SuggestionsList({ suggestions }: SuggestionsListProps) {
  const { t } = useTranslation();

  // Helper to determine styling based on severity
  const getSuggestionStyle = (type: Suggestion['type']) => {
    switch (type) {
      case 'critical':
        return {
          icon: <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />,
          container: 'bg-red-50 border-red-100',
          title: 'text-red-900',
          text: 'text-red-800'
        };
      case 'warning':
        return {
          icon: <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />,
          container: 'bg-amber-50 border-amber-100',
          title: 'text-amber-900',
          text: 'text-amber-800'
        };
      default: // tip
        return {
          icon: <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />,
          container: 'bg-blue-50 border-blue-100',
          title: 'text-blue-900',
          text: 'text-blue-800'
        };
    }
  };

  // SUCCESS STATE: No suggestions means a perfect resume!
  if (suggestions.length === 0) {
    return (
      <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300 border-green-100 bg-green-50/30">
        <CardContent className="pt-6 flex flex-col items-center text-center p-8">
          <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
             <CheckCircle2 className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-green-900 mb-2">
            {t('results.suggestions.perfectTitle')}
          </h3>
          <p className="text-green-700 max-w-sm">
            {t('results.suggestions.perfectDesc')}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300 shadow-md">
      <CardHeader className="pb-4 border-b border-gray-50">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Lightbulb className="w-5 h-5 text-yellow-500 fill-yellow-500" />
          <span>{t('results.suggestions.title')}</span>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {t('results.suggestions.subtitle')}
        </p>
      </CardHeader>
      
      <CardContent className="pt-6 space-y-4">
        {suggestions.map((suggestion, index) => {
          const style = getSuggestionStyle(suggestion.type);
          
          return (
            <div 
              key={index} 
              className={`p-4 rounded-lg border flex gap-4 transition-all hover:shadow-sm ${style.container}`}
            >
              <div className="mt-0.5">
                {style.icon}
              </div>
              <div className="space-y-1">
                <h4 className={`font-semibold text-sm ${style.title}`}>
                  {suggestion.title}
                </h4>
                <p className={`text-sm leading-relaxed ${style.text}`}>
                  {suggestion.description}
                </p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
