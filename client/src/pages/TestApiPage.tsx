import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';

export default function TestApiPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
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
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
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
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">API Test Page</h1>
        <p className="text-muted-foreground">
          Test the connection between React frontend and Flask backend
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Health Check Endpoint</CardTitle>
            <CardDescription>
              Test GET /api/health to verify backend is running
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={testHealthEndpoint} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Test Health Endpoint
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Analyze Endpoint</CardTitle>
            <CardDescription>
              Test POST /api/analyze with mock resume data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={testAnalyzeEndpoint} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Test Analyze Endpoint
            </Button>
          </CardContent>
        </Card>

        {error && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Error:</strong> {error}
              <br />
              <span className="text-sm mt-2 block">
                Make sure Flask backend is running on port 5000: <code>pnpm dev:server</code>
              </span>
            </AlertDescription>
          </Alert>
        )}

        {result && (
          <Alert>
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>
              <strong>Success!</strong> Backend responded:
              <pre className="mt-2 p-4 bg-muted rounded-md overflow-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </AlertDescription>
          </Alert>
        )}
      </div>

      <div className="mt-8 p-4 bg-muted rounded-lg">
        <h3 className="font-semibold mb-2">Instructions:</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>Start Flask backend: <code className="bg-background px-2 py-1 rounded">pnpm dev:server</code></li>
          <li>Start React frontend: <code className="bg-background px-2 py-1 rounded">pnpm dev:client</code></li>
          <li>Click the buttons above to test API endpoints</li>
        </ol>
      </div>
    </div>
  );
}
