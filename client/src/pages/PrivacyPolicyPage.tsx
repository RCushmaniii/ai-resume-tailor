// File: src/pages/PrivacyPolicyPage.tsx
import { MarkdownContent } from '../components/layout/MarkdownContent';
import { LegalLayout } from '../components/layout/LegalLayout';
import { useTranslation } from 'react-i18next';

/**
 * Page component for displaying the Privacy Policy
 * Follows SRP by focusing only on the privacy policy page
 */
export function PrivacyPolicyPage() {
  const { t } = useTranslation();

  return (
    <LegalLayout 
      title={t('legal.privacy.title')} 
      lastUpdated="September 29, 2025"
    >
      <MarkdownContent 
        filePath="legal/privacy-policy.md" 
      />
    </LegalLayout>
  );
}

export default PrivacyPolicyPage;