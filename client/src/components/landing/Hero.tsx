import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight, ChevronDown } from 'lucide-react';
import heroImage from '@/assets/images/hero.jpg';
import { useTranslation } from 'react-i18next';

export function Hero() {
  const { t } = useTranslation();

  const handleCTA = (e: React.MouseEvent) => {
    e.preventDefault();
    window.history.pushState({}, '', '/analyze');
    const popStateEvent = new PopStateEvent('popstate', { state: null });
    window.dispatchEvent(popStateEvent);
    setTimeout(() => {
      if (window.location.pathname !== '/analyze') {
        window.location.href = '/analyze';
      }
    }, 100);
  };

  const handleScrollToHowItWorks = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById('how-it-works');
    if (el) {
      const headerOffset = 100;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-slate-50">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />

      <div className="container mx-auto px-4 py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Content */}
          <div className="space-y-8 text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              {t('landing.hero.badge')}
            </div>

            {/* Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
              {t('landing.hero.headlinePrefix')}{' '}
              <span className="text-blue-600">{t('landing.hero.headlineAts')}</span>
              <br />
              {t('landing.hero.headlineSuffix')}
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-2xl">
              {t('landing.hero.subheadlinePrefix')}{' '}
              <span className="font-semibold text-slate-900">{t('landing.hero.subheadlineEmphasis')}</span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center">
              <Button
                size="lg"
                onClick={handleCTA}
                className="text-lg px-8 py-6 bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all relative z-10 cursor-pointer"
                type="button"
              >
                {t('landing.hero.cta')}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <a
                href="#how-it-works"
                onClick={handleScrollToHowItWorks}
                className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors"
              >
                {t('landing.hero.secondaryCta')}
                <ChevronDown className="w-4 h-4" />
              </a>
            </div>

            {/* Social Proof */}
            <p className="text-sm text-slate-500">
              ✨ {t('landing.hero.socialProofPrefix')}{' '}
              <span className="font-semibold text-slate-700">{t('landing.hero.socialProofHighlight')}</span>{' '}
              {t('landing.hero.socialProofSuffix')}
            </p>
          </div>

          {/* Right: Hero Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-8 border-white">
              <img
                src={heroImage}
                alt={t('landing.hero.heroImageAlt')}
                width={1920}
                height={1080}
                className="w-full h-auto object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement!.style.background =
                    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                  e.currentTarget.parentElement!.style.minHeight = '400px';
                }}
              />
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl p-4 border border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">✓</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{t('landing.hero.floatingBadgeMatch')}</p>
                  <p className="text-xs text-slate-500">{t('landing.hero.floatingBadgeLabel')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SEO body copy — keyword-rich text for search engines */}
        <div className="mt-20 max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
            {t('landing.hero.seoHeading')}
          </h2>
          <p className="text-base text-slate-600 leading-relaxed">
            {t('landing.hero.seoCopy')}
          </p>
        </div>
      </div>

      {/* Wave decoration at bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
}
