import { SEO } from '@/components/SEO';
import { Hero } from '@/components/landing/Hero';
import { ProblemSection } from '@/components/landing/ProblemSection';
import { FeaturesGrid } from '@/components/landing/FeaturesGrid';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { StatsBar } from '@/components/landing/StatsBar';
import { FAQ } from '@/components/landing/FAQ';
import { FinalCTA } from '@/components/landing/FinalCTA';
import { useTranslation } from 'react-i18next';

export function Landing() {
  const { t } = useTranslation();

  return (
    <>
      <SEO
        title={t('seo.landing.title')}
        description={t('seo.landing.description')}
        keywords={t('seo.landing.keywords')}
        canonical={t('seo.landing.canonical')}
      />
      <div className="min-h-screen">
        <Hero />
        <ProblemSection />
        <FeaturesGrid />
        <HowItWorks />
        <StatsBar />
        <FAQ />
        <FinalCTA />
      </div>
    </>
  );
}