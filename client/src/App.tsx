// File: src/App.tsx
import { useState, useEffect } from 'react';
import { Toaster } from 'sonner';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { Landing } from './pages/Landing';
import { DocsPage } from './pages/DocsPage';
import { ExamplesPage } from './pages/ExamplesPage';
import { ComponentsPage } from './pages/Components';
import { NotFoundPage } from './pages/NotFoundPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsOfServicePage } from './pages/TermsOfServicePage';
import TestApiPage from './pages/TestApiPage';
import { Analyze } from './pages/Analyze';

// Define the possible pages in our application
export type Page = 'home' | 'components' | 'docs' | 'examples' | 'privacy' | 'terms' | 'test-api' | 'analyze' | 'not-found';

function App() {
  // Parse the current URL to determine the initial page and doc
  const getInitialRouteFromUrl = () => {
    const path = window.location.pathname.slice(1) || 'home'; // Default to home page
    const [page, subpage] = path.split('/');
    
    // Check if the page is valid
    const validPages = ['home', 'components', 'docs', 'examples', 'privacy', 'terms', 'test-api', 'analyze'];
    const isValidPage = validPages.includes(page);
    
    // If docs page, check if the subpage is valid
    let isValidSubpage = true;
    if (page === 'docs') {
      const validSubpages = ['readme', 'quick_start', 'template_usage', 'mobile_responsiveness', 'core_coding_principals', 'changelog', 'prd', 'next_steps'];
      isValidSubpage = validSubpages.includes(subpage);
    }
    
    return {
      currentPage: isValidPage && (page !== 'docs' || isValidSubpage) ? page as Page : 'not-found',
      currentDoc: subpage || 'readme'
    };
  };

  const { currentPage: initialPage, currentDoc: initialDoc } = getInitialRouteFromUrl();
  const [currentPage, setCurrentPage] = useState<Page>(initialPage);
  const [currentDoc, setCurrentDoc] = useState<string>(initialDoc);

  const handleNavClick = (page: string) => {
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
        return <ComponentsPage />;
      case 'docs':
        return <DocsPage docName={currentDoc as 'readme' | 'quick_start' | 'template_usage' | 'mobile_responsiveness' | 'core_coding_principals' | 'changelog' | 'prd' | 'next_steps'} navigate={handleNavClick} />;
      case 'examples':
        return <ExamplesPage />;
      case 'privacy':
        return <PrivacyPolicyPage />;
      case 'terms':
        return <TermsOfServicePage />;
      case 'test-api':
        return <TestApiPage />;
      case 'analyze':
        return <Analyze />;
      case 'not-found':
        return <NotFoundPage />;
      default:
        return <Landing />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Toaster position="top-center" richColors closeButton />
      <Header navigate={handleNavClick} />
      <main className={currentPage === 'home' ? 'flex-grow' : 'flex-grow container mx-auto px-4 py-8'}>
        {renderCurrentPage()}
      </main>
      <Footer navigate={handleNavClick} />
    </div>
  );
}

export default App;