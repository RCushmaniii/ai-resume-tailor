import { CheckCircle2 } from 'lucide-react';

interface PresentKeywordsListProps {
  keywords: string[];
}

export function PresentKeywordsList({ keywords }: PresentKeywordsListProps) {
  if (!keywords || keywords.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <CheckCircle2 className="h-5 w-5 text-green-600" />
        <h3 className="text-lg font-semibold text-gray-900">
          Keywords Found ({keywords.length})
        </h3>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {keywords.map((keyword, index) => (
          <span
            key={index}
            className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200"
          >
            {keyword}
          </span>
        ))}
      </div>
      
      <p className="mt-3 text-sm text-gray-600">
        Great! Your resume includes these key terms from the job description.
      </p>
    </div>
  );
}
