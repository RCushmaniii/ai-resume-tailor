import { Bot, Target, Clock } from 'lucide-react';

export function ProblemSection() {
  const problems = [
    {
      icon: Bot,
      title: 'ATS Rejection',
      description: '75% of resumes get auto-rejected by applicant tracking systems before a human ever sees them.',
      color: 'text-red-600 bg-red-100',
    },
    {
      icon: Target,
      title: 'Missing Keywords',
      description: 'Recruiters scan for specific terms. Without them, your resume goes straight to the "no" pile.',
      color: 'text-amber-600 bg-amber-100',
    },
    {
      icon: Clock,
      title: 'Takes Too Long',
      description: 'Customizing your resume for each job posting wastes hours you could spend networking.',
      color: 'text-blue-600 bg-blue-100',
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Why Aren't You Getting Interviews?
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Even qualified candidates struggle to get past the first filter
          </p>
        </div>

        {/* Problems Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {problems.map((problem, index) => {
            const Icon = problem.icon;
            return (
              <div
                key={index}
                className="text-center p-8 rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all"
              >
                <div className={`w-16 h-16 ${problem.color} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                  <Icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {problem.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {problem.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
