// File: src/pages/ResumeTipsPage.tsx
import { CheckCircle, Users, Target, Zap, Award } from 'lucide-react';

/**
 * Resume Tips Page - Professional resume optimization guide
 * Uses Cush Labs writing system for engaging, conversion-focused content
 */
export function ResumeTipsPage() {

  const tips = [
    {
      icon: Target,
      title: "Tailor for Each Job",
      description: "Customize your resume for every application. Match keywords from the job description exactly.",
      stat: "75% higher response rate"
    },
    {
      icon: Users,
      title: "Quantify Achievements",
      description: "Use numbers to show impact. 'Increased sales by 30%' beats 'Improved sales performance.'",
      stat: "40% more interviews"
    },
    {
      icon: Zap,
      title: "Action Verbs Only",
      description: "Start every bullet point with strong action verbs. Avoid passive language and weak phrases.",
      stat: "2x more engaging"
    },
    {
      icon: Users,
      title: "Human-Readable First",
      description: "Write for humans, then optimize for ATS. Clear, compelling content beats keyword stuffing.",
      stat: "3x better readability"
    },
    {
      icon: CheckCircle,
      title: "Proofread Ruthlessly",
      description: "Typos kill credibility. Use tools, read aloud, and have others review your resume.",
      stat: "Zero tolerance policy"
    },
    {
      icon: Award,
      title: "Highlight Results",
      description: "Focus on outcomes, not responsibilities. Show how you made things better.",
      stat: "50% stronger impact"
    }
  ];

  const commonMistakes = [
    "Using a generic one-size-fits-all resume",
    "Including irrelevant work experience",
    "Using passive voice instead of action verbs",
    "Forgetting to quantify achievements",
    "Ignoring ATS optimization completely",
    "Having typos or grammatical errors"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Resume Tips That <span className="text-blue-600 dark:text-blue-400">Actually Work</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Transform your resume from overlooked to outstanding. These proven strategies help job seekers 
            land 3x more interviews in today's competitive market.
          </p>
        </div>

        {/* Stats Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">3x</div>
              <div className="text-gray-600 dark:text-gray-300">More Interviews</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">75%</div>
              <div className="text-gray-600 dark:text-gray-300">Higher Response Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">90%</div>
              <div className="text-gray-600 dark:text-gray-300">ATS Pass Rate</div>
            </div>
          </div>
        </div>

        {/* Tips Grid */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            6 Resume Transformations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tips.map((tip, index) => {
              const Icon = tip.icon;
              return (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                  <div className="flex items-center mb-4">
                    <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg mr-4">
                      <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{tip.title}</h3>
                      <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">{tip.stat}</p>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">{tip.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Common Mistakes Section */}
        <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            🚫 Resume Killers to Avoid
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {commonMistakes.map((mistake, index) => (
              <div key={index} className="flex items-center">
                <div className="bg-red-100 dark:bg-red-900 p-2 rounded-full mr-4">
                  <svg className="h-4 w-4 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <span className="text-gray-700 dark:text-gray-300">{mistake}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Action Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Optimize Your Resume?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Get instant AI-powered analysis and personalized recommendations
          </p>
          <button 
            onClick={() => window.location.href = '/analyze'}
            className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors duration-200"
          >
            Analyze My Resume Now
          </button>
        </div>

      </div>
    </div>
  );
}

export default ResumeTipsPage;
