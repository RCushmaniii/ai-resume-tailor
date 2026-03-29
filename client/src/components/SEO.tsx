import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const SITE_URL = 'https://resume.cushlabs.ai';
const DEFAULT_OG_IMAGE = `${SITE_URL}/images/ai-resume-tailor-thumb.jpg`;

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  path?: string;
}

export function SEO({ title, description, keywords, ogImage, path = '/' }: SEOProps) {
  const { i18n } = useTranslation();
  const lang = i18n.language || 'en';
  const resolvedOgImage = ogImage || DEFAULT_OG_IMAGE;
  const canonical = `${SITE_URL}${path}`;
  const ogLocale = lang === 'es' ? 'es_MX' : 'en_US';
  const ogLocaleAlt = lang === 'es' ? 'en_US' : 'es_MX';

  useEffect(() => {
    // Set page title
    document.title = title;

    // Set html lang attribute dynamically
    document.documentElement.lang = lang;

    // Helper to set/create meta tags
    const setMetaTag = (name: string, content: string, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Helper to set/create link tags
    const setLinkTag = (rel: string, href: string, attrs?: Record<string, string>) => {
      const selector = attrs
        ? `link[rel="${rel}"][hreflang="${attrs.hreflang || ''}"]`
        : `link[rel="${rel}"]:not([hreflang])`;
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', rel);
        document.head.appendChild(element);
      }
      element.setAttribute('href', href);
      if (attrs) {
        Object.entries(attrs).forEach(([k, v]) => element!.setAttribute(k, v));
      }
    };

    // Basic meta
    setMetaTag('description', description);
    if (keywords) setMetaTag('keywords', keywords);

    // Open Graph
    setMetaTag('og:title', title, true);
    setMetaTag('og:description', description, true);
    setMetaTag('og:type', 'website', true);
    setMetaTag('og:url', canonical, true);
    setMetaTag('og:image', resolvedOgImage, true);
    setMetaTag('og:site_name', 'AI Resume Tailor', true);
    setMetaTag('og:locale', ogLocale, true);
    setMetaTag('og:locale:alternate', ogLocaleAlt, true);

    // Twitter Card
    setMetaTag('twitter:card', 'summary_large_image');
    setMetaTag('twitter:title', title);
    setMetaTag('twitter:description', description);
    setMetaTag('twitter:image', resolvedOgImage);

    // Canonical
    setLinkTag('canonical', canonical);

    // Hreflang tags
    setLinkTag('alternate', canonical, { hreflang: 'en' });
    setLinkTag('alternate', canonical, { hreflang: 'es' });
    setLinkTag('alternate', canonical, { hreflang: 'x-default' });
  }, [title, description, keywords, resolvedOgImage, canonical, lang, ogLocale, ogLocaleAlt]);

  return null;
}
