import { FileText, Sparkles, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

export function HowItWorks() {
  const { t } = useTranslation();

  const steps = [
    {
      number: '1',
      icon: FileText,
      title: t('landing.howItWorks.steps.step1.title'),
      description: t('landing.howItWorks.steps.step1.description'),
      color: 'from-blue-500 to-blue-600',
    },
    {
      number: '2',
      icon: Sparkles,
      title: t('landing.howItWorks.steps.step2.title'),
      description: t('landing.howItWorks.steps.step2.description'),
      color: 'from-purple-500 to-purple-600',
    },
    {
      number: '3',
      icon: CheckCircle,
      title: t('landing.howItWorks.steps.step3.title'),
      description: t('landing.howItWorks.steps.step3.description'),
      color: 'from-green-500 to-green-600',
    },
  ];

  const handleCTA = () => {
    window.history.pushState({}, '', '/analyze');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            {t('landing.howItWorks.heading')}
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            {t('landing.howItWorks.subheading')}
          </p>
        </div>

        {/* Steps */}
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 md:gap-4 relative">
            {/* Connection lines (desktop only) */}
            <div className="hidden md:block absolute top-16 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 via-purple-200 to-green-200 -z-10" />

            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="relative">
                  {/* Step Card */}
                  <div className="text-center">
                    {/* Icon Circle */}
                    <div className="relative inline-block mb-6">
                      <div className={`w-32 h-32 bg-gradient-to-br ${step.color} rounded-full flex items-center justify-center shadow-lg`}>
                        <Icon className="w-14 h-14 text-white" />
                      </div>
                      {/* Step Number Badge */}
                      <div className="absolute -top-2 -right-2 w-10 h-10 bg-white border-4 border-slate-100 rounded-full flex items-center justify-center shadow-md">
                        <span className="text-lg font-bold text-slate-900">{step.number}</span>
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="text-2xl font-bold text-slate-900 mb-3">
                      {step.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  {/* Arrow (mobile only) */}
                  {index < steps.length - 1 && (
                    <div className="md:hidden flex justify-center my-6">
                      <ArrowRight className="w-6 h-6 text-slate-300 rotate-90" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <Button
            size="lg"
            onClick={handleCTA}
            className="text-lg px-10 py-6 bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all"
          >
            {t('landing.howItWorks.cta')}
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}