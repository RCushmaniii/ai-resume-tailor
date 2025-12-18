// File: src/pages/TermsOfServicePage.tsx
import { MarkdownContent } from '../components/layout/MarkdownContent';
import { LegalLayout } from '../components/layout/LegalLayout';
import { useTranslation } from 'react-i18next';

/**
 * Page component for displaying the Terms of Service
 * Follows SRP by focusing only on the terms of service page
 */
export function TermsOfServicePage() {
  const { t } = useTranslation();

  return (
    <LegalLayout 
      title={t('legal.terms.title')} 
      lastUpdated="September 29, 2025"
    >
      <MarkdownContent 
        filePath="legal/terms-of-service.md" 
      />
    </LegalLayout>
  );
}

export default TermsOfServicePage;
