export interface AnalysisResult {
  match_score: number;
  breakdown: {
    keywords: number;
    semantic: number;
    tone: number;
  };
  missing_keywords: Array<{
    word: string;
    priority: 'high' | 'medium' | 'low';
  }>;
  suggestions: string[];
}

export const getMockAnalysisResult = (): AnalysisResult => ({
  match_score: 82,
  breakdown: {
    keywords: 85,
    semantic: 78,
    tone: 88
  },
  missing_keywords: [
    { word: 'project management', priority: 'high' },
    { word: 'stakeholder communication', priority: 'high' },
    { word: 'Agile methodology', priority: 'medium' },
    { word: 'budget planning', priority: 'medium' },
    { word: 'Jira', priority: 'low' },
    { word: 'Scrum', priority: 'low' }
  ],
  suggestions: [
    'Add measurable achievements to your experience section (e.g., "increased team productivity by 25%")',
    'Include relevant certifications mentioned in the job posting',
    'Use more action verbs that match the job description language',
    'Quantify your project outcomes with specific metrics',
    'Highlight leadership experience and team collaboration skills'
  ]
});
