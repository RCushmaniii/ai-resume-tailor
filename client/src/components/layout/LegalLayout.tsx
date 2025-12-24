// File: src/components/layout/LegalLayout.tsx
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
interface LegalLayoutProps {
  children: ReactNode;
  title: string;
  lastUpdated?: string;
}
/**
 * Layout component for legal pages like Privacy Policy and Terms of Service
 * Follows SoC by handling only the layout structure
 */
export function LegalLayout({ children, title, lastUpdated }: LegalLayoutProps) {
  const { t } = useTranslation();

  // Define the cobalt blue color for use in styles
  const cobaltBlue = '#0047ab';
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 pb-6 border-b border-gray-200">
          <h1 className="text-3xl font-bold mb-2" style={{ color: cobaltBlue }}>{title}</h1>
          {lastUpdated && (
            <p className="text-sm text-gray-500">{t('legal.lastUpdatedLabel')} {lastUpdated}</p>
          )}
        </header>
        
        <div className="space-y-6">
          {children}
        </div>
        
        <footer className="mt-12 pt-6 border-t border-gray-200 text-sm text-gray-500">
          <p>
            {t('legal.footer.contact', { title })}
          </p>
        </footer>
      </div>
    </div>
  );
}

export default LegalLayout;