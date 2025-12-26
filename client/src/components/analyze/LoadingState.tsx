import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

export function LoadingState() {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* 1. HERO SECTION SKELETON (Matches AnalysisReport Header) */}
      <Card className="p-8 border-gray-100 shadow-sm">
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Circle Placeholder (Matches the Score Circle) */}
          <Skeleton className="h-40 w-40 rounded-full flex-shrink-0" />
          
          {/* Summary Text Placeholders */}
          <div className="flex-1 space-y-4 w-full text-center md:text-left">
            <Skeleton className="h-8 w-1/3 mb-2 mx-auto md:mx-0" /> {/* Title */}
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3 mx-auto md:mx-0" />
            
            {/* Metadata badge placeholder */}
            <div className="pt-2 flex justify-center md:justify-start">
              <Skeleton className="h-4 w-32" /> 
            </div>
          </div>
        </div>
      </Card>

      {/* 2. GRID SECTION (Matches Keywords & Scoring Columns) */}
      <div className="grid md:grid-cols-2 gap-8">
        
        {/* Left Col: Keywords Skeleton */}
        <Card className="p-6 border-gray-100 shadow-sm space-y-6">
          <Skeleton className="h-6 w-1/2" /> {/* Section Title */}
          
          {/* Missing Keywords (Critical) */}
          <div className="space-y-3">
             <Skeleton className="h-4 w-1/3 mb-2" /> 
             <div className="flex flex-wrap gap-2">
               {[1, 2, 3].map((i) => (
                 <Skeleton key={i} className="h-8 w-24 rounded-full" />
               ))}
             </div>
          </div>

          {/* Present Keywords */}
          <div className="space-y-3">
             <Skeleton className="h-4 w-1/3 mb-2" /> 
             <div className="flex flex-wrap gap-2">
               {[1, 2, 3, 4].map((i) => (
                 <Skeleton key={i} className="h-8 w-24 rounded-full" />
               ))}
             </div>
          </div>
        </Card>

        {/* Right Col: Score Breakdown Skeleton */}
        <Card className="p-6 border-gray-100 shadow-sm space-y-6">
          <Skeleton className="h-6 w-1/2" /> {/* Section Title */}
          {/* 3 Progress Bars */}
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-8" />
              </div>
              <Skeleton className="h-2 w-full rounded-full" />
            </div>
          ))}
        </Card>
      </div>

      {/* 3. SUGGESTIONS SKELETON (Matches Optimization Plan Cards) */}
      <Card className="p-8 border-gray-100 shadow-sm space-y-6">
        <Skeleton className="h-7 w-48" /> {/* Title */}
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 border rounded-lg flex gap-4">
               {/* Icon Placeholder */}
               <Skeleton className="h-5 w-5 rounded-full flex-shrink-0" />
               {/* Text Placeholder */}
               <div className="space-y-2 w-full">
                 <Skeleton className="h-5 w-1/4" />
                 <Skeleton className="h-4 w-3/4" />
               </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
