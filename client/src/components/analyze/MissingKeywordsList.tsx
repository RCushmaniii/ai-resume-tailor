import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface MissingKeywordsListProps {
  keywords: string[]; // Updated to match API response (string[])
}

export function MissingKeywordsList({ keywords }: MissingKeywordsListProps) {
  const { t } = useTranslation();

  // SUCCESS STATE: No missing keywords!
  if (keywords.length === 0) {
    return (
      <Card className="border-green-100 bg-green-50/50 animate-in fade-in duration-500">
        <CardContent className="pt-6 flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold text-green-900">
              {t('results.keywords.allFoundTitle')}
            </h3>
            <p className="text-sm text-green-700">
              {t('results.keywords.allFoundDesc')}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // DEFAULT STATE: Missing keywords list
  return (
    <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200 border-red-100 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-red-700 text-lg">
          <AlertTriangle className="h-5 w-5" />
          <span>{t('results.keywords.missingTitle')}</span>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {t('results.keywords.missingContext')}
        </p>
      </CardHeader>
      
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {keywords.map((word, index) => (
            <Badge
              key={index}
              variant="destructive" // Using standard destructive variant
              className="px-3 py-1.5 text-sm font-medium bg-red-50 text-red-700 hover:bg-red-100 border-red-200 transition-colors"
            >
              <XCircle className="w-3 h-3 mr-1.5 opacity-70" />
              {word}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
