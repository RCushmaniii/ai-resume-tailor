// File: src/App.tsx
import { useState, useEffect, lazy, Suspense } from 'react';
import { Toaster } from 'sonner';
import { useTranslation } from 'react-i18next';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { Landing } from './pages/Landing';
import { SignInPromptProvider } from './contexts/SignInPromptContext';

// Lazy load pages for code splitting
const DocsPage = lazy(() => import('./pages/DocsPage').then(m => ({ default: m.DocsPage })));
const ExamplesPage = lazy(() => import('./pages/ExamplesPage').then(m => ({ default: m.ExamplesPage })));
const ComponentsPage = lazy(() => import('./pages/Components').then(m => ({ default: m.ComponentsPage })));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then(m => ({ default: m.NotFoundPage })));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage').then(m => ({ default: m.PrivacyPolicyPage })));
const TermsOfServicePage = lazy(() => import('./pages/TermsOfServicePage').then(m => ({ default: m.TermsOfServicePage })));
const CookiesPolicyPage = lazy(() => import('./pages/CookiesPolicyPage').then(m => ({ default: m.CookiesPolicyPage })));
const TestApiPage = lazy(() => import('./pages/TestApiPage'));
const Analyze = lazy(() => import('./pages/Analyze').then(m => ({ default: m.Analyze })));
const MethodologyPage = lazy(() => import('./pages/MethodologyPage'));

// Define the possible pages in our application
export type Page = 'home' | 'components' | 'docs' | 'examples' | 'privacy' | 'terms' | 'cookie' | 'test-api' | 'analyze' | 'methodology' | 'not-found';

function App() {
  const { t } = useTranslation();

  // Parse the current URL to determine the initial page and doc
  const getInitialRouteFromUrl = () => {
    const path = window.location.pathname.slice(1) || 'home'; // Default to home page
    const [page, subpage] = path.split('/');
    
    // Check if the page is valid
    const validPages = [
      'home',
      'docs',
      'privacy',
      'terms',
      'cookie',
      'analyze',
      'methodology',
      ...(import.meta.env.DEV ? (['components', 'examples', 'test-api'] as const) : []),
    ];
    const isValidPage = validPages.includes(page);
    
    // If docs page, check if the subpage is valid
    let isValidSubpage = true;
    if (page === 'docs') {
      const validSubpages = ['index', 'quick_start', 'prd', 'roadmap', 'setup', 'security', 'testing', 'deployment', 'template_usage', 'mobile_responsiveness', 'coding_principles', 'changelog', 'phase_0', 'phase_1', 'phase_2'];
      isValidSubpage = !subpage || validSubpages.includes(subpage);
    }
    
    return {
      currentPage: isValidPage && (page !== 'docs' || isValidSubpage) ? page as Page : 'not-found',
      currentDoc: subpage || 'index'
    };
  };

  const { currentPage: initialPage, currentDoc: initialDoc } = getInitialRouteFromUrl();
  const [currentPage, setCurrentPage] = useState<Page>(initialPage);
  const [currentDoc, setCurrentDoc] = useState<string>(initialDoc);

  const handleNavClick = (page: string) => {
    if (!import.meta.env.DEV && ['components', 'examples', 'test-api'].includes(page)) {
      setCurrentPage('not-found');
      window.history.pushState(null, '', `/not-found`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Check if it's a docs page with a specific doc
    if (page.startsWith('docs/')) {
      const docName = page.split('/')[1];
      setCurrentDoc(docName);
      setCurrentPage('docs');
      // Update URL without reloading the page
      window.history.pushState(null, '', `/${page}`);
    } else {
      setCurrentPage(page as Page);
      // Update URL without reloading the page
      window.history.pushState(null, '', `/${page}`);
    }
    
    // Scroll to top when navigating to a new page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const { currentPage, currentDoc } = getInitialRouteFromUrl();
      setCurrentPage(currentPage);
      setCurrentDoc(currentDoc);
      // Scroll to top when using browser back/forward
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // This function decides which page component to render
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <Landing />;
      case 'components':
        if (!import.meta.env.DEV) return <NotFoundPage />;
        return <ComponentsPage />;
      case 'docs':
        return <DocsPage docName={currentDoc as 'index' | 'quick_start' | 'prd' | 'roadmap' | 'setup' | 'security' | 'testing' | 'deployment' | 'template_usage' | 'mobile_responsiveness' | 'coding_principles' | 'changelog'} navigate={handleNavClick} />;
      case 'examples':
        if (!import.meta.env.DEV) return <NotFoundPage />;
        return <ExamplesPage />;
      case 'privacy':
        return <PrivacyPolicyPage />;
      case 'terms':
        return <TermsOfServicePage />;
      case 'cookie':
        return <CookiesPolicyPage />;
      case 'test-api':
        if (!import.meta.env.DEV) return <NotFoundPage />;
        return <TestApiPage />;
      case 'analyze':
        return <Analyze />;
      case 'methodology':
        return <MethodologyPage />;
      case 'not-found':
        return <NotFoundPage />;
      default:
        return <Landing />;
    }
  };

  return (
    <SignInPromptProvider>
      <div className="flex flex-col min-h-screen bg-white">
        <Toaster position="top-center" richColors closeButton />
        <Header navigate={handleNavClick} />
        <main className={currentPage === 'home' ? 'flex-grow' : 'flex-grow container mx-auto px-4 py-8'}>
          <Suspense fallback={
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">{t('app.loading')}</p>
              </div>
            </div>
          }>
            {renderCurrentPage()}
          </Suspense>
        </main>
        <Footer navigate={handleNavClick} />
      </div>
    </SignInPromptProvider>
  );
}

export default App;