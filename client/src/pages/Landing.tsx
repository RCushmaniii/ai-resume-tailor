import { SEO } from '@/components/SEO';
import { Hero } from '@/components/landing/Hero';
import { ProblemSection } from '@/components/landing/ProblemSection';
import { FeaturesGrid } from '@/components/landing/FeaturesGrid';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { StatsBar } from '@/components/landing/StatsBar';
import { FAQ } from '@/components/landing/FAQ';
import { FinalCTA } from '@/components/landing/FinalCTA';

export function Landing() {
  return (
    <>
      <SEO
        title="AI Resume Tailor - Get Your Resume Past ATS in 60 Seconds"
        description="Free AI-powered resume analysis tool. Get instant match scores, missing keywords, and actionable suggestions to optimize your resume for any job. No signup required."
        keywords="resume analyzer, ATS checker, resume optimization, AI resume tool, job application, resume keywords, free resume checker, resume match score"
        canonical="https://airesumatailor.com"
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
