// File: src/pages/DocsPage.tsx
import React, { useState, useEffect } from 'react';
import { marked } from 'marked';
import { FileText, BookOpen, Code, Lightbulb, Rocket, History, Shield, Wrench, FlaskConical, Target, Smartphone } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Create a local component that doesn't rely on the import
const DocsLayout = ({ children, activeDoc, navigate }: { children: React.ReactNode, activeDoc: string, navigate: (page: string) => void }) => {
  const { t } = useTranslation();

  const navItems = [
    { id: 'index', label: t('docs.nav.index'), icon: FileText },
    { id: 'quick_start', label: t('docs.nav.quickStart'), icon: Rocket },
    { id: 'prd', label: t('docs.nav.prd'), icon: Lightbulb },
    { id: 'roadmap', label: t('docs.nav.roadmap'), icon: Target },
    { id: 'setup', label: t('docs.nav.setup'), icon: Rocket },
    { id: 'security', label: t('docs.nav.security'), icon: Shield },
    { id: 'testing', label: t('docs.nav.testing'), icon: Wrench },
    { id: 'deployment', label: t('docs.nav.deployment'), icon: FlaskConical },
    { id: 'template_usage', label: t('docs.nav.templateUsage'), icon: BookOpen },
    { id: 'mobile_responsiveness', label: t('docs.nav.mobileResponsiveness'), icon: Smartphone },
    { id: 'coding_principles', label: t('docs.nav.codingPrinciples'), icon: Code },
    { id: 'changelog', label: t('docs.nav.changelog'), icon: History },
    { id: 'phase_0', label: t('docs.nav.phase0'), icon: BookOpen },
    { id: 'phase_2', label: t('docs.nav.phase2'), icon: BookOpen },
  ];

  return (
    <div className="md:grid md:grid-cols-12 md:gap-8">
      <aside className="md:col-span-3 lg:col-span-2 mb-6 md:mb-0">
        <nav className="space-y-1 md:sticky md:top-4">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => navigate(`docs/${id}`)}
              className={`flex items-center gap-2 w-full text-left px-3 py-2 rounded-md transition-colors duration-150 ${
                activeDoc === id
                  ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 font-semibold'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm">{label}</span>
            </button>
          ))}
        </nav>
      </aside>
      <div className="md:col-span-9 lg:col-span-10">
        {children}
      </div>
    </div>
  );
};

type DocsPageProps = {
  docName: 'index' | 'quick_start' | 'prd' | 'roadmap' | 'setup' | 'security' | 'testing' | 'deployment' | 'template_usage' | 'mobile_responsiveness' | 'coding_principles' | 'changelog' | 'phase_0' | 'phase_2';
  navigate: (page: string) => void;
};

export function DocsPage({ docName, navigate }: DocsPageProps) {
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchDoc = async () => {
      setLoading(true);
      setError(null);
      let filePath = '/docs/README.md';
      
      if (docName === 'index') {
        filePath = '/README.md';
      } else if (docName === 'quick_start') {
        filePath = '/docs/development/QUICK_START.md';
      } else if (docName === 'prd') {
        filePath = '/docs/product/PRD.md';
      } else if (docName === 'roadmap') {
        filePath = '/docs/product/ROADMAP.md';
      } else if (docName === 'setup') {
        filePath = '/docs/development/SETUP.md';
      } else if (docName === 'security') {
        filePath = '/docs/development/SECURITY.md';
      } else if (docName === 'testing') {
        filePath = '/docs/development/TESTING.md';
      } else if (docName === 'deployment') {
        filePath = '/docs/operations/DEPLOYMENT.md';
      } else if (docName === 'template_usage') {
        filePath = '/docs/development/TEMPLATE_USAGE.md';
      } else if (docName === 'mobile_responsiveness') {
        filePath = '/docs/development/MOBILE_RESPONSIVENESS.md';
      } else if (docName === 'coding_principles') {
        filePath = '/docs/development/CODING_PRINCIPLES.md';
      } else if (docName === 'changelog') {
        filePath = '/docs/development/CHANGELOG.md';
      } else if (docName === 'phase_0') {
        filePath = '/docs/phases/PHASE_0.md';
      } else if (docName === 'phase_2') {
        filePath = '/docs/phases/PHASE_2.md';
      }
      
      try {
        const response = await fetch(filePath, {
          headers: {
            Accept: 'text/plain'
          }
        });
        
        if (!response.ok) {
          throw new Error(t('docs.errors.loadFailed', { filePath, status: response.status }));
        }
        
        const text = await response.text();
        const contentType = response.headers.get('content-type') ?? '';
        const looksLikeHtml =
          contentType.includes('text/html') ||
          text.includes('<html') ||
          text.includes('<head') ||
          text.includes('/@vite/client') ||
          text.includes('<meta');

        if (looksLikeHtml) {
          throw new Error(t('docs.errors.markdownExpectedHtml', { filePath }));
        }
        
        // Parse the markdown to HTML
        const html = await marked.parse(text);
        
        // Make sure html is a string
        if (typeof html === 'string') {
          setContent(html);
        } else {
          setError(t('docs.errors.parsing'));
        }
      } catch (e) {
        const message = e instanceof Error ? e.message : t('docs.errors.unknown');
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchDoc();
  }, [docName, t]);

  return (
    <DocsLayout navigate={navigate} activeDoc={docName}>
      <article className="prose prose-base md:prose-lg dark:prose-invert max-w-none bg-white dark:bg-gray-800/50 p-4 md:p-6 lg:p-8 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
        {loading && <p>{t('docs.loading')}</p>}
        {error && <p className="text-red-500">{t('docs.errorPrefix', { message: error })}</p>}
        {!loading && !error && (
          <div dangerouslySetInnerHTML={{ __html: content }} />
        )}
      </article>
    </DocsLayout>
  );
}
