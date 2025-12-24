// File: src/pages/AtsGuidePage.tsx
import { Bot, FileText, CheckCircle, AlertCircle, Shield, Eye, Brain } from 'lucide-react';

/**
 * ATS Guide Page - Understanding and beating applicant tracking systems
 * Uses Cush Labs writing system with visual elements and varied layout
 */
export function AtsGuidePage() {

  const atsProcess = [
    {
      step: 1,
      icon: Eye,
      title: "Resume Scanning",
      description: "ATS systems first scan and extract text from your resume document.",
      detail: "Optimal formats: PDF, DOCX, or plain text"
    },
    {
      step: 2,
      icon: Brain,
      title: "Keyword Analysis",
      description: "System matches your resume against job description keywords and requirements.",
      detail: "Include exact keywords from the job posting"
    },
    {
      step: 3,
      icon: FileText,
      title: "Content Parsing",
      description: "ATS categorizes your experience, skills, and education into structured data.",
      detail: "Use standard section headers and formatting"
    },
    {
      step: 4,
      icon: CheckCircle,
      title: "Scoring & Ranking",
      description: "Your resume receives a compatibility score compared to other candidates.",
      detail: "Higher scores = better chances of human review"
    }
  ];

  const optimizationTips = [
    {
      category: "Format",
      icon: FileText,
      tips: [
        "Use simple, clean layouts without tables or columns",
        "Choose standard fonts like Arial, Calibri, or Times New Roman",
        "Save as PDF or DOCX (avoid images in PDFs)",
        "Use 10-12pt font size for readability"
      ],
      color: "blue" as const
    },
    {
      category: "Keywords",
      icon: Brain,
      tips: [
        "Mirror exact terminology from job descriptions",
        "Include both acronyms and full terms (e.g., 'KPIs' and 'Key Performance Indicators')",
        "Place important keywords in skills and experience sections",
        "Avoid keyword stuffing - keep it natural"
      ],
      color: "green" as const
    },
    {
      category: "Structure",
      icon: Shield,
      tips: [
        "Use standard section headers (Experience, Education, Skills)",
        "List experience in reverse chronological order",
        "Include dates and locations for each position",
        "Use bullet points for achievements and responsibilities"
      ],
      color: "purple" as const
    }
  ];

  const whatAvoid = [
    "Complex formatting with multiple columns",
    "Headers, footers, or page numbers",
    "Images, charts, or graphics",
    "Unusual fonts or colors",
    "Tables or text boxes",
    "PDFs created from images (scanned resumes)"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 dark:from-gray-900 dark:to-green-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="bg-green-100 dark:bg-green-900 p-4 rounded-full">
              <Bot className="h-12 w-12 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Beat the <span className="text-green-600 dark:text-green-400">ATS Bots</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            75% of resumes are rejected by ATS before human eyes ever see them. 
            Learn how to make your resume machine-readable and human-appealing.
          </p>
        </div>

        {/* ATS Process Timeline */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            How ATS Systems Process Your Resume
          </h2>
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gray-200 dark:bg-gray-700"></div>
            
            <div className="space-y-12">
              {atsProcess.map((item, index) => {
                const isLeft = index % 2 === 0;
                
                return (
                  <div key={index} className={`flex items-center ${isLeft ? 'justify-start' : 'justify-end'}`}>
                    <div className={`w-5/12 ${isLeft ? 'text-right pr-8' : 'text-left pl-8 order-1'}`}>
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                        <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                          {item.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-2">
                          {item.description}
                        </p>
                        <p className="text-sm text-blue-600 dark:text-blue-400">
                          {item.detail}
                        </p>
                      </div>
                    </div>
                    
                    {/* Circle with step number */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold z-10">
                      {item.step}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Optimization Tips Grid */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            ATS Optimization Strategies
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {optimizationTips.map((category, index) => {
              const colorClasses = {
                blue: 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400',
                green: 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400',
                purple: 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400'
              };
              
              return (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <div className={`inline-flex p-3 rounded-lg mb-4 ${colorClasses[category.color]}`}>
                    <category.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    {category.category}
                  </h3>
                  <ul className="space-y-3">
                    {category.tips.map((tip, tipIndex) => (
                      <li key={tipIndex} className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600 dark:text-gray-300 text-sm">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        {/* What to Avoid Section */}
        <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            ⚠️ ATS Killers: What to Avoid
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {whatAvoid.map((item, index) => (
              <div key={index} className="flex items-center bg-white dark:bg-gray-800 rounded-lg p-4">
                <AlertCircle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Success Metrics */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-6">ATS Success Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div>
              <div className="text-3xl font-bold mb-2">98%</div>
              <div className="text-green-100">Parse Success Rate</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">85%</div>
              <div className="text-green-100">Keyword Match Rate</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">4x</div>
              <div className="text-green-100">Higher Interview Rate</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">60%</div>
              <div className="text-green-100">Faster Application Process</div>
            </div>
          </div>
          <button 
            onClick={() => window.location.href = '/analyze'}
            className="bg-white text-green-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors duration-200"
          >
            Test Your Resume Against ATS
          </button>
        </div>

      </div>
    </div>
  );
}

export default AtsGuidePage;
