const AnalysisSkeleton = () => {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-pulse">
      
      {/* Hero Section Skeleton */}
      <div className="bg-white rounded-2xl p-8 border border-gray-100 flex flex-col md:flex-row items-center gap-8 h-64">
        <div className="w-40 h-40 rounded-full bg-gray-200 flex-shrink-0" />
        <div className="flex-1 w-full space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-2/3" />
        </div>
      </div>

      {/* Grid Section Skeleton */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Keywords */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 h-64 space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/2" />
          <div className="flex flex-wrap gap-2 pt-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-8 w-24 bg-gray-200 rounded-full" />
            ))}
          </div>
        </div>

        {/* Score Bars */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 h-64 space-y-6">
          <div className="h-6 bg-gray-200 rounded w-1/2" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between">
                <div className="h-4 w-20 bg-gray-200 rounded" />
                <div className="h-4 w-10 bg-gray-200 rounded" />
              </div>
              <div className="h-2 w-full bg-gray-200 rounded-full" />
            </div>
          ))}
        </div>
      </div>

      {/* Suggestions Skeleton */}
      <div className="bg-white rounded-2xl p-8 border border-gray-100 space-y-4">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-6" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-gray-200 rounded-lg border border-gray-100" />
        ))}
      </div>
    </div>
  );
};

export default AnalysisSkeleton;
