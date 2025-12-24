// File: src/pages/CookiesPolicyPage.tsx
import { MarkdownContent } from '../components/layout/MarkdownContent';
import { LegalLayout } from '../components/layout/LegalLayout';

/**
 * Page component for displaying the Cookies Policy
 * Production-ready cookies policy with Cush Labs professional voice
 */
export function CookiesPolicyPage() {

  return (
    <LegalLayout 
      title="Cookie Policy" 
      lastUpdated="December 23, 2025"
    >
      <MarkdownContent 
        filePath="legal/cookie-policy.md" 
      />
    </LegalLayout>
  );
}

export default CookiesPolicyPage;
