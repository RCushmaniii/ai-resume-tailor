// File: src/components/layout/Footer.tsx
import logoImage from '@/assets/images/logo.jpg';
import { useTranslation } from 'react-i18next';

type FooterProps = {
  navigate: (page: string) => void;
};

export function Footer({ navigate }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const { t } = useTranslation();

  const linkStyles = "text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200";
  const headingStyles = "text-sm font-semibold text-gray-900 dark:text-white tracking-wider uppercase mb-3";

  const handleNavClick = (page: string) => {
    // Handle anchor links (e.g., "home#how-it-works")
    if (page.includes('#')) {
      const [pageName, anchor] = page.split('#');
      navigate(pageName || 'home');
      
      // Wait for navigation, then scroll to anchor
      setTimeout(() => {
        const element = document.getElementById(anchor);
        if (element) {
          const headerOffset = 100;
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
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Logo for mobile - centered at the top */}
        <div className="flex justify-center mb-8 sm:hidden">
          <div className="flex flex-col items-center">
            <a href="/" onClick={(e) => { e.preventDefault(); handleNavClick('home'); }}>
              <img className="h-16 w-auto" src={logoImage} alt={t('footer.logoAlt')} />
            </a>
          </div>
        </div>
        
        {/* Main footer content */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-4 sm:gap-x-6 md:gap-x-8">
          
          {/* Column 1: Product */}
          <div className="space-y-2">
            <h3 className={headingStyles}>{t('footer.columns.product')}</h3>
            <ul className="space-y-2">
              <li><a href="/analyze" onClick={(e) => { e.preventDefault(); handleNavClick('analyze'); }} className={linkStyles}>{t('footer.links.analyze')}</a></li>
              <li><a href="/#how-it-works" onClick={(e) => { e.preventDefault(); handleNavClick('home#how-it-works'); }} className={linkStyles}>{t('footer.links.howItWorks')}</a></li>
              <li><a href="/#features" onClick={(e) => { e.preventDefault(); handleNavClick('home#features'); }} className={linkStyles}>{t('footer.links.features')}</a></li>
              <li><a href="/#faq" onClick={(e) => { e.preventDefault(); handleNavClick('home#faq'); }} className={linkStyles}>{t('footer.links.faq')}</a></li>
            </ul>
          </div>

          {/* Column 2: Resources */}
          <div className="space-y-2">
            <h3 className={headingStyles}>{t('footer.columns.resources')}</h3>
            <ul className="space-y-2">
              <li><a href="/docs" onClick={(e) => { e.preventDefault(); handleNavClick('docs/index'); }} className={linkStyles}>{t('footer.links.documentation')}</a></li>
              <li><a href="/" onClick={(e) => { e.preventDefault(); handleNavClick('home'); }} className={linkStyles}>{t('footer.links.resumeTips')}</a></li>
              <li><a href="/" onClick={(e) => { e.preventDefault(); handleNavClick('home'); }} className={linkStyles}>{t('footer.links.atsGuide')}</a></li>
              <li><a href="https://github.com/RCushmaniii/ai-resume-tailor" target="_blank" rel="noopener noreferrer" className={linkStyles}>{t('footer.links.github')}</a></li>
            </ul>
          </div>
          
          {/* Column 3: Legal */}
          <div className="space-y-2">
            <h3 className={headingStyles}>{t('footer.columns.legal')}</h3>
            <ul className="space-y-2">
              <li><a href="/privacy" onClick={(e) => { e.preventDefault(); handleNavClick('privacy'); }} className={linkStyles}>{t('footer.links.privacy')}</a></li>
              <li><a href="/terms" onClick={(e) => { e.preventDefault(); handleNavClick('terms'); }} className={linkStyles}>{t('footer.links.terms')}</a></li>
            </ul>
          </div>

          {/* Column 4: Branding/Logo - Hidden on mobile, shown on tablet and up */}
          <div className="hidden sm:flex items-start justify-end">
            <div className="flex flex-col items-center">
              <a href="/" onClick={(e) => { e.preventDefault(); handleNavClick('home'); }}>
                <img className="h-16 w-auto mb-2" src={logoImage} alt={t('footer.logoAlt')} />
              </a>
              <span className="text-sm text-slate-500 text-center">{t('footer.tagline')}</span>
            </div>
          </div>

        </div>
        
        {/* Copyright notice */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">{t('footer.copyright', { year: currentYear })}</p>
        </div>
      </div>
    </footer>
  );
}