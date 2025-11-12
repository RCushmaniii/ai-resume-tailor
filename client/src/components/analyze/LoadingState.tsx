import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

export function LoadingState() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Loading message */}
      <div className="text-center py-4">
        <p className="text-lg text-muted-foreground animate-pulse">
          Analyzing your resume...
        </p>
      </div>

      {/* Score card skeleton */}
      <Card className="p-8">
        <div className="flex flex-col items-center space-y-4">
          <Skeleton className="h-24 w-24 rounded-full" />
          <Skeleton className="h-6 w-32" />
        </div>
      </Card>

      {/* Breakdown skeleton */}
      <Card className="p-6">
        <Skeleton className="h-6 w-48 mb-4" />
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
      </Card>

      {/* Missing keywords skeleton */}
      <Card className="p-6">
        <Skeleton className="h-6 w-48 mb-4" />
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-8 w-28" />
          <Skeleton className="h-8 w-36" />
          <Skeleton className="h-8 w-24" />
        </div>
      </Card>

      {/* Suggestions skeleton */}
      <Card className="p-6">
        <Skeleton className="h-6 w-48 mb-4" />
        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-full" />
        </div>
      </Card>
    </div>
  );
}
