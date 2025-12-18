import { Zap, Target, BarChart, Sparkles, Shield, Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function FeaturesGrid() {
  const { t } = useTranslation();

  const features = [
    {
      icon: Zap,
      title: t('landing.features.cards.matchScore.title'),
      description: t('landing.features.cards.matchScore.description'),
      color: 'text-blue-600 bg-blue-50',
    },
    {
      icon: Target,
      title: t('landing.features.cards.missingKeywords.title'),
      description: t('landing.features.cards.missingKeywords.description'),
      color: 'text-amber-600 bg-amber-50',
    },
    {
      icon: BarChart,
      title: t('landing.features.cards.analysis3Part.title'),
      description: t('landing.features.cards.analysis3Part.description'),
      color: 'text-purple-600 bg-purple-50',
    },
    {
      icon: Sparkles,
      title: t('landing.features.cards.smartSuggestions.title'),
      description: t('landing.features.cards.smartSuggestions.description'),
      color: 'text-green-600 bg-green-50',
    },
    {
      icon: Shield,
      title: t('landing.features.cards.private.title'),
      description: t('landing.features.cards.private.description'),
      color: 'text-slate-600 bg-slate-50',
    },
    {
      icon: Heart,
      title: t('landing.features.cards.free.title'),
      description: t('landing.features.cards.free.description'),
      color: 'text-red-600 bg-red-50',
    },
  ];

  return (
    <section id="features" className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            {t('landing.features.heading')}
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            {t('landing.features.subheading')}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-xl transition-all group"
              >
                <div className={`w-14 h-14 ${feature.color} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
