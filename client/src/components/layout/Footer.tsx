// File: src/components/layout/Footer.tsx
import logoImage from '@/assets/images/logo.jpg';
import logoImageES from '@/assets/images/ai resume tailor logo es.jpg';
import { Github, Twitter, Linkedin } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type FooterProps = {
  navigate: (page: string) => void;
};

export function Footer({ navigate }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const { t, i18n } = useTranslation();

  // Select appropriate logo based on current language
  const currentLogoImage = i18n.language === 'es' ? logoImageES : logoImage;

  const linkStyles = "text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200";
  const headingStyles = "text-sm font-semibold text-gray-900 dark:text-white tracking-wider uppercase mb-3";

  // Footer links configuration following DRY principle
  const footerLinks = {
    product: [
      { key: 'analyze', href: '/analyze', page: 'analyze' },
      { key: 'howItWorks', href: '/#how-it-works', page: 'home#how-it-works' },
      { key: 'features', href: '/#features', page: 'home#features' },
      { key: 'faq', href: '/#faq', page: 'home#faq' },
    ],
    resources: [
      { key: 'documentation', href: '/docs', page: 'docs/index' },
      { key: 'resumeTips', href: '/', page: 'home' },
      { key: 'atsGuide', href: '/', page: 'home' },
      { key: 'support', href: '/', page: 'home' },
    ],
    legal: [
      { key: 'privacy', href: '/privacy', page: 'privacy' },
      { key: 'terms', href: '/terms', page: 'terms' },
      { key: 'cookiePolicy', href: '/cookie', page: 'cookie' },
    ],
  };

  // Social media links
  const socialLinks = [
    { 
      name: 'GitHub', 
      href: 'https://github.com/RCushmaniii/ai-resume-tailor', 
      icon: Github,
      ariaLabel: 'GitHub'
    },
    { 
      name: 'X (Twitter)', 
      href: 'https://twitter.com', 
      icon: Twitter,
      ariaLabel: 'X (Twitter)'
    },
    { 
      name: 'LinkedIn', 
      href: 'https://linkedin.com', 
      icon: Linkedin,
      ariaLabel: 'LinkedIn'
    },
  ];

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

  const renderLinkColumn = (links: typeof footerLinks.product, columnKey: string) => (
    <nav role="navigation" aria-label={`${t(`footer.columns.${columnKey}`)} links`}>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.key}>
            <a 
              href={link.href} 
              onClick={(e) => { e.preventDefault(); handleNavClick(link.page); }} 
              className={linkStyles}
            >
              {t(`footer.links.${link.key}`)}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Main footer content - 4 column grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Column 1: Product */}
          <div className="space-y-2">
            <h3 className={headingStyles}>{t('footer.columns.product')}</h3>
            {renderLinkColumn(footerLinks.product, 'product')}
          </div>

          {/* Column 2: Resources */}
          <div className="space-y-2">
            <h3 className={headingStyles}>{t('footer.columns.resources')}</h3>
            {renderLinkColumn(footerLinks.resources, 'resources')}
          </div>
          
          {/* Column 3: Legal */}
          <div className="space-y-2">
            <h3 className={headingStyles}>{t('footer.columns.legal')}</h3>
            {renderLinkColumn(footerLinks.legal, 'legal')}
          </div>

          {/* Column 4: Brand & Social */}
          <div className="space-y-4">
            {/* Logo */}
            <div className="flex flex-col items-center lg:items-start">
              <a href="/" onClick={(e) => { e.preventDefault(); handleNavClick('home'); }}>
                <img className="h-16 w-auto mb-4" src={currentLogoImage} alt={t('footer.logoAlt')} />
              </a>
            </div>

            {/* Social Media Icons */}
            <div className="flex items-center justify-center lg:justify-start space-x-4">
              {socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <a 
                    key={social.name}
                    href={social.href} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    aria-label={social.ariaLabel}
                    className="text-gray-400 hover:text-blue-600 transition-colors duration-200"
                  >
                    <IconComponent className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
        
        {/* Copyright notice */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
            {t('footer.copyright', { year: currentYear })}
          </p>
        </div>
      </div>
    </footer>
  );
}