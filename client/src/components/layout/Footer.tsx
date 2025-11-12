// File: src/components/layout/Footer.tsx

type FooterProps = {
  navigate: (page: string) => void;
};

export function Footer({ navigate }: FooterProps) {
  const currentYear = new Date().getFullYear();

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
              <img className="h-16 w-auto" src="/src/assets/images/logo.jpg" alt="AI Resume Tailor logo" />
            </a>
          </div>
        </div>
        
        {/* Main footer content */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-4 sm:gap-x-6 md:gap-x-8">
          
          {/* Column 1: Product */}
          <div className="space-y-2">
            <h3 className={headingStyles}>Product</h3>
            <ul className="space-y-2">
              <li><a href="/analyze" onClick={(e) => { e.preventDefault(); handleNavClick('analyze'); }} className={linkStyles}>Analyze Resume</a></li>
              <li><a href="/#how-it-works" onClick={(e) => { e.preventDefault(); handleNavClick('home#how-it-works'); }} className={linkStyles}>How It Works</a></li>
              <li><a href="/#features" onClick={(e) => { e.preventDefault(); handleNavClick('home#features'); }} className={linkStyles}>Features</a></li>
              <li><a href="/#faq" onClick={(e) => { e.preventDefault(); handleNavClick('home#faq'); }} className={linkStyles}>FAQ</a></li>
            </ul>
          </div>

          {/* Column 2: Resources */}
          <div className="space-y-2">
            <h3 className={headingStyles}>Resources</h3>
            <ul className="space-y-2">
              <li><a href="/" onClick={(e) => { e.preventDefault(); handleNavClick('home'); }} className={linkStyles}>Resume Tips</a></li>
              <li><a href="/" onClick={(e) => { e.preventDefault(); handleNavClick('home'); }} className={linkStyles}>ATS Guide</a></li>
              <li><a href="/" onClick={(e) => { e.preventDefault(); handleNavClick('home'); }} className={linkStyles}>Blog</a></li>
              <li><a href="https://github.com/RCushmaniii/ai-resume-tailor" target="_blank" rel="noopener noreferrer" className={linkStyles}>GitHub</a></li>
            </ul>
          </div>
          
          {/* Column 3: Legal */}
          <div className="space-y-2">
            <h3 className={headingStyles}>Legal</h3>
            <ul className="space-y-2">
              <li><a href="/privacy" onClick={(e) => { e.preventDefault(); handleNavClick('privacy'); }} className={linkStyles}>Privacy Policy</a></li>
              <li><a href="/terms" onClick={(e) => { e.preventDefault(); handleNavClick('terms'); }} className={linkStyles}>Terms of Service</a></li>
            </ul>
          </div>

          {/* Column 4: Branding/Logo - Hidden on mobile, shown on tablet and up */}
          <div className="hidden sm:flex items-start justify-end">
            <div className="flex flex-col items-center">
              <a href="/" onClick={(e) => { e.preventDefault(); handleNavClick('home'); }}>
                <img className="h-16 w-auto mb-2" src="/src/assets/images/logo.jpg" alt="AI Resume Tailor logo" />
              </a>
              <span className="text-sm text-slate-500 text-center">Powered by AI<br/>Free Forever</span>
            </div>
          </div>

        </div>
        
        {/* Copyright notice */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">&copy; {currentYear} AI Resume Tailor. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}