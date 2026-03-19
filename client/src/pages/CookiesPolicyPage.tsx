// File: src/pages/CookiesPolicyPage.tsx
import { MarkdownContent } from '../components/layout/MarkdownContent';
import { LegalLayout } from '../components/layout/LegalLayout';
import { SEO } from '@/components/SEO';

/**
 * Page component for displaying the Cookies Policy
 * Production-ready cookies policy with Cush Labs professional voice
 */
export function CookiesPolicyPage() {

  return (
    <>
      <SEO
        title="Cookie Policy - AI Resume Tailor"
        description="Cookie policy for AI Resume Tailor. Learn about the cookies we use and how to manage your preferences."
        path="/cookie"
      />
      <LegalLayout
        title="Cookie Policy"
        lastUpdated="December 23, 2025"
      >
      <MarkdownContent 
        filePath="legal/cookie-policy.md" 
      />
    </LegalLayout>
    </>
  );
}

export default CookiesPolicyPage;
