import { Bot, Target, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function ProblemSection() {
  const { t } = useTranslation();

  const problems = [
    {
      icon: Bot,
      title: t('landing.problem.cards.atsRejection.title'),
      description: t('landing.problem.cards.atsRejection.description'),
      color: 'text-red-600 bg-red-100',
    },
    {
      icon: Target,
      title: t('landing.problem.cards.missingKeywords.title'),
      description: t('landing.problem.cards.missingKeywords.description'),
      color: 'text-amber-600 bg-amber-100',
    },
    {
      icon: Clock,
      title: t('landing.problem.cards.takesTooLong.title'),
      description: t('landing.problem.cards.takesTooLong.description'),
      color: 'text-blue-600 bg-blue-100',
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            {t('landing.problem.heading')}
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            {t('landing.problem.subheading')}
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
