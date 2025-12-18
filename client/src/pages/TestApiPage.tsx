import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

function stringifyResult(value: unknown): string {
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

export default function TestApiPage() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<unknown>(null);
  const [error, setError] = useState<string | null>(null);

  const testHealthEndpoint = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/health');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('markdown.errors.unknown'));
    } finally {
      setLoading(false);
    }
  };

  const testAnalyzeEndpoint = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resume: 'Sample resume text',
          job_description: 'Sample job description',
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('markdown.errors.unknown'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">{t('testApi.title')}</h1>
        <p className="text-muted-foreground">{t('testApi.description')}</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('testApi.health.title')}</CardTitle>
            <CardDescription>{t('testApi.health.description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={testHealthEndpoint} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t('testApi.health.action')}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('testApi.analyze.title')}</CardTitle>
            <CardDescription>{t('testApi.analyze.description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={testAnalyzeEndpoint} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t('testApi.analyze.action')}
            </Button>
          </CardContent>
        </Card>

        {error && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>{t('testApi.alerts.errorTitle')}:</strong> {error}
              <br />
              <span className="text-sm mt-2 block">
                {t('testApi.alerts.backendRunningHint')}: <code>pnpm dev:server</code>
              </span>
            </AlertDescription>
          </Alert>
        )}

        {result !== null && (
          <Alert>
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>
              <strong>{t('testApi.alerts.successTitle')}</strong> {t('testApi.alerts.backendResponded')}
              <pre className="mt-2 p-4 bg-muted rounded-md overflow-auto">
                {stringifyResult(result)}
              </pre>
            </AlertDescription>
          </Alert>
        )}
      </div>

      <div className="mt-8 p-4 bg-muted rounded-lg">
        <h3 className="font-semibold mb-2">{t('testApi.instructions.title')}</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>{t('testApi.instructions.steps.startBackend')}: <code className="bg-background px-2 py-1 rounded">pnpm dev:server</code></li>
          <li>{t('testApi.instructions.steps.startFrontend')}: <code className="bg-background px-2 py-1 rounded">pnpm dev:client</code></li>
          <li>{t('testApi.instructions.steps.clickButtons')}</li>
        </ol>
      </div>
    </div>
  );
}
