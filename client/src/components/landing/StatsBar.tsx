import { useTranslation } from 'react-i18next';

export function StatsBar() {
  const { t } = useTranslation();

  const stats = [
    {
      value: '10,000+',
      label: t('landing.stats.resumesAnalyzed'),
    },
    {
      value: '85%',
      label: t('landing.stats.averageMatchScore'),
    },
    {
      value: '60 sec',
      label: t('landing.stats.averageAnalysisTime'),
    },
    {
      value: '100%',
      label: t('landing.stats.freeForever'),
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-700">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                {stat.value}
              </div>
              <div className="text-blue-100 text-sm md:text-base font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}