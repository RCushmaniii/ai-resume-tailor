// File: src/components/layout/Header.tsx
import { useState } from 'react';

type HeaderProps = {
  navigate: (page: string) => void;
};

export function Header({ navigate }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavClick = (page: string) => {
    setIsMenuOpen(false);
    
    // Handle anchor links (e.g., "home#how-it-works")
    if (page.includes('#')) {
      const [pageName, anchor] = page.split('#');
      navigate(pageName || 'home');
      
      // Wait for navigation, then scroll to anchor
      setTimeout(() => {
        const element = document.getElementById(anchor);
        if (element) {
          const headerOffset = 100; // Account for sticky header height
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 100);
    } else {
      navigate(page);
    }
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">
          {/* Logo and Branding */}
          <div className="flex-shrink-0">
            <a href="/" onClick={(e) => { e.preventDefault(); handleNavClick('home'); }}>
              <img className="h-24 w-auto" src="/src/assets/images/logo.jpg" alt="AI Resume Tailor Logo" />
            </a>
          </div>

          {/* Desktop Branding - Hidden on mobile */}
          <div className="hidden lg:flex items-center">
            <span className="text-sm text-slate-500 dark:text-slate-400">Powered by AI • Free Forever</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            <a href="/analyze" onClick={(e) => { e.preventDefault(); handleNavClick('analyze'); }} className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">Analyze Resume</a>
            <a href="/#how-it-works" onClick={(e) => { e.preventDefault(); handleNavClick('home#how-it-works'); }} className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">How It Works</a>
            <a href="/privacy" onClick={(e) => { e.preventDefault(); handleNavClick('privacy'); }} className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">Privacy</a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-700">
          {/* Mobile Branding Header */}
          <div className="px-4 pt-3 pb-2 border-b border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <span className="text-sm text-slate-500 dark:text-slate-400">Powered by AI • Free Forever</span>
            </div>
          </div>
          {/* Mobile Nav Links */}
          <div className="px-2 pt-2 pb-3 space-y-1">
            <a href="/analyze" onClick={(e) => { e.preventDefault(); handleNavClick('analyze'); }} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-800">Analyze Resume</a>
            <a href="/#how-it-works" onClick={(e) => { e.preventDefault(); handleNavClick('home#how-it-works'); }} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-800">How It Works</a>
            <a href="/privacy" onClick={(e) => { e.preventDefault(); handleNavClick('privacy'); }} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-800">Privacy</a>
          </div>
        </div>
      )}
    </header>
  );
}

