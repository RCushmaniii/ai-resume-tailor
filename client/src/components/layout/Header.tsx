// File: src/components/layout/Header.tsx
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { LanguageToggle } from '@/components/layout/LanguageToggle';
import { useAuth } from '@/lib/useAuth';
import { toast } from 'sonner';
import logoImage from '@/assets/images/logo.jpg';
import logoNoTextImage from '@/assets/images/ai resume tailor notext logo .jpg';
import logoImageES from '@/assets/images/ai resume tailor logo es.jpg';
import { useSignInPrompt } from '@/contexts/SignInPromptContext';
import { AuthDialog } from '@/components/auth/AuthDialog';

type HeaderProps = {
  navigate: (page: string) => void;
};

export function Header({ navigate }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { enabled: authEnabled, user, supabase } = useAuth();
  const { t, i18n } = useTranslation();
  const { showSignIn } = useSignInPrompt();

  // Select appropriate logos based on current language
  const currentLogoImage = i18n.language === 'es' ? logoImageES : logoImage;
  // No-text logo is the same for both languages (no text to translate)

  const handleSignOut = async () => {
    if (!supabase) return;
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(t('header.toasts.signOutFailed'), {
        description: error.message,
        duration: 8000,
      });
      return;
    }
    toast.success(t('header.toasts.signedOut'));
  };

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

  // Add scroll effect with proper debouncing
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let lastScrollY = window.scrollY;
    let lastIsScrolled = window.scrollY > 50;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const currentIsScrolled = currentScrollY > 50;
      
      // Only update if the scrolled state actually changes
      if (currentIsScrolled !== lastIsScrolled) {
        // Clear existing timeout
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        
        // Debounce to prevent rapid changes
        timeoutId = setTimeout(() => {
          setIsScrolled(currentIsScrolled);
          lastIsScrolled = currentIsScrolled;
        }, 150);
        
        lastScrollY = currentScrollY;
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  return (
    <header className={`bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'py-2' : 'py-4'}`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex items-center justify-between transition-all duration-300 ${isScrolled ? 'h-16' : 'h-24'}`}>
          {/* Logo and Branding */}
          <div className="flex-shrink-0">
            <a href="/" onClick={(e) => { e.preventDefault(); handleNavClick('home'); }}>
              <img className={`transition-all duration-300 ${isScrolled ? 'h-16' : 'h-24'} w-auto`} src={isScrolled ? logoNoTextImage : currentLogoImage} alt={t('header.logoAlt')} />
            </a>
          </div>

          {/* Desktop Branding - Hidden on mobile */}
          <div className={`hidden lg:flex items-center transition-all duration-300 ${isScrolled ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'}`}>
            <span className="text-sm text-slate-500 dark:text-slate-400">{t('header.tagline')}</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            <Button onClick={() => handleNavClick('analyze')} className="bg-blue-600 hover:bg-blue-700 text-white font-medium">
              {t('header.nav.analyze')}
            </Button>
            <a href="/methodology" onClick={(e) => { e.preventDefault(); handleNavClick('methodology'); }} className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">{t('header.nav.forRecruiters')}</a>
            <a href="/docs" onClick={(e) => { e.preventDefault(); handleNavClick('docs/index'); }} className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">{t('header.nav.docs')}</a>

            <LanguageToggle variant="ghost" />

            {authEnabled && showSignIn ? (
              user ? (
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-500 dark:text-slate-400 max-w-[180px] truncate" title={user.email ?? undefined}>
                    {user.email ?? t('header.auth.signedIn')}
                  </span>
                  <Button variant="outline" onClick={handleSignOut}>
                    {t('header.auth.signOut')}
                  </Button>
                </div>
              ) : (
                <AuthDialog triggerLabel={t('header.auth.signIn')} />
              )
            ) : null}
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
              <span className="text-sm text-slate-500 dark:text-slate-400">{t('header.tagline')}</span>
            </div>
            <div className="mt-2 flex justify-center">
              <LanguageToggle variant="ghost" />
            </div>
          </div>
          {/* Mobile Nav Links */}
          <div className="px-2 pt-2 pb-3 space-y-1">
            <a href="/analyze" onClick={(e) => { e.preventDefault(); handleNavClick('analyze'); }} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-800">{t('header.nav.analyze')}</a>
            <a href="/methodology" onClick={(e) => { e.preventDefault(); handleNavClick('methodology'); }} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-800">{t('header.nav.forRecruiters')}</a>
            <a href="/docs" onClick={(e) => { e.preventDefault(); handleNavClick('docs/index'); }} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-800">{t('header.nav.documentation')}</a>

            {authEnabled && showSignIn && (
              <div className="px-2 py-2">
                {user ? (
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-800"
                  >
                    {t('header.auth.signOut')}
                  </button>
                ) : (
                  <AuthDialog triggerLabel={t('header.auth.signIn')} />
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
